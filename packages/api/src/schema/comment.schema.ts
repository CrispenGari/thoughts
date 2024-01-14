import { z } from "zod";

export const createSchema = z.object({
  thoughtId: z.number(),
  text: z.string(),
});
export const editSchema = z.object({
  commentId: z.number(),
  text: z.string(),
});
export const delSchema = z.object({
  commentId: z.number(),
});

export const getCommentsSchema = z.object({
  thoughtId: z.number(),
  cursor: z.number().optional(),
  limit: z.number(),
});

export const getCommentSchema = z.object({
  id: z.number(),
});

export const onCreateSchema = z.object({
  thoughtId: z.number(),
  userId: z.number(),
});

export const onNewCommentNotificationSchema = z.object({
  userId: z.number(),
});
export const onEditedSchema = z.object({
  commentId: z.number(),
});
export const onDeleteSchema = z.object({
  thoughtId: z.number(),
});
