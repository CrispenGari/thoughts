import { contactSchema, getSchema } from "../../schema/user.schema";
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
  get: publicProcedure.input(getSchema).query(async ({ input: { id } }) => {
    try {
      const u = await User.findByPk(id, {
        include: { all: true },
      });
      return !!u ? u.toJSON() : null;
    } catch (error) {
      return null;
    }
  }),
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
