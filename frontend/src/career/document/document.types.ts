import type * as Wails from "@bindings/career-snowflakes/internal/career/models";

export type Profile = Wails.Profile;
export type Level = Omit<Wails.Level, "examples"> & { examples: string[] };
export type Track = Omit<Wails.Track, "levels"> & { levels: Level[] };
export type Group = Omit<Wails.Group, "tracks"> & { tracks: Track[] };
export type Schema = Omit<Wails.Schema, "groups"> & { groups: Group[] };
export type Document = Omit<Wails.Document, "schema" | "progress"> & {
  schema: Schema;
  progress: Record<string, number>;
};
