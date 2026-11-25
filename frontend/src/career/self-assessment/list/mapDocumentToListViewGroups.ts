import type { Document } from "@/career/document";

import type { ListViewGroup } from "./list-view.types";

//
//

export function mapDocumentToListViewGroups(document: Document): ListViewGroup[] {
  return document.schema.groups.map((group) => ({
    id: group.id,
    name: group.name,
    color: group.color,
    tracks: group.tracks.map((track) => ({
      id: track.id,
      code: track.code,
      name: track.name,
      progress: document.progress[track.id] ?? 0,
      levelCount: track.levels.length,
    })),
  }));
}
