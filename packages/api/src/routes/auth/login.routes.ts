import { hash, verify } from "argon2";
import {
  changePinAndLoginOrFailSchema,
  getPassKeyQuestionSchema,
  loginOrFailSchema,
  validatePhoneNumberSchema,
  verifyPasskeySchema,
} from "../../schema/login.schema";
import crypto from "crypto";
import { publicProcedure, router } from "../../trpc";
import { isValidPhoneNumber } from "../../utils/regexp";
import { signJwt } from "../../utils/jwt";
import { User } from "../../sequelize/user.model";

export const loginRouter = router({
  validatePhoneNumber: publicProcedure
    .input(validatePhoneNumberSchema)
    .mutation(async ({ input: { user, country } }) => {
      try {
        const phoneNumber = user.phoneNumber.startsWith("+")
          ? user.phoneNumber
          : `${country.phoneCode}${
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
        const newToken = crypto.randomInt(1, 10_000_000);
        const __u = await me.update({
          pinTrials: 0,
          online: true,
          tokenVersion: newToken,
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
  getPassKeyQuestion: publicProcedure
    .input(getPassKeyQuestionSchema)
    .query(async ({ input: { user, country } }) => {
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
            passkeyQuestion:
              "No passkey question found, for your phone number.",
          };
        }
        return { passkeyQuestion: me.toJSON().passkeyQuestion };
      } catch (error: any) {
        return {
          passkeyQuestion: "No passkey question found, for your phone number.",
        };
      }
    }),

  verifyPasskey: publicProcedure
    .input(verifyPasskeySchema)
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
        if (!!!me)
          return { success: false, error: "You are not authenticated." };

        const __me = me.toJSON();
        const valid = await verify(__me.passkey, user.passkey.trim());
        if (!valid) {
          return {
            error: `Invalid passkey try again.`,
            success: false,
          };
        }
        await me.update({
          pinTrials: 0,
        });
        return {
          success: true,
          error: null,
        };
      } catch (error) {
        return { success: false, error: "Internal server error." };
      }
    }),

  changePinAndLoginOrFail: publicProcedure
    .input(changePinAndLoginOrFailSchema)
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

            success: false,
            jwt: null,
          };
        }
        if (user.pin.trim().length !== 5) {
          return {
            error: "The pin code can only be 5 digits.",
            success: false,
            jwt: null,
          };
        }
        const __me = me.toJSON();
        const valid = await verify(__me.pin, user.pin.trim());
        if (valid) {
          return {
            error: "You can not change your pin code to the old pin.",
            success: false,
            jwt: null,
          };
        }
        const hashedPin = await hash(user.pin.trim());
        const newToken = crypto.randomInt(1, 10_000_000);
        const __u = await me.update({
          pinTrials: 0,
          online: true,
          tokenVersion: newToken,
          pin: hashedPin,
        });
        const u = __u.toJSON();
        const jwt = await signJwt(u);
        return { jwt, success: true, error: null };
      } catch (error: any) {
        return {
          error: error.message,

          success: false,
          jwt: null,
        };
      }
    }),
});
