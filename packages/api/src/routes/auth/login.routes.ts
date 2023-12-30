import { validatePhoneNumberSchema } from "../../schema/register.schema";
import { User } from "../../sequelize/models";
import { publicProcedure, router } from "../../trpc";
import { isValidPhoneNumber } from "../../utils/regexp";

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
});
