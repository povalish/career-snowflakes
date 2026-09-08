import { useId, type KeyboardEvent } from "react";
import { polarPoint, sectorPath } from "./geometry";
import { getTracks } from "./progress";
import { trackStyle } from "./track-style";
import type { CareerDocument, Selection } from "./types";

interface SnowflakeProps {
  document: CareerDocument;
  selection: Selection;
  onSelect: (selection: Selection) => void;
}

export function Snowflake({ document, selection, onSelect }: SnowflakeProps) {
  const labelId = useId();
  const tracks = getTracks(document);
  const maxLevels = Math.max(...tracks.map(({ track }) => track.levels.length));
  const angle = 360 / tracks.length;
  const ringWidth = 172 / maxLevels;

  function navigate(event: KeyboardEvent<SVGPathElement>, trackIndex: number, level: number) {
    let nextTrack = trackIndex;
    let nextLevel = level;
    switch (event.key) {
      case "ArrowRight":
        nextTrack = (trackIndex + 1) % tracks.length;
        break;
      case "ArrowLeft":
        nextTrack = (trackIndex - 1 + tracks.length) % tracks.length;
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
        nextLevel = maxLevels;
        break;
      case "Enter":
      case " ":
        break;
      default:
        return;
    }
    event.preventDefault();
    const entry = tracks[nextTrack];
    if (!entry) return;
    nextLevel = Math.min(Math.max(nextLevel, 1), entry.track.levels.length);
    onSelect({ trackId: entry.track.id, level: nextLevel });
    event.currentTarget.ownerSVGElement
      ?.querySelector<SVGPathElement>(`[data-segment="${nextTrack}-${nextLevel}"]`)
      ?.focus();
  }

  return (
    <svg className="snowflake" viewBox="0 0 600 600" aria-labelledby={labelId}>
      <title id={labelId}>Карта развития. Стрелки выбирают трек и уровень.</title>
      <circle cx="300" cy="300" r="243" className="chart-guide" />
      {tracks.map(({ track, group, index }) => {
        const first = group.tracks[0]?.id === track.id;
        const last = group.tracks.at(-1)?.id === track.id;
        const start = index * angle + (first ? 1 : 0.35);
        const end = (index + 1) * angle - (last ? 1 : 0.35);
        const dot = polarPoint(52, (index + 0.5) * angle);
        const label = polarPoint(263, (index + 0.5) * angle);
        return (
          <g key={track.id} style={trackStyle(group.color)}>
            <circle cx={dot.x} cy={dot.y} r="5" className="track-dot" />
            {track.levels.map((stage, levelIndex) => {
              const level = levelIndex + 1;
              const selected = selection.trackId === track.id && selection.level === level;
              const completed = (document.progress[track.id] ?? 0) >= level;
              return (
                // SVG paths require a role: an HTML button cannot describe a sector.
                <path
                  key={level}
                  d={sectorPath(
                    64 + levelIndex * ringWidth + 1.4,
                    64 + level * ringWidth - 1.4,
                    start,
                    end,
                  )}
                  className="snowflake-segment"
                  data-completed={completed}
                  data-selected={selected}
                  data-segment={`${index}-${level}`}
                  // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
                  role="button"
                  tabIndex={selected ? 0 : -1}
                  aria-label={`${track.name}, уровень ${level}: ${stage.name}${completed ? ", достигнут" : ""}`}
                  aria-pressed={selected}
                  onClick={() => onSelect({ trackId: track.id, level })}
                  onKeyDown={(event) => navigate(event, index, level)}
                >
                  <title>
                    {track.name} · {level}. {stage.name}
                  </title>
                </path>
              );
            })}
            <text
              x={label.x}
              y={label.y}
              className="chart-number"
              dominantBaseline="middle"
              textAnchor="middle"
              data-selected={selection.trackId === track.id}
            >
              {String(index + 1).padStart(2, "0")}
            </text>
          </g>
        );
      })}
      <text x="300" y="297" textAnchor="middle" className="chart-center-title">
        ТВОЙ
      </text>
      <text x="300" y="316" textAnchor="middle" className="chart-center-caption">
        путь роста
      </text>
    </svg>
  );
}
