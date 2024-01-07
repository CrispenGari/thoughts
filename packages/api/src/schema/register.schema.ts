import { z } from "zod";

export const validatePhoneNumberSchema = z.object({
  user: z.object({
    phoneNumber: z.string(),
  }),
  country: z.object({
    name: z.string(),
    phoneCode: z.string(),
    flag: z.string(),
    countryCode: z.string(),
  }),
});

export const validatePinSchema = z.object({
  pin1: z.string(),
  pin2: z.string(),
});
export const onNewUserSchema = z.object({
  userId: z.number(),
});
export const createUserOrFailSchema = z.object({
  user: z.object({
    pin: z.string(),
    name: z.string(),
    phoneNumber: z.string(),
    image: z.string().nullable(),
  }),
  country: z.object({
    name: z.string(),
    phoneCode: z.string(),
    flag: z.string(),
    countryCode: z.string(),
  }),
});
