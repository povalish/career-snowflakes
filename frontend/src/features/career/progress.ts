import type { CareerDocument, CareerGroup, CareerTrack, Selection } from "./types";

export interface TrackEntry {
  group: CareerGroup;
  track: CareerTrack;
  index: number;
}

export function getTracks(document: CareerDocument): TrackEntry[] {
  return document.schema.groups
    .flatMap((group) => group.tracks.map((track) => ({ group, track })))
    .map((entry, index) => ({ ...entry, index }));
}

export function getProgress(document: CareerDocument) {
  const tracks = getTracks(document);
  const completed = tracks.reduce(
    (total, { track }) => total + (document.progress[track.id] ?? 0),
    0,
  );
  const total = tracks.reduce((count, { track }) => count + track.levels.length, 0);
  const started = tracks.filter(({ track }) => (document.progress[track.id] ?? 0) > 0).length;
  return {
    completed,
    total,
    started,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function getSelection(document: CareerDocument, selection: Selection | null) {
  const tracks = getTracks(document);
  const entry = tracks.find(({ track }) => track.id === selection?.trackId) ?? tracks[0];
  if (!entry) return null;
  const level =
    selection?.trackId === entry.track.id
      ? Math.min(Math.max(selection.level, 1), entry.track.levels.length)
      : Math.min((document.progress[entry.track.id] ?? 0) + 1, entry.track.levels.length);
  return { ...entry, level };
}
