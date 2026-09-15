import type { DocumentFF } from "../../schemas/document";
import { createLevel } from "../level-form/level.utils";

//
//

const createTrackCode = (groups: DocumentFF["groups"]): string => {
  const usedCodes = new Set(groups.flatMap((group) => group.tracks.map((track) => track.code)));

  for (let first = 0; first < 26; first += 1) {
    for (let second = 0; second < 26; second += 1) {
      const code = String.fromCharCode(65 + first, 65 + second);
      if (!usedCodes.has(code)) return code;
    }
  }

  return "NEW";
};

export const createTrack = (
  groups: DocumentFF["groups"],
): DocumentFF["groups"][number]["tracks"][number] => ({
  id: crypto.randomUUID(),
  code: createTrackCode(groups),
  name: "New track",
  description: "",
  resources: "",
  levels: Array.from({ length: 5 }, (_, index) => createLevel(index + 1)),
});
