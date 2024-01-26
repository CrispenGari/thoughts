import { z } from "zod";

export const onDeleteReplySchema = z.object({
  commentId: z.number(),
});
export const onEditReplySchema = z.object({
  replyId: z.number(),
});
export const onNewCommentReplyNotificationSchema = z.object({
  userId: z.number(),
});
export const onNewCommentReplyMentionNotificationSchema = z.object({
  userId: z.number(),
});

export const getReplySchema = z.object({
  id: z.number(),
});
export const getRepliesSchema = z.object({
  commentId: z.number(),
  cursor: z.number().optional(),
  limit: z.number(),
});
export const replySchema = z.object({
  commentId: z.number(),
  text: z.string(),
  mentions: z.number().array(),
});

export const onReplySchema = z.object({
  commentId: z.number(),
});

export const editSchema = z.object({
  text: z.string(),
  replyId: z.number(),
});
export const delSchema = z.object({
  replyId: z.number(),
});
