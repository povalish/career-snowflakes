import type { Group, Track } from "@/entities/document";

//
//

export const FALLBACK_TRACK: Track = {
  id: "",
  code: "",
  name: "No track selected",
  description: "Select a track on the map or from the list.",
  resources: "",
  levels: [{ name: "No level selected", description: "", examples: [] }],
};

export const FALLBACK_GROUP: Group = {
  id: "",
  name: "Development map",
  color: "aqua",
  tracks: [FALLBACK_TRACK],
};
