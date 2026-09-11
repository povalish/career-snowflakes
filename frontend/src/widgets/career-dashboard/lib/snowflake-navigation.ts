import type { Selection } from "@/entities/career";

interface NavigableTrack {
  track: {
    id: string;
    levels: readonly unknown[];
  };
}

export interface SnowflakeNavigationTarget {
  selection: Selection;
  trackIndex: number;
}

export function getSnowflakeNavigationTarget(
  tracks: readonly NavigableTrack[],
  trackIndex: number,
  level: number,
  key: string,
): SnowflakeNavigationTarget | null {
  if (tracks.length === 0) return null;

  let nextTrackIndex = trackIndex;
  let nextLevel = level;
  switch (key) {
    case "ArrowRight":
      nextTrackIndex = (trackIndex + 1) % tracks.length;
      break;
    case "ArrowLeft":
      nextTrackIndex = (trackIndex - 1 + tracks.length) % tracks.length;
      break;
    case "ArrowUp":
      nextLevel += 1;
      break;
    case "ArrowDown":
      nextLevel -= 1;
      break;
    case "Home":
      nextLevel = 1;
      break;
    case "End":
      nextLevel = Number.POSITIVE_INFINITY;
      break;
    default:
      return null;
  }

  const entry = tracks[nextTrackIndex];
  if (!entry) return null;

  return {
    selection: {
      trackId: entry.track.id,
      level: Math.min(Math.max(nextLevel, 1), entry.track.levels.length),
    },
    trackIndex: nextTrackIndex,
  };
}
