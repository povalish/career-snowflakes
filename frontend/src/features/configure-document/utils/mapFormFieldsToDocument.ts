import type { Document } from "@/entities/document";

import type { DocumentFF } from "../schemas/document";

//
//

function getReachedLevelCount(
  levels: DocumentFF["groups"][number]["tracks"][number]["levels"],
): number {
  const firstUnreachedLevel = levels.findIndex((level) => !level.reached);
  return firstUnreachedLevel === -1 ? levels.length : firstUnreachedLevel;
}

function mapExamples(examplesText: string): string[] {
  return examplesText
    .split(/\r\n?|\n/u)
    .map((example) => example.trim())
    .filter(Boolean);
}

//
//

export function mapFormFieldsToDocument(formFields: DocumentFF, source: Document): Document {
  const progress: Record<string, number> = {};

  const groups = formFields.groups.map((group) => ({
    id: group.id,
    name: group.name,
    color: group.color,
    tracks: group.tracks.map((track) => {
      const reachedLevelCount = getReachedLevelCount(track.levels);
      if (reachedLevelCount > 0) progress[track.id] = reachedLevelCount;

      return {
        id: track.id,
        code: track.code,
        name: track.name,
        description: track.description,
        resources: track.resources,
        levels: track.levels.map((level) => ({
          name: level.name,
          description: level.description,
          examples: mapExamples(level.examplesText),
        })),
      };
    }),
  }));

  return {
    version: source.version,
    profile: source.profile,
    schema: { name: formFields.name, groups },
    progress,
  };
}
