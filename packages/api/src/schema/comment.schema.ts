import { z } from "zod";

export const createSchema = z.object({
  thoughtId: z.number(),
  text: z.string(),
});
export const onCreateSchema = z.object({
  thoughtId: z.number(),
  userId: z.number(),
});
export const onNewCommentNotificationSchema = z.object({
  userId: z.number(),
});
