import { z } from "zod";

export const createSchema = z.object({
  thoughtId: z.number(),
  text: z.string(),
});
export const getReplySchema = z.object({
  id: z.number(),
});
export const getCommentsSchema = z.object({
  thoughtId: z.number(),
  cursor: z.number().optional(),
  limit: z.number(),
});

export const getRepliesSchema = z.object({
  commentId: z.number(),
  cursor: z.number().optional(),
  limit: z.number(),
});
export const getCommentSchema = z.object({
  id: z.number(),
});

export const replySchema = z.object({
  commentId: z.number(),
  text: z.string(),
  mentions: z.number().array(),
});
export const onCreateSchema = z.object({
  thoughtId: z.number(),
  userId: z.number(),
});
export const onReplySchema = z.object({
  commentId: z.number(),
  userId: z.number(),
});
export const onNewCommentNotificationSchema = z.object({
  userId: z.number(),
});
