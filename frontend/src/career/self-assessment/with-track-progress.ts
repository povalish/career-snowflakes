import type { Document } from "@/career/document";

export function withTrackProgress(document: Document, trackId: string, level: number): Document {
  const track = document.schema.groups
    .flatMap((group) => group.tracks)
    .find((item) => item.id === trackId);
  if (!track) throw new Error(`Track not found: ${trackId}`);
  if (!Number.isInteger(level) || level < 0 || level > track.levels.length) {
    throw new RangeError(`Invalid level ${level} for track ${trackId}`);
  }
  return { ...document, progress: { ...document.progress, [trackId]: level } };
}
