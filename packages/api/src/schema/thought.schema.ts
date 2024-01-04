import { z } from "zod";

export const createSchema = z.object({
  thought: z.string(),
});
