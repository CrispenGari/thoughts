import { z } from "zod";

export const onAuthStateChangedSchema = z.object({ userId: z.number() });
