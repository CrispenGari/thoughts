import { publicProcedure, router } from "../../trpc";
import { User } from "../../sequelize/models";
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
