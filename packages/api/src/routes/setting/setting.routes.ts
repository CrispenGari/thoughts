import { publicProcedure, router } from "../../trpc";

export const settingRouter = router({
  settings: publicProcedure.query(async ({ ctx: { me } }) => {}),
});
