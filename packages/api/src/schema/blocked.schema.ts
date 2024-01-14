import { z } from "zod";

export const blockSchema = z.object({
  id: z.number(),
});
export const unblockSchema = z.object({
  phoneNumber: z.string(),
});
