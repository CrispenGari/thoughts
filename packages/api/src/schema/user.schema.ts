import { z } from "zod";

export const contactsSchema = z.object({
  input: z
    .object({
      contactName: z.string(),
      phoneNumbers: z.string().array(),
    })
    .array(),
});
export const contactSchema = z.object({
  id: z.number(),
});

export const getSchema = z.object({ id: z.number() });
export const statusUpdateSchema = z.object({ status: z.boolean() });
export const onStatusSchema = z.object({ userId: z.number() });
export const onUserUpdateSchema = z.object({ userId: z.number() });
export const updatePhoneNumberSchema = z.object({
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
