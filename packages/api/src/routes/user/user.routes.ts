import { User } from "../../sequelize/models";
import { publicProcedure, router } from "../../trpc";

export const userRouter = router({
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
