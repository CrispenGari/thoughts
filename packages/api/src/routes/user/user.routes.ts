import { contactSchema } from "../../schema/user.schema";
import { Thought, User } from "../../sequelize/models";
import { publicProcedure, router } from "../../trpc";

export const userRouter = router({
  me: publicProcedure.query(({ ctx: { me } }) => {
    return { me };
  }),
  contact: publicProcedure.input(contactSchema).query(
    async ({
      input: {
        input: { contactName, phoneNumbers },
      },
    }) => {
      const user = await User.findOne({
        where: { phoneNumber: phoneNumbers },
      });
      if (user) {
        console.log(user.toJSON());
      }

      return {
        user: user ? user.toJSON() : null,
        contactName,
      };
    }
  ),
  get: publicProcedure.query(async ({}) => {}),
  all: publicProcedure.query(async () => {
    try {
      const users = await User.findAll({
        include: {
          model: Thought,
          required: false,
        },
      });
      return { users };
    } catch (error: any) {
      return {
        users: [],
      };
    }
  }),
});
