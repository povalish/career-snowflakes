import { ArrowUpRight, Check, RotateCcw } from "lucide-react";
import { Button } from "../../components/ui/button";
import { trackStyle } from "./track-style";
import type { CareerGroup, CareerTrack } from "./types";

interface LevelDetailsProps {
  group: CareerGroup;
  track: CareerTrack;
  level: number;
  progress: number;
  busy: boolean;
  error: string;
  onSelectLevel: (level: number) => void;
  onSetProgress: (level: number) => void;
}

export function LevelDetails({
  group,
  track,
  level,
  progress,
  busy,
  error,
  onSelectLevel,
  onSetProgress,
}: LevelDetailsProps) {
  const stage = track.levels[level - 1];
  if (!stage) return null;
  return (
    <section
      className="level-details"
      style={trackStyle(group.color)}
      aria-labelledby="detail-title"
    >
      <div className="detail-heading">
        <div>
          <p className="eyebrow">
            <span className="color-dot" />
            {group.name}
          </p>
          <h2 id="detail-title">{track.name}</h2>
        </div>
        <span className="detail-progress">
          {progress}
          <span> / {track.levels.length}</span>
        </span>
      </div>
      <p className="track-description">{track.description}</p>
      {error && (
        <div role="alert" className="error-message detail-error">
          <strong>Не удалось выполнить действие.</strong> {error}
        </div>
      )}
      <div className="level-selector" aria-label="Уровни трека">
        {track.levels.map((item, index) => (
          <button
            key={index}
            type="button"
            className="level-option"
            aria-label={`Уровень ${index + 1}: ${item.name}`}
            aria-pressed={level === index + 1}
            data-completed={progress > index}
            onClick={() => onSelectLevel(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="stage-heading">
        <p className="eyebrow">УРОВЕНЬ {level}</p>
        <span className="stage-status">
          {progress >= level ? (
            <>
              <Check size={13} />
              Достигнут
            </>
          ) : (
            "Впереди"
          )}
        </span>
      </div>
      <h3>{stage.name}</h3>
      <p className="stage-description">
        {stage.description || "Добавьте описание этого этапа в настройках схемы."}
      </p>
      {stage.examples.length > 0 && (
        <div className="examples">
          <h4>Как это выглядит на практике</h4>
          <ul>
            {stage.examples.map((example, index) => (
              <li key={index}>{example}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="detail-actions">
        <Button
          className="w-full"
          disabled={busy || progress === level}
          onClick={() => onSetProgress(level)}
        >
          {progress === level ? (
            <>
              <Check />
              Текущий уровень
            </>
          ) : (
            <>
              Установить уровень {level}
              <ArrowUpRight />
            </>
          )}
        </Button>
        <p>Предыдущие этапы также считаются достигнутыми.</p>
        {progress > 0 && (
          <Button variant="ghost" size="sm" disabled={busy} onClick={() => onSetProgress(0)}>
            <RotateCcw />
            Сбросить прогресс трека
          </Button>
        )}
      </div>
    </section>
  );
}
