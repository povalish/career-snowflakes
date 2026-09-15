export const GROUP_COLORS = ["aqua", "blue", "purple", "red", "green", "yellow", "orange"] as const;

export const GROUP_COLOR_CLASSES: Readonly<Record<string, string>> = {
  aqua: "[--track-color:var(--track-aqua)]",
  blue: "[--track-color:var(--track-blue)]",
  green: "[--track-color:var(--track-green)]",
  orange: "[--track-color:var(--track-orange)]",
  purple: "[--track-color:var(--track-purple)]",
  red: "[--track-color:var(--track-red)]",
  yellow: "[--track-color:var(--track-yellow)]",
} as const satisfies Record<(typeof GROUP_COLORS)[number], string>;
