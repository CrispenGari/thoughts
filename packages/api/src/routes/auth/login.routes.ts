import { verify } from "argon2";
import {
  loginOrFailSchema,
  validatePhoneNumberSchema,
} from "../../schema/login.schema";
import { User } from "../../sequelize/models";
import { publicProcedure, router } from "../../trpc";
import { isValidPhoneNumber } from "../../utils/regexp";
import { signJwt } from "../../utils/jwt";

export const loginRouter = router({
  validatePhoneNumber: publicProcedure
    .input(validatePhoneNumberSchema)
    .mutation(async ({ input: { phoneNumber } }) => {
      try {
        const me = await User.findOne({
          where: { phoneNumber: phoneNumber.trim() },
        });
        if (!isValidPhoneNumber(phoneNumber.trim())) {
          return {
            error: "Invalid phone number.",
          };
        }
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
    .mutation(async ({ input: { phoneNumber, pin } }) => {
      try {
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
        const valid = await verify(__me.pin, pin);
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
