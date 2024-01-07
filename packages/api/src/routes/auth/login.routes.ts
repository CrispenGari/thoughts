import { verify } from "argon2";
import {
  loginOrFailSchema,
  validatePhoneNumberSchema,
} from "../../schema/login.schema";

import { publicProcedure, router } from "../../trpc";
import { isValidPhoneNumber } from "../../utils/regexp";
import { signJwt } from "../../utils/jwt";
import { User } from "../../sequelize/user.model";

export const loginRouter = router({
  validatePhoneNumber: publicProcedure
    .input(validatePhoneNumberSchema)
    .mutation(async ({ input: { user, country } }) => {
      try {
        const phoneNumber = `${country.phoneCode}${
          user.phoneNumber.startsWith("0")
            ? user.phoneNumber.substring(1)
            : user.phoneNumber
        }`.replace(/\s/g, "");
        if (!isValidPhoneNumber(phoneNumber.trim())) {
          return {
            error: "Invalid phone number.",
          };
        }
        const me = await User.findOne({
          where: { phoneNumber: phoneNumber.trim() },
        });

        if (!!!me) {
          return {
            error: "The phone number does not have an account with us.",
          };
        }
        return { phoneNumber };
      } catch (error: any) {
        return {
          error: error.message,
        };
      }
    }),
  loginOrFail: publicProcedure
    .input(loginOrFailSchema)
    .mutation(async ({ input: { user, country } }) => {
      try {
        const phoneNumber = user.phoneNumber.startsWith("+")
          ? user.phoneNumber
          : `${country.phoneCode}${
              user.phoneNumber.startsWith("0")
                ? user.phoneNumber.substring(1)
                : user.phoneNumber
            }`.replace(/\s/g, "");
        const me = await User.findOne({
          where: { phoneNumber: phoneNumber.trim() },
        });
        if (!!!me) {
          return {
            error: "The phone number does not have an account.",
          };
        }
        const __me = me.toJSON();
        if (__me.pinTrials === 5) {
          return {
            error:
              "You have exceeded the pin trials, your account has been blocked.",
          };
        }
        const valid = await verify(__me.pin, user.pin);
        if (!valid) {
          await me.increment("pinTrials", { by: 1 });
          const uu = await me.save();
          return {
            error: `Invalid pin code, try again ${
              4 - uu.toJSON().pinTrials
            } left!`,
          };
        }
        const __u = await me.update({
          pinTrials: 0,
          online: true,
        });
        const u = __u.toJSON();
        const jwt = await signJwt(u);
        return { jwt };
      } catch (error: any) {
        return {
          error: error.message,
        };
      }
    }),
});
