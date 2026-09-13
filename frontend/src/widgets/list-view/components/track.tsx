import type { ListViewTrack } from "../types/list-view.types";

//
//

interface ITrack {
  track: ListViewTrack;
}

export const Track: React.FC<ITrack> = ({ track }) => {
  return (
    <div className="flex w-full items-center gap-1.75 px-2 py-1.5 text-[10px] text-muted-foreground min-[1400px]:py-1.75 min-[1400px]:text-[11px]">
      <span className="text-[8px] [font-variant-numeric:tabular-nums] opacity-65">
        {String(track.index + 1).padStart(2, "0")}
      </span>
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
