import type { Document } from "@/entities/document";
import type { ListViewGroup } from "@/widgets/list-view";

//
//

export function mapDocumentToListViewGroups(document: Document): ListViewGroup[] {
  let trackIndex = 0;

  return document.schema.groups.map((group) => ({
    id: group.id,
    name: group.name,
    color: group.color,
    tracks: group.tracks.map((track) => ({
      id: track.id,
      index: trackIndex++,
      name: track.name,
      progress: document.progress[track.id] ?? 0,
      levelCount: track.levels.length,
    })),
  }));
}
