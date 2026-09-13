import type { Document, Group, Level, Schema, Track } from "./document.types";

type ServiceLevel = Omit<Level, "examples"> & { examples: string[] | null };
type ServiceTrack = Omit<Track, "levels"> & { levels: ServiceLevel[] | null };
type ServiceGroup = Omit<Group, "tracks"> & { tracks: ServiceTrack[] | null };
type ServiceSchema = Omit<Schema, "groups"> & { groups: ServiceGroup[] | null };
type ServiceDocument = Omit<Document, "schema" | "progress"> & {
  schema: ServiceSchema;
  progress: Partial<Record<string, number>> | null;
};

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

export function getErrorMessage(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}
