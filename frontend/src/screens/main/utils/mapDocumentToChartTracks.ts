import type { Document } from "@/entities/document";
import type { ChartViewTrack } from "@/widgets/chart-view";

//
//

export function mapDocumentToChartTracks(document: Document): ChartViewTrack[] {
  return document.schema.groups.flatMap((group) =>
    group.tracks.map((track) => ({
      id: track.id,
      groupId: group.id,
      name: track.name,
      color: group.color,
      levels: track.levels.map((level, levelIndex) => ({
        name: level.name,
        completed: (document.progress[track.id] ?? 0) >= levelIndex + 1,
      })),
    })),
  );
}
