import type { CSSProperties } from "react";

export function trackStyle(color: string): CSSProperties & { "--track-color": string } {
  return { "--track-color": `var(--track-${color})` };
}
