import { ArrowUpRight, Check, RotateCcw } from "lucide-react";

import { getTrackColorClass, type CareerGroup, type CareerTrack } from "@/entities/career";
import { Button } from "@/shared/ui/button";

interface LevelDetailsProps {
  group: CareerGroup;
  track: CareerTrack;
  level: number;
  progress: number;
  busy: boolean;
  error: string;
  variant?: "card" | "dialog";
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
  variant = "card",
  onSelectLevel,
  onSetProgress,
}: LevelDetailsProps) {
  const stage = track.levels[level - 1];
  if (!stage) return null;

  return (
    <section
      className={`${
        variant === "dialog"
          ? "max-h-[inherit] overflow-x-hidden overflow-y-auto rounded-[inherit] border-0 bg-card p-[25px] [@media(max-width:560px)]:p-5"
          : "overflow-hidden rounded-[12px] border border-border bg-card p-[25px]"
      } ${getTrackColorClass(group.color)}`}
      aria-labelledby="detail-title"
    >
      <div
        className={`flex items-center justify-between gap-3 ${variant === "dialog" ? "pr-8" : ""}`}
      >
        <div>
          <p className="mt-0 mr-0 mb-[9px] ml-0 flex items-center gap-[7px] text-[9px] font-semibold tracking-[0.5px] text-[var(--track-color)]">
            <span className="inline-block size-[6px] shrink-0 rounded-full bg-[var(--track-color)]" />
            {group.name}
          </p>
          <h2
            id="detail-title"
            className="m-0 text-[22px] leading-[1.3] font-medium tracking-[-0.5px] [overflow-wrap:anywhere]"
          >
            {track.name}
          </h2>
        </div>
        <span className="shrink-0 text-[24px] text-[var(--track-color)]">
          {progress}
          <span className="text-[12px] text-muted-foreground"> / {track.levels.length}</span>
        </span>
      </div>
      <p className="mt-[14px] mr-0 mb-5 ml-0 text-[11px] leading-[1.8] whitespace-pre-wrap text-muted-foreground [overflow-wrap:anywhere] [@media(max-width:800px)]:text-[13px]">
        {track.description}
      </p>
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-[8px] bg-[color-mix(in_srgb,var(--destructive)_8%,transparent)] px-4 py-3 text-[13px] text-destructive [overflow-wrap:anywhere]"
        >
          <strong>Не удалось выполнить действие.</strong> {error}
        </div>
      )}
      <div
        className="mb-[22px] flex gap-[6px] border-b border-border pb-[23px]"
        aria-label="Уровни трека"
      >
        {track.levels.map((item, index) => (
          <button
            key={index}
            type="button"
            className="h-9 flex-1 cursor-pointer rounded-[6px] border border-border bg-transparent text-[12px] text-muted-foreground focus-visible:outline-ring/50 data-[completed=true]:bg-[color-mix(in_srgb,var(--track-color)_14%,transparent)] data-[completed=true]:text-[var(--track-color)] aria-pressed:border-[var(--track-color)] aria-pressed:text-[var(--track-color)] aria-pressed:shadow-[0_0_0_1px_var(--track-color)]"
            aria-label={`Уровень ${index + 1}: ${item.name}`}
            aria-pressed={level === index + 1}
            data-completed={progress > index}
            onClick={() => onSelectLevel(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="mb-[11px] flex items-center justify-between">
        <p className="m-0 flex items-center gap-[7px] text-[9px] font-semibold tracking-[1.6px] text-muted-foreground">
          УРОВЕНЬ {level}
        </p>
        <span className="flex items-center gap-1 rounded-[4px] bg-[color-mix(in_srgb,var(--track-color)_9%,transparent)] px-[6px] py-[3px] text-[9px] text-[var(--track-color)]">
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
      <h3 className="mt-0 mb-[11px] text-[16px] font-medium [overflow-wrap:anywhere]">
        {stage.name}
      </h3>
      <p className="m-0 text-[11px] leading-[1.9] whitespace-pre-wrap text-muted-foreground [overflow-wrap:anywhere] [@media(max-width:800px)]:text-[13px]">
        {stage.description || "Добавьте описание этого этапа в настройках схемы."}
      </p>
      {stage.examples.length > 0 && (
        <div className="mt-[23px]">
          <h4 className="mt-0 mb-[11px] text-[10px] font-medium">Как это выглядит на практике</h4>
          <ul className="m-0 list-none p-0">
            {stage.examples.map((example, index) => (
              <li
                key={index}
                className="relative mb-[9px] pl-[15px] text-[11px] leading-[1.8] text-muted-foreground [overflow-wrap:anywhere] before:absolute before:top-2 before:left-0 before:size-1 before:rounded-full before:bg-[var(--track-color)] before:content-[''] [@media(max-width:800px)]:text-[13px]"
              >
                {example}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-[26px] border-t border-border pt-5 text-center [@media(max-width:800px)]:max-w-[400px]">
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
        <p className="mt-[10px] mb-2 text-[9px] leading-[1.7] text-muted-foreground">
          Предыдущие этапы также считаются достигнутыми.
        </p>
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
