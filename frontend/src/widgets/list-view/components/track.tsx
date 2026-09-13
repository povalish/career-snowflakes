import type { ListViewTrack } from "../types/list-view.types";
import { trackButton, trackCode, trackLevelCount, trackName, trackProgress } from "./track.classes";

//
//

interface ITrack {
  track: ListViewTrack;
  selected: boolean;
  onSelect: (trackId: string) => void;
}

export const Track: React.FC<ITrack> = ({ track, selected, onSelect }) => {
  return (
    <button
      type="button"
      className={trackButton()}
      data-selected={selected}
      aria-current={selected ? "true" : undefined}
      aria-label={`Открыть ${track.name}, текущий уровень ${track.progress}`}
      onClick={() => onSelect(track.id)}
    >
      <span className={trackCode()}>{track.code}</span>
      <span className={trackName()}>{track.name}</span>
      <span
        className={trackProgress()}
        aria-label={`${track.progress} из ${track.levelCount} уровней`}
      >
        <span aria-hidden="true">
          {track.progress}
          <span className={trackLevelCount()}>/{track.levelCount}</span>
        </span>
      </span>
    </button>
  );
};
