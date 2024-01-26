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
export const updateProfileSchema = z.object({
  image: z.string().nullable(),
  name: z.string(),
  bio: z.string(),
  gender: z.enum(["MALE", "FEMALE", "TRANS-GENDER"]),
});

export const getSchema = z.object({ id: z.number() });
export const deleteAccountSchema = z.object({
  reason: z.string(),
  pin: z.string(),
});
export const changePinSchema = z.object({
  pin2: z.string(),
  pin1: z.string(),
});

export const verifyPinSchema = z.object({
  pin: z.string(),
});
export const verifyPasskeySchema = z.object({
  passkey: z.string(),
});
export const changePasskeySchema = z.object({
  passkey: z.string(),
  passkeyQuestion: z.string(),
});
export const statusUpdateSchema = z.object({ status: z.boolean() });
export const onStatusSchema = z.object({ userId: z.number() });
export const onUserDeleteAccountSchema = z.object({ userId: z.number() });
export const onAuthStateChangedSchema = z.object({ userId: z.number() });
export const onUserProfileUpdateSchema = z.object({ userId: z.number() });
export const onProfileUpdateSchema = z.object({ userId: z.number() });
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
