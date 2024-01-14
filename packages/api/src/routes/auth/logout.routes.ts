import { User } from "../../sequelize/user.model";
import { publicProcedure, router } from "../../trpc";
import crypto from "crypto";
export const logoutRouter = router({
  logout: publicProcedure.mutation(async ({ ctx: { me } }) => {
    try {
      if (!!!me) return false;
      const newToken = crypto.randomInt(1, 10_000_000);
      const [uu] = await User.update(
        { online: false, tokenVersion: newToken },
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
