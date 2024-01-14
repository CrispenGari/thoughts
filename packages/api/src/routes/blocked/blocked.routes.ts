import { blockSchema } from "../../schema/blocked.schema";
import { User } from "../../sequelize/user.model";
import { publicProcedure, router } from "../../trpc";

export const blockedRouter = router({
  block: publicProcedure
    .input(blockSchema)
    .mutation(async ({ ctx: { me }, input: { id } }) => {
      try {
        if (!!!me) return { success: false };
        const user = await User.findByPk(id);
        if (!!!user) return { success: false };
        return { success: true };
      } catch (error) {
        return {
          success: false,
        };
      }
    }),
});
