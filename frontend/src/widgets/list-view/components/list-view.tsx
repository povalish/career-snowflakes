import { TRACK_COLOR_CLASSES } from "@/shared/config/track-colors";

import type { ListViewGroup } from "../types/list-view.types";
import { groupMarker, groupTitle, list, trackList } from "./list-view.classes";
import { Track } from "./track";

//
//

export interface IListView {
  groups: readonly ListViewGroup[];
  selectedTrackId: string | null;
  onTrackSelect: (trackId: string) => void;
}

export const ListView: React.FC<IListView> = ({ groups, selectedTrackId, onTrackSelect }) => {
  if (groups.length === 0) return null;

  return (
    <nav className={list()} aria-label="Development tracks">
      {groups.map((group) => {
        const colorClass = TRACK_COLOR_CLASSES[group.color] ?? TRACK_COLOR_CLASSES.aqua;

        return (
          <section key={group.id} className={colorClass}>
            <h2 className={groupTitle()}>
              <span className={groupMarker()} />
              {group.name}
            </h2>

            <ul className={trackList()}>
              {group.tracks.map((track) => (
                <li key={track.id}>
                  <Track
                    track={track}
                    selected={track.id === selectedTrackId}
                    onSelect={onTrackSelect}
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </nav>
  );
};
