import { z } from "zod";

export const validatePhoneNumberSchema = z.object({
  phoneNumber: z.string(),
});
export const loginOrFailSchema = z.object({
  phoneNumber: z.string(),
  pin: z.string(),
});
