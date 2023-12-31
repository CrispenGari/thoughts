import { hash } from "argon2";
import {
  validatePhoneNumberSchema,
  validatePinSchema,
  createUserOrFailSchema,
} from "../../schema/register.schema";
import { User } from "../../sequelize/models";
import { publicProcedure, router } from "../../trpc";
import { signJwt } from "../../utils/jwt";
import { isValidPhoneNumber } from "../../utils/regexp";
export const registerRouter = router({
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
    .mutation(async ({ input: { phoneNumber, name, pin } }) => {
      try {
        if (name.trim().length < 3 || name.trim().length >= 20) {
          return {
            error:
              "The name must have a minimum of 3 characters and a maximum of 20 characters.",
          };
        }
        const hashed = await hash(pin.trim());
        const user = await User.create({
          pin: hashed,
          name: name.trim(),
          phoneNumber: phoneNumber.trim(),
          online: true,
        });
        const u = user.toJSON();
        const jwt = await signJwt(u);
        return { jwt };
      } catch (error: any) {
        return {
          error: error.message,
        };
      }
    }),
});
