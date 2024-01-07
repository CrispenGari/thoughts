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
export const loginOrFailSchema = z.object({
  user: z.object({
    phoneNumber: z.string(),
    pin: z.string(),
  }),
  country: z.object({
    name: z.string(),
    phoneCode: z.string(),
    flag: z.string(),
    countryCode: z.string(),
  }),
});
