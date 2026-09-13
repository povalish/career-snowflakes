import { CHART_CENTER, CHART_INNER_RADIUS, CHART_OUTER_RADIUS } from "../constants/chart.constants";
import type { ChartViewTrack } from "../types/chart-view.types";
import { ChartTrack } from "./chart-track";

//
//

export interface IChartView {
  tracks: readonly ChartViewTrack[];
  onTrackSelect: (trackId: string) => void;
}

export const ChartView: React.FC<IChartView> = ({ tracks, onTrackSelect }) => {
  if (tracks.length === 0) return null;

  const angle = 360 / tracks.length;
  const maxLevels = Math.max(1, ...tracks.map((track) => track.levels.length));
  const ringWidth = (CHART_OUTER_RADIUS - CHART_INNER_RADIUS) / maxLevels;

  return (
    <svg
      className="block w-full overflow-visible"
      viewBox="0 0 600 600"
      aria-labelledby="career-chart-title career-chart-description"
    >
      <title id="career-chart-title">Карта профессионального развития</title>
      <desc id="career-chart-description">
        Заполненные цветом секторы показывают достигнутые уровни по карьерным направлениям.
      </desc>

      <circle
        cx={CHART_CENTER}
        cy={CHART_CENTER}
        r="243"
        className="fill-none [stroke-dasharray:2_5] stroke-[0.8] stroke-border"
      />

      {tracks.map((track, trackIndex) => (
        <ChartTrack
          key={track.id}
          track={track}
          trackIndex={trackIndex}
          angle={angle}
          ringWidth={ringWidth}
          startsGroup={tracks[trackIndex - 1]?.groupId !== track.groupId}
          endsGroup={tracks[trackIndex + 1]?.groupId !== track.groupId}
          onSelect={onTrackSelect}
        />
      ))}
    </svg>
  );
};
