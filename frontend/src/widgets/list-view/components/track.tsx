import type { ListViewTrack } from "../types/list-view.types";

//
//

interface ITrack {
  track: ListViewTrack;
  selected: boolean;
}

export const Track: React.FC<ITrack> = ({ track, selected }) => {
  return (
    <div
      className="flex w-full items-center gap-1.75 px-2 py-1.5 text-[10px] text-muted-foreground data-[selected=true]:rounded-sm data-[selected=true]:bg-muted data-[selected=true]:text-foreground data-[selected=true]:shadow-[inset_2px_0_0_var(--track-color)] min-[1400px]:py-1.75 min-[1400px]:text-[11px]"
      data-selected={selected}
      aria-current={selected ? "true" : undefined}
    >
      <span className="text-[8px] opacity-65">{track.code}</span>
      <span className="flex-1 wrap-anywhere">{track.name}</span>
      <span
        className="text-(--track-color) [font-variant-numeric:tabular-nums]"
        aria-label={`${track.progress} из ${track.levelCount} уровней`}
      >
        <span aria-hidden="true">
          {track.progress}
          <span className="text-muted-foreground opacity-60">/{track.levelCount}</span>
        </span>
      </span>
    </div>
  );
};
