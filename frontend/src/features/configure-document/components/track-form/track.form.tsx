import { useId, useRef } from "react";
import { useFieldArray, useFormContext, useFormState, useWatch } from "react-hook-form";

import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/button";

import type { DocumentFF } from "../../schemas/document";
import { useGroupFormContext } from "../group-form/group-form.context";
import { LevelForm } from "../level-form/level.form";
import { TrackFields } from "./track-fields";
import { section, header, heading } from "./track.classes";
import { MAX_TRACKS } from "./track.constants";
import { createTrack } from "./track.utils";

//
//

interface ITrackForm {
  groupIndex: number;
}

export const TrackForm: React.FC<ITrackForm> = ({ groupIndex }) => {
  const { selectedTrackIndex, selectTrack } = useGroupFormContext();

  // State
  //

  const fieldId = useId();
  const pendingNameFocus = useRef<string | null>(null);

  // Form
  //

  const { control } = useFormContext<DocumentFF>();
  const { isSubmitting } = useFormState({
    control,
    name: `groups.${groupIndex}.tracks`,
  });
  const groups = useWatch({ control, name: "groups" });
  const tracks = groups[groupIndex]?.tracks ?? [];
  const { fields, append, remove } = useFieldArray({
    control,
    name: `groups.${groupIndex}.tracks`,
    keyName: "fieldKey",
  });

  // Properties
  //

  const selectedIndex = Math.min(selectedTrackIndex, fields.length - 1);
  const selectedField = fields[selectedIndex];
  const selectedTrack = tracks[selectedIndex];
  const trackCount = groups.reduce((count, group) => count + group.tracks.length, 0);
  const canAddTrack = trackCount < MAX_TRACKS;
  const canRemoveTrack = tracks.length > 1;

  if (!selectedField || !selectedTrack) return null;

  // Methods
  //

  const addTrack = (): void => {
    pendingNameFocus.current = `groups.${groupIndex}.tracks.${tracks.length}.name`;
    append(createTrack(groups), { shouldFocus: false });
    selectTrack(groupIndex, tracks.length);
  };

  const removeTrack = (): void => {
    if (!canRemoveTrack) return;

    remove(selectedIndex);
    selectTrack(groupIndex, Math.max(0, selectedIndex - 1));
  };

  const focusNewName = (element: HTMLInputElement | null): void => {
    if (element && element.name === pendingNameFocus.current) {
      element.focus();
      element.select();
      pendingNameFocus.current = null;
    }
  };

  return (
    <section className={section()} aria-labelledby={`${fieldId}-heading`}>
      <div className={header()}>
        <h3 id={`${fieldId}-heading`} className={heading()}>
          Track details
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addTrack}
          disabled={!canAddTrack || isSubmitting}
        >
          <Plus aria-hidden="true" />
          Add track
        </Button>
      </div>

      <TrackFields
        key={selectedField.fieldKey}
        groupIndex={groupIndex}
        trackIndex={selectedIndex}
        canRemoveTrack={canRemoveTrack}
        onRemoveTrack={removeTrack}
        onNameMount={focusNewName}
      />

      <LevelForm
        key={`level-form-${selectedField.fieldKey}`}
        groupIndex={groupIndex}
        trackIndex={selectedIndex}
      />
    </section>
  );
};
