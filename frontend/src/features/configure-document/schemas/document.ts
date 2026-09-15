import { z } from "zod";

import { groupSchema } from "./group";

//
//

const MAX_NAME_LENGTH = 120;
const MAX_GROUPS = 8;
const MAX_TRACKS = 32;

const unicodeLength = (value: string): number => Array.from(value).length;

export const documentSchema = z
  .object({
    name: z
      .string()
      .refine((value) => value.trim() !== "", "Enter a schema name")
      .refine(
        (value) => unicodeLength(value) <= MAX_NAME_LENGTH,
        `Schema name must contain no more than ${MAX_NAME_LENGTH} characters`,
      ),
    groups: z
      .array(groupSchema)
      .min(1, "Add at least one group")
      .max(MAX_GROUPS, `Use no more than ${MAX_GROUPS} groups`),
  })
  .superRefine(({ groups }, context) => {
    const ids = new Set<string>();
    const codes = new Set<string>();
    let trackCount = 0;

    groups.forEach((group, groupIndex) => {
      if (ids.has(group.id)) {
        context.addIssue({
          code: "custom",
          message: "Group and track IDs must be unique",
          path: ["groups", groupIndex, "id"],
        });
      }
      ids.add(group.id);

      group.tracks.forEach((track, trackIndex) => {
        trackCount += 1;

        if (ids.has(track.id)) {
          context.addIssue({
            code: "custom",
            message: "Group and track IDs must be unique",
            path: ["groups", groupIndex, "tracks", trackIndex, "id"],
          });
        }
        ids.add(track.id);

        if (codes.has(track.code)) {
          context.addIssue({
            code: "custom",
            message: "Track codes must be unique",
            path: ["groups", groupIndex, "tracks", trackIndex, "code"],
          });
        }
        codes.add(track.code);
      });
    });

    if (trackCount > MAX_TRACKS) {
      context.addIssue({
        code: "custom",
        message: `Use no more than ${MAX_TRACKS} tracks in total`,
        path: ["groups"],
      });
    }
  });

export type DocumentFF = z.infer<typeof documentSchema>;
