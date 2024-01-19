import { z } from "zod";

export const onUserSettingsUpdateSchema = z.object({
  userId: z.number(),
});
export const onSettingsUpdateSchema = z.object({
  userId: z.number(),
});
