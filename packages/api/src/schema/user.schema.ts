import { z } from "zod";

export const createSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
  password: z.string(),
});
export const contactsSchema = z.object({
  input: z
    .object({
      contactName: z.string(),
      phoneNumbers: z.string().array(),
    })
    .array(),
});
export const contactSchema = z.object({
  input: z.object({
    contactName: z.string(),
    phoneNumbers: z.string().array(),
  }),
});
