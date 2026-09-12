import { useId, type KeyboardEvent } from "react";

import {
  getTrackColorClass,
  getTracks,
  type CareerDocument,
  type Selection,
} from "@/entities/career";

import { polarPoint, sectorPath } from "../lib/geometry";
import { getSnowflakeNavigationTarget } from "../lib/snowflake-navigation";

interface SnowflakeProps {
  document: CareerDocument;
  selection: Selection;
  onSelect: (selection: Selection) => void;
  onActivate: (selection: Selection) => void;
}

export function Snowflake({ document, selection, onSelect, onActivate }: SnowflakeProps) {
  const labelId = useId();
  const tracks = getTracks(document);
  const maxLevels = Math.max(...tracks.map(({ track }) => track.levels.length));
  const angle = 360 / tracks.length;
  const ringWidth = 172 / maxLevels;

  function navigate(event: KeyboardEvent<SVGPathElement>, trackIndex: number, level: number) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const entry = tracks[trackIndex];
      if (entry) onActivate({ trackId: entry.track.id, level });
      return;
    }

    const target = getSnowflakeNavigationTarget(tracks, trackIndex, level, event.key);
    if (!target) return;

    event.preventDefault();
    onSelect(target.selection);
    event.currentTarget.ownerSVGElement
      ?.querySelector<SVGPathElement>(
        `[data-snowflake-segment="${target.trackIndex}-${target.selection.level}"]`,
      )
      ?.focus();
  }

  return (
    <svg className="block w-full overflow-visible" viewBox="0 0 600 600" aria-labelledby={labelId}>
      <title id={labelId}>Карта развития. Стрелки выбирают трек и уровень.</title>
      <circle
        cx="300"
        cy="300"
        r="243"
        className="[fill:none] [stroke-dasharray:2_5] [stroke-width:0.8] [stroke:var(--border)]"
      />
      {tracks.map(({ track, group, index }) => {
        const first = group.tracks[0]?.id === track.id;
        const last = group.tracks.at(-1)?.id === track.id;
        const start = index * angle + (first ? 1 : 0.35);
        const end = (index + 1) * angle - (last ? 1 : 0.35);
        const dot = polarPoint(52, (index + 0.5) * angle);
        const label = polarPoint(263, (index + 0.5) * angle);
        return (
          <g key={track.id} className={getTrackColorClass(group.color)}>
            <circle cx={dot.x} cy={dot.y} r="5" className="[fill:var(--track-color)]" />
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
                  className="cursor-pointer outline-none [fill:var(--muted)] [stroke-width:2] [stroke:transparent] [transition:fill_150ms,stroke_150ms] data-[completed=true]:[fill:var(--track-color)] data-[selected=true]:[fill:color-mix(in_srgb,var(--track-color)_32%,var(--muted))] data-[selected=true]:[stroke:var(--foreground)] [&:hover:not([data-selected=true])]:[fill:color-mix(in_srgb,var(--track-color)_50%,var(--muted))] [&[data-completed=true][data-selected=true]]:[fill:var(--track-color)] [&[data-selected=true]:not(:focus-visible)]:[stroke-width:2.5] focus-visible:[stroke-width:4] focus-visible:[stroke:var(--foreground)] motion-reduce:[transition:none]"
                  data-completed={completed}
                  data-selected={selected}
                  data-snowflake-segment={`${index}-${level}`}
                  // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
                  role="button"
                  tabIndex={selected ? 0 : -1}
                  aria-label={`${track.name}, уровень ${level}: ${stage.name}${completed ? ", достигнут" : ""}`}
                  aria-pressed={selected}
                  aria-haspopup={selected ? "dialog" : undefined}
                  onClick={() => onActivate({ trackId: track.id, level })}
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
              className="text-[10px] [fill:var(--muted-foreground)] [font-variant-numeric:tabular-nums] data-[selected=true]:font-bold data-[selected=true]:[fill:var(--foreground)]"
              dominantBaseline="middle"
              textAnchor="middle"
              data-selected={selection.trackId === track.id}
            >
              {String(index + 1).padStart(2, "0")}
            </text>
          </g>
        );
      })}
      <text
        x="300"
        y="297"
        textAnchor="middle"
        className="text-[10px] tracking-[3px] [fill:var(--foreground)]"
      >
        ТВОЙ
      </text>
      <text
        x="300"
        y="316"
        textAnchor="middle"
        className="text-[9px] [fill:var(--muted-foreground)]"
      >
        путь роста
      </text>
    </svg>
  );
}
