/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Interactive SVG paths have no native HTML equivalent. */
import { CHART_COLOR_CLASSES, CHART_INNER_RADIUS } from "../constants/chart.constants";
import type { ChartViewTrack } from "../types/chart-view.types";
import { polarPoint, sectorPath } from "../utils/chart.utils";
import { sector, trackDot } from "./chart-track.classes";

//
//

interface IChartTrack {
  track: ChartViewTrack;
  trackIndex: number;
  angle: number;
  ringWidth: number;
  startsGroup: boolean;
  endsGroup: boolean;
  onSelect: (trackId: string, level: number) => void;
}

export const ChartTrack: React.FC<IChartTrack> = ({
  track,
  trackIndex,
  angle,
  ringWidth,
  startsGroup,
  endsGroup,
  onSelect,
}) => {
  const colorClass = CHART_COLOR_CLASSES[track.color] ?? CHART_COLOR_CLASSES.aqua;
  const startAngle = trackIndex * angle + (startsGroup ? 1 : 0.35);
  const endAngle = (trackIndex + 1) * angle - (endsGroup ? 1 : 0.35);
  const dot = polarPoint(52, (trackIndex + 0.5) * angle);
  const label = polarPoint(263, (trackIndex + 0.5) * angle);

  return (
    <g className={colorClass}>
      <circle cx={dot.x} cy={dot.y} r="5" className={trackDot()} />

      {track.levels.map((level, levelIndex) => {
        const levelNumber = levelIndex + 1;
        const levelLabel = `${track.name}: level ${levelNumber}, ${level.name}${
          level.completed ? ", completed" : ""
        }`;

        return (
          <path
            key={levelNumber}
            d={sectorPath(
              CHART_INNER_RADIUS + levelIndex * ringWidth + 1.4,
              CHART_INNER_RADIUS + levelNumber * ringWidth - 1.4,
              startAngle,
              endAngle,
            )}
            className={sector()}
            data-completed={level.completed}
            role="button"
            tabIndex={0}
            aria-label={levelLabel}
            onClick={() => onSelect(track.id, levelNumber)}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;

              event.preventDefault();
              onSelect(track.id, levelNumber);
            }}
          >
            <title>{levelLabel}</title>
          </path>
        );
      })}

      <text
        x={label.x}
        y={label.y}
        className="text-[10px] fill-muted-foreground"
        dominantBaseline="middle"
        textAnchor="middle"
      >
        {track.code}
      </text>
    </g>
  );
};
