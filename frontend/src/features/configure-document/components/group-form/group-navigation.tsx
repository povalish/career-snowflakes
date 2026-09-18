import { useFormContext, useFormState } from "react-hook-form";

import { GROUP_COLOR_CLASSES } from "@/shared/config/track-colors";

import type { DocumentFF } from "../../schemas/document";
import { useGroupFormContext } from "./group-form.context";
import {
  groupItem,
  groupButton,
  colorDot,
  trackButton,
  trackCode,
  trackName,
  count,
} from "./group-navigation.classes";

//
//

interface IGroupNavigation {
  group: DocumentFF["groups"][number] | undefined;
  groupIndex: number;
  invalidDescriptionId: string;
}

export const GroupNavigation: React.FC<IGroupNavigation> = ({
  group,
  groupIndex,
  invalidDescriptionId,
}) => {
  const { control } = useFormContext<DocumentFF>();
  const { errors } = useFormState({ control, name: `groups.${groupIndex}` });
  const { isGeneralTabSelected, selectedGroupIndex, selectedTrackIndex, selectTrack } =
    useGroupFormContext();

  const selected = !isGeneralTabSelected && groupIndex === selectedGroupIndex;
  const groupErrors = errors.groups?.[groupIndex];
  const colorClass = group ? GROUP_COLOR_CLASSES[group.color] : GROUP_COLOR_CLASSES.aqua;

  return (
    <section className={groupItem({ className: colorClass })}>
      <button
        type="button"
        className={groupButton()}
        aria-label={group?.name.trim() || "Unnamed group"}
        data-invalid={Boolean(groupErrors)}
        aria-describedby={groupErrors ? invalidDescriptionId : undefined}
        aria-pressed={selected}
        onClick={() => selectTrack(groupIndex, 0)}
      >
        <span className={colorDot()} aria-hidden="true" />
        <span className={trackName()}>{group?.name.trim() || "Unnamed group"}</span>
        <span className={count()} aria-hidden="true">
          {group?.tracks.length}
        </span>
      </button>

      {group?.tracks.map((track, trackIndex) => (
        <button
          key={track.id}
          type="button"
          className={trackButton()}
          aria-label={`${track.code || "No code"} ${track.name.trim() || "Unnamed track"}`}
          aria-pressed={
            selected && trackIndex === Math.min(selectedTrackIndex, group.tracks.length - 1)
          }
          data-invalid={Boolean(groupErrors?.tracks?.[trackIndex])}
          aria-describedby={groupErrors?.tracks?.[trackIndex] ? invalidDescriptionId : undefined}
          onClick={() => selectTrack(groupIndex, trackIndex)}
        >
          <span className={trackCode()}>{track.code || "—"}</span>
          <span className={trackName()}>{track.name.trim() || "Unnamed track"}</span>
          <span className={count()} aria-label={`${track.levels.length} levels`}>
            {track.levels.length}
          </span>
        </button>
      ))}
    </section>
  );
};
