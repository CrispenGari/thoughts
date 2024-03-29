import { z } from "zod";

export const blockSchema = z.object({
  id: z.number(),
});
export const getSchema = z.object({
  id: z.number(),
});
export const unblockSchema = z.object({
  phoneNumber: z.string(),
});
export const onBlockerSchema = z.object({
  userId: z.number(),
});
export const onBlockedOrUnBlockedSchema = z.object({
  userId: z.number(),
});
export const onUnBlockedSchema = z.object({
  userId: z.number(),
});
