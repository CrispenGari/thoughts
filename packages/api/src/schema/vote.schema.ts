import { z } from "zod";

export const replyVoteSchema = z.object({ replyId: z.number() });
export const onReplyVoteSchema = z.object({ replyId: z.number() });
export const onCommentVoteSchema = z.object({ commentId: z.number() });
export const commentVoteSchema = z.object({ commentId: z.number() });
export const onNewCommentVoteNotificationSchema = z.object({
  userId: z.number(),
});
export const onNewReplyVoteNotificationSchema = z.object({
  userId: z.number(),
});
