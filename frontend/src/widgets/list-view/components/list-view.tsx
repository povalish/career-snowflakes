import { LIST_VIEW_COLOR_CLASSES } from "../constants/list-view.constants";
import type { ListViewGroup } from "../types/list-view.types";
import { Track } from "./track";

//
//

export interface IListView {
  groups: readonly ListViewGroup[];
  selectedTrackId: string | null;
}

export const ListView: React.FC<IListView> = ({ groups, selectedTrackId }) => {
  if (groups.length === 0) return null;

  return (
    <nav
      className="grid gap-4 pt-4.5 [@media(max-width:700px)]:grid-cols-2 [@media(max-width:700px)]:gap-x-1.75 [@media(max-width:700px)]:gap-y-4.5"
      aria-label="Треки развития"
    >
      {groups.map((group) => {
        const colorClass = LIST_VIEW_COLOR_CLASSES[group.color] ?? LIST_VIEW_COLOR_CLASSES.aqua;

        return (
          <section key={group.id} className={colorClass}>
            <h2 className="mt-0 mr-0 mb-1.25 ml-2.25 flex items-center gap-1.75 text-[10px] font-medium text-(--track-color)">
              <span className="inline-block size-1.5 shrink-0 rounded-full bg-(--track-color)" />
              {group.name}
            </h2>

            <ul className="m-0 list-none p-0">
              {group.tracks.map((track) => (
                <li key={track.id}>
                  <Track track={track} selected={track.id === selectedTrackId} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </nav>
  );
};
