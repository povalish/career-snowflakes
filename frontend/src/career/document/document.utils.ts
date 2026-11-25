import type { Document as ServiceDocument } from "@bindings/career-snowflakes/internal/career/models";

import type { Document } from "./document.types";

function fromServiceProgress(progress: ServiceDocument["progress"]): Record<string, number> {
  const normalized: Record<string, number> = {};

  for (const [trackId, level] of Object.entries(progress ?? {})) {
    if (level !== undefined) normalized[trackId] = level;
  }

  return normalized;
}

export function fromServiceDocument(document: ServiceDocument): Document {
  return {
    version: document.version,
    profile: { ...document.profile },
    schema: {
      name: document.schema.name,
      groups: (document.schema.groups ?? []).map((group) => ({
        ...group,
        tracks: (group.tracks ?? []).map((track) => ({
          ...track,
          levels: (track.levels ?? []).map((level) => ({
            ...level,
            examples: level.examples ?? [],
          })),
        })),
      })),
    },
    progress: fromServiceProgress(document.progress),
  };
}
