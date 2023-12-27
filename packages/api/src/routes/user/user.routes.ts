import { createSchema } from "../../schema/user.schema";
import { User } from "../../sequelize/models";
import { publicProcedure, router } from "../../trpc";
import { signJwt } from "../../utils/jwt";
import { isValidPassword, isValidPhoneNumber } from "../../utils/regexp";
import { hash } from "argon2";

export const userRouter = router({
  create: publicProcedure
    .input(createSchema)
    .mutation(async ({ input: { password, phoneNumber, name } }) => {
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
        if (name.trim().length < 3 || name.trim().length >= 20) {
          return {
            error:
              "The name must have a minimum of 3 characters and a maximum of 20 characters.",
          };
        }
        if (!isValidPassword(password.trim())) {
          return {
            error: "Invalid password try a stronger password.",
          };
        }

        const hashed = await hash(password.trim());
        const user = await User.create({
          password: hashed,
          name: name.trim(),
          phoneNumber: phoneNumber.trim(),
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
  me: publicProcedure.query(({ ctx: { me } }) => {
    return { me };
  }),
  get: publicProcedure.query(async ({}) => {}),
  all: publicProcedure.query(async () => {
    try {
      const users = await User.findAll();
      return { users };
    } catch (error: any) {
      return {
        users: [],
      };
    }
  }),
});
