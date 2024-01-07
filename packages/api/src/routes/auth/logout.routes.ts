import { User } from "../../sequelize/user.model";
import { publicProcedure, router } from "../../trpc";

export const logoutRouter = router({
  logout: publicProcedure.mutation(async ({ ctx: { me } }) => {
    try {
      if (!!!me) return false;
      const [uu] = await User.update(
        { online: false },
        {
          where: {
            id: me.id,
          },
        }
      );
      return !!uu;
    } catch (error: any) {
      return false;
    }
  }),
});
