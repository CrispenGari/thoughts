import { createSchema } from "../../schema/thought.schema";
import { Thought } from "../../sequelize/models";
import { publicProcedure, router } from "../../trpc";

export const thoughtRouter = router({
  create: publicProcedure
    .input(createSchema)
    .mutation(async ({ input: { thought }, ctx: { me } }) => {
      try {
        if (!!!me)
          return {
            error: "You are not logged in.",
          };
        if (thought.trim().length < 3)
          return {
            error: "The thought text should be having at least 3 characters",
          };
        const payload = await Thought.create({
          text: thought.trim(),
          userId: me.id,
        });

        return { thought: payload.toJSON() };
      } catch (error) {
        return {
          error: "Something went wrong on the server.",
        };
      }
    }),

  get: publicProcedure.query(async ({ ctx: { me } }) => {
    try {
      if (!!!me) return null;
      const payload = await Thought.findOne({
        where: { userId: me.id },
      });
      console.log({ payload: payload?.toJSON() });
      return !!payload ? payload.toJSON() : null;
    } catch (error) {
      return null;
    }
  }),
});
