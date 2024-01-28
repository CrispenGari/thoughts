import { z } from "zod";

export const createSchema = z.object({
  thought: z.string(),
  contacts: z.string(),
});
export const onUpdateSchema = z.object({
  userId: z.number(),
});
export const getByIdSchema = z.object({
  id: z.number(),
});
export const onDeleteSchema = z.object({
  userId: z.number(),
});
export const onCreateSchema = z.object({
  userId: z.number(),
});
export const onCreateNotificationSchema = z.object({
  userId: z.number(),
});
export const getUserThoughtSchema = z.object({
  userId: z.number(),
});

export const updateSchema = z.object({
  thought: z.string(),
});
