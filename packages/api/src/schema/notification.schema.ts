import { z } from "zod";

export const delSchema = z.object({
  id: z.number(),
});
export const onReadSchema = z.object({
  userId: z.number(),
});
export const onUnReadSchema = z.object({
  userId: z.number(),
});
export const onDeleteSchema = z.object({
  userId: z.number(),
});
export const readSchema = z.object({
  id: z.number(),
});
export const unReadSchema = z.object({
  id: z.number(),
});
