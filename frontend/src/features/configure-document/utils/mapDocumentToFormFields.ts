import type { Document } from "@/entities/document";

import { documentSchema, type DocumentFF } from "../schemas/document";

//
//

export function mapDocumentToFormFields(document: Document): DocumentFF {
  return documentSchema.parse({
    name: document.schema.name,
    groups: document.schema.groups.map((group) => ({
      id: group.id,
      name: group.name,
      color: group.color,
      tracks: group.tracks.map((track) => ({
        id: track.id,
        code: track.code,
        name: track.name,
        description: track.description,
        resources: track.resources,
        levels: track.levels.map((level, levelIndex) => ({
          name: level.name,
          description: level.description,
          examplesText: level.examples.join("\n"),
          reached: levelIndex < (document.progress[track.id] ?? 0),
        })),
      })),
    })),
  });
}
