import { z } from "zod";

export const validatePhoneNumberSchema = z.object({
  phoneNumber: z.string(),
});

export const validatePinSchema = z.object({
  pin1: z.string(),
  pin2: z.string(),
});
export const createUserOrFailSchema = z.object({
  pin: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
});
