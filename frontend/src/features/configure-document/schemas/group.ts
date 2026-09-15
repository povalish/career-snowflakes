import { z } from "zod";

import { trackSchema } from "./track";

//
//

const MAX_NAME_LENGTH = 120;
const MAX_TRACKS = 32;
const VALID_ID = /^[a-zA-Z0-9_-]{1,64}$/u;

const unicodeLength = (value: string): number => Array.from(value).length;

export const groupSchema = z.object({
  id: z.string().regex(VALID_ID, "Use 1–64 Latin letters, numbers, - or _"),
  name: z
    .string()
    .refine((value) => value.trim() !== "", "Enter a group name")
    .refine(
      (value) => unicodeLength(value) <= MAX_NAME_LENGTH,
      `Group name must contain no more than ${MAX_NAME_LENGTH} characters`,
    ),
  color: z.enum(["red", "green", "yellow", "blue", "purple", "aqua", "orange"], {
    error: "Choose a supported group color",
  }),
  tracks: z
    .array(trackSchema)
    .min(1, "Add at least one track")
    .max(MAX_TRACKS, `Use no more than ${MAX_TRACKS} tracks in a group`),
});

export type GroupFF = z.infer<typeof groupSchema>;
