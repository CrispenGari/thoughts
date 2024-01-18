import { z } from "zod";

export const paySchema = z.object({
  category: z.enum(["active_status", "general"]),
  type: z.enum(["e-payment", "cash"]).default("e-payment"),
});
export const onPaySchema = z.object({
  userId: z.number(),
});
