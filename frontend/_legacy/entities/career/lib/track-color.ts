const TRACK_COLOR_CLASSES: Readonly<Record<string, string>> = {
  aqua: "[--track-color:var(--track-aqua)]",
  blue: "[--track-color:var(--track-blue)]",
  green: "[--track-color:var(--track-green)]",
  orange: "[--track-color:var(--track-orange)]",
  purple: "[--track-color:var(--track-purple)]",
  red: "[--track-color:var(--track-red)]",
  yellow: "[--track-color:var(--track-yellow)]",
};

export function getTrackColorClass(color: string): string {
  return TRACK_COLOR_CLASSES[color] ?? "[--track-color:var(--track-aqua)]";
}
