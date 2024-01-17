import { z } from "zod";

export const delSchema = z.object({
  thoughtId: z.number(),
  type: z.enum(["comment", "reply", "comment_reaction", "reply_reaction"]),
});
export const readSchema = z.object({
  thoughtId: z.number(),
  type: z.enum(["comment", "reply", "comment_reaction", "reply_reaction"]),
});
export const onReadSchema = z.object({
  userId: z.number(),
});

export const onDeleteSchema = z.object({
  userId: z.number(),
});
export const getSchema = z.object({
  id: z.number(),
});
