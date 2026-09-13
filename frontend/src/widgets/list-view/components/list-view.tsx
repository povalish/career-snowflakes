import { LIST_VIEW_COLOR_CLASSES } from "../constants/list-view.constants";
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
    <nav className={list()} aria-label="Треки развития">
      {groups.map((group) => {
        const colorClass = LIST_VIEW_COLOR_CLASSES[group.color] ?? LIST_VIEW_COLOR_CLASSES.aqua;

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
