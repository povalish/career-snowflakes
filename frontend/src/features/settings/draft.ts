import type { CareerDocument, CareerGroup, CareerLevel, CareerTrack } from "../career/types";

export const GROUP_COLORS = ["aqua", "blue", "purple", "red", "green", "yellow", "orange"] as const;
export const MAX_GROUPS = 8;
export const MAX_TRACKS = 32;
export const MAX_LEVELS = 8;

export function createLevel(number: number): CareerLevel {
  return { name: `Уровень ${number}`, description: "", examples: [] };
}

export function createTrack(): CareerTrack {
  return {
    id: crypto.randomUUID(),
    name: "Новый трек",
    description: "",
    levels: Array.from({ length: 5 }, (_, index) => createLevel(index + 1)),
  };
}

export function createGroup(index: number): CareerGroup {
  return {
    id: crypto.randomUUID(),
    name: "Новое направление",
    color: GROUP_COLORS[index % GROUP_COLORS.length] ?? "aqua",
    tracks: [createTrack()],
  };
}

export function withSchema(
  document: CareerDocument,
  schema: CareerDocument["schema"],
): CareerDocument {
  const progress: CareerDocument["progress"] = {};
  for (const group of schema.groups) {
    for (const track of group.tracks) {
      progress[track.id] = Math.min(document.progress[track.id] ?? 0, track.levels.length);
    }
  }
  return { ...document, schema, progress };
}

export function removeLevel(
  document: CareerDocument,
  trackId: string,
  levelIndex: number,
): CareerDocument {
  const schema = {
    ...document.schema,
    groups: document.schema.groups.map((group) => ({
      ...group,
      tracks: group.tracks.map((track) =>
        track.id === trackId
          ? { ...track, levels: track.levels.filter((_, index) => index !== levelIndex) }
          : track,
      ),
    })),
  };
  const currentProgress = document.progress[trackId] ?? 0;
  const progress = {
    ...document.progress,
    [trackId]: currentProgress - (levelIndex < currentProgress ? 1 : 0),
  };
  return withSchema({ ...document, progress }, schema);
}
