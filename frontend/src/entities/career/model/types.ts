import type {
  Document,
  Group,
  Track,
  Level,
} from "../../../../bindings/career-snowflakes/internal/career/models";

// Go validates and normalizes every returned document, so these collections
// cannot be null. Derive the UI types from generated bindings to keep one model.
export type CareerLevel = Omit<Level, "examples"> & { examples: string[] };
export type CareerTrack = Omit<Track, "levels"> & { levels: CareerLevel[] };
export type CareerGroup = Omit<Group, "tracks"> & { tracks: CareerTrack[] };
export type CareerDocument = Omit<Document, "schema" | "progress"> & {
  schema: Omit<Document["schema"], "groups"> & { groups: CareerGroup[] };
  progress: Record<string, number>;
};

export interface Selection {
  trackId: string;
  level: number;
}
