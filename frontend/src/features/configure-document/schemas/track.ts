import { z } from "zod";

import { levelSchema } from "./level";

//
//

const MAX_NAME_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 4_000;
const MAX_LEVELS = 8;
const VALID_ID = /^[a-zA-Z0-9_-]{1,64}$/u;
const VALID_CODE = /^[A-Z]{2,3}$/u;

const unicodeLength = (value: string): number => Array.from(value).length;

export const trackSchema = z.object({
  id: z.string().regex(VALID_ID, "Use 1–64 Latin letters, numbers, - or _"),
  code: z.string().regex(VALID_CODE, "Use 2–3 uppercase Latin letters"),
  name: z
    .string()
    .refine((value) => value.trim() !== "", "Enter a track name")
    .refine(
      (value) => unicodeLength(value) <= MAX_NAME_LENGTH,
      `Track name must contain no more than ${MAX_NAME_LENGTH} characters`,
    ),
  description: z
    .string()
    .refine(
      (value) => unicodeLength(value) <= MAX_DESCRIPTION_LENGTH,
      `Track description must contain no more than ${MAX_DESCRIPTION_LENGTH} characters`,
    ),
  resources: z.string(),
  levels: z
    .array(levelSchema)
    .min(1, "Add at least one level")
    .max(MAX_LEVELS, `Use no more than ${MAX_LEVELS} levels`),
});

export type TrackFF = z.infer<typeof trackSchema>;
