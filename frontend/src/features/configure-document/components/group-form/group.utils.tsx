import { GROUP_COLORS } from "@/shared/config/track-colors";

import type { DocumentFF } from "../../schemas/document";
import { createTrack } from "../track-form/track.utils";

//
//

export const createGroup = (groups: DocumentFF["groups"]): DocumentFF["groups"][number] => ({
  id: crypto.randomUUID(),
  name: "New group",
  color: GROUP_COLORS[groups.length % GROUP_COLORS.length] ?? "aqua",
  tracks: [createTrack(groups)],
});
