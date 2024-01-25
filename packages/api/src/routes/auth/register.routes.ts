import { hash } from "argon2";
import {
  validatePhoneNumberSchema,
  validatePinSchema,
  createUserOrFailSchema,
  onNewUserSchema,
} from "../../schema/register.schema";

import { publicProcedure, router } from "../../trpc";
import { signJwt } from "../../utils/jwt";
import { isValidPhoneNumber } from "../../utils/regexp";
import { User } from "../../sequelize/user.model";
import { Country } from "../../sequelize/country.model";
import EventEmitter from "events";
import { UserType } from "../../types";
import { observable } from "@trpc/server/observable";
import { Events } from "../../constants";
import crypto from "crypto";
import { Setting } from "../../sequelize/setting.model";
const ee = new EventEmitter();
export const registerRouter = router({
  onNewUser: publicProcedure
    .input(onNewUserSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<UserType>((emit) => {
        const handler = (payload: UserType) => {
          if (payload.id !== userId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_NEW_USER, handler);
        return () => {
          ee.off(Events.ON_NEW_USER, handler);
        };
      });
    }),
  validatePhoneNumber: publicProcedure
    .input(validatePhoneNumberSchema)
    .mutation(async ({ input: { user, country } }) => {
      try {
        const phoneNumber = `${country.phoneCode}${
          user.phoneNumber.startsWith("0")
            ? user.phoneNumber.substring(1)
            : user.phoneNumber
        }`.replace(/\s/g, "");
        const me = await User.findOne({
          where: { phoneNumber: phoneNumber.trim() },
        });
        if (!isValidPhoneNumber(phoneNumber.trim())) {
          return {
            error: "Invalid phone number.",
          };
        }
        if (!!me) {
          return {
            error: "The phone number is taken.",
          };
        }
        return { phoneNumber };
      } catch (error: any) {
        return {
          error: error.message,
        };
      }
    }),

  validatePin: publicProcedure
    .input(validatePinSchema)
    .mutation(async ({ input: { pin1, pin2 } }) => {
      try {
        if (pin1.trim().length !== 5) {
          return { retry: false, error: "The pin code can only be 5 digits." };
        }
        if (pin1.trim() !== pin2.trim()) {
          return { retry: true, error: "Pin miss match try again." };
        }
        return { pin: pin1 };
      } catch (error: any) {
        return {
          error: error.message,
          retry: true,
        };
      }
    }),
  createUserOrFail: publicProcedure
    .input(createUserOrFailSchema)
    .mutation(async ({ input: { country, user } }) => {
      try {
        if (user.name.trim().length < 3 || user.name.trim().length >= 20) {
          return {
            error:
              "The name must have a minimum of 3 characters and a maximum of 20 characters.",
          };
        }
        const hashedPin = await hash(user.pin.trim());
        const hashedPassKey = await hash(user.passkey.trim());
        const newToken = crypto.randomInt(1, 10_000_000);
        const me = await User.create({
          pin: hashedPin,
          name: user.name.trim(),
          phoneNumber: user.phoneNumber.trim(),
          online: true,
          avatar: user?.image ? user?.image : undefined,
          tokenVersion: newToken,
          passkey: hashedPassKey,
          passkeyQuestion: user.passkeyQuestion,
          gender: user.gender,
          bio: user.bio,
        });
        const u = me.toJSON();
        await Country.create({ ...country, userId: u.id });
        await Setting.create({
          activeStatus: true,
          notifications: true,
          userId: u.id,
        });
        ee.emit(Events.ON_NEW_USER, u);
        const jwt = await signJwt(u);
        return { jwt };
      } catch (error: any) {
        return {
          error: error.message,
        };
      }
    }),
});
