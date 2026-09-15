import { z } from "zod";

//
//

const MAX_NAME_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 4_000;
const MAX_EXAMPLES = 20;
const MAX_EXAMPLE_LENGTH = 1_000;

const unicodeLength = (value: string): number => Array.from(value).length;

const examplesTextSchema = z.string().superRefine((value, context) => {
  const examples = value
    .split(/\r\n?|\n/u)
    .map((example) => example.trim())
    .filter(Boolean);

  if (examples.length > MAX_EXAMPLES) {
    context.addIssue({
      code: "custom",
      message: `Use no more than ${MAX_EXAMPLES} examples`,
    });
  }

  if (examples.some((example) => unicodeLength(example) > MAX_EXAMPLE_LENGTH)) {
    context.addIssue({
      code: "custom",
      message: `Each example must contain no more than ${MAX_EXAMPLE_LENGTH} characters`,
    });
  }
});

export const levelSchema = z.object({
  name: z
    .string()
    .refine((value) => value.trim() !== "", "Enter a level name")
    .refine(
      (value) => unicodeLength(value) <= MAX_NAME_LENGTH,
      `Level name must contain no more than ${MAX_NAME_LENGTH} characters`,
    ),
  description: z
    .string()
    .refine(
      (value) => unicodeLength(value) <= MAX_DESCRIPTION_LENGTH,
      `Level description must contain no more than ${MAX_DESCRIPTION_LENGTH} characters`,
    ),
  examplesText: examplesTextSchema,
  reached: z.boolean(),
});

export type LevelFF = z.infer<typeof levelSchema>;
