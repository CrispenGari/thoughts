import { Survey } from "../../sequelize/survey.model";
import { publicProcedure, router } from "../../trpc";

export const surveyRouter = router({
  all: publicProcedure.query(async () => {
    try {
      const surveys = await Survey.findAll({
        attributes: ["id", "createdAt", "reason"],
      });
      return surveys.map((s) => s.toJSON());
    } catch (error) {
      return [];
    }
  }),
});
