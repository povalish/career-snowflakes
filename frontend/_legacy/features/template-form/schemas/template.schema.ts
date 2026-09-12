import { z } from "zod";

import type {
  TemplateFF,
  TemplateGroupColor,
  TemplateGroupFF,
  TemplateLevelFF,
  TemplateTrackFF,
} from "../types/template.types";

export const templateGroupColorSchema = z.enum([
  "aqua",
  "blue",
  "purple",
  "red",
  "green",
  "yellow",
  "orange",
]) satisfies z.ZodType<TemplateGroupColor>;

export const templateLevelSchema = z.object({
  name: z.string(),
  description: z.string(),
  examplesText: z.string(),
}) satisfies z.ZodType<TemplateLevelFF>;

export const templateTrackSchema = z.object({
  trackId: z.string(),
  name: z.string(),
  description: z.string(),
  levels: z.array(templateLevelSchema),
}) satisfies z.ZodType<TemplateTrackFF>;

export const templateGroupSchema = z.object({
  groupId: z.string(),
  name: z.string(),
  color: templateGroupColorSchema,
  tracks: z.array(templateTrackSchema),
}) satisfies z.ZodType<TemplateGroupFF>;

export const templateSchema = z.object({
  name: z.string(),
  groups: z.array(templateGroupSchema),
}) satisfies z.ZodType<TemplateFF>;
