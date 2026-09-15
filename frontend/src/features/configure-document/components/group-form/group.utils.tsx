import { GROUP_COLORS } from "@/shared/config/track-colors";
import type { DocumentFF } from "../../schemas/document";

//
//

export const createTrackCode = (groups: DocumentFF["groups"]): string => {
  const usedCodes = new Set(groups.flatMap((group) => group.tracks.map((track) => track.code)));

  for (let first = 0; first < 26; first += 1) {
    for (let second = 0; second < 26; second += 1) {
      const code = String.fromCharCode(65 + first, 65 + second);
      if (!usedCodes.has(code)) return code;
    }
  }

  return "NEW";
};

export const createGroup = (groups: DocumentFF["groups"]): DocumentFF["groups"][number] => ({
  id: crypto.randomUUID(),
  name: "New group",
  color: GROUP_COLORS[groups.length % GROUP_COLORS.length] ?? "aqua",
  tracks: [
    {
      id: crypto.randomUUID(),
      code: createTrackCode(groups),
      name: "New track",
      description: "",
      resources: "",
      levels: Array.from({ length: 5 }, (_, index) => ({
        name: `Level ${index + 1}`,
        description: "",
        examplesText: "",
        reached: false,
      })),
    },
  ],
});
