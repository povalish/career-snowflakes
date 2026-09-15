import { useRef, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { GROUP_COLOR_CLASSES } from "@/shared/config/track-colors";

import type { DocumentFF } from "../../schemas/document";
import { GeneralForm } from "../general-form/general.form";
import { MAX_TRACKS } from "../track-form/track.constants";
import { TrackForm } from "../track-form/track.form";
import { GroupSettings } from "./group-settings";
import { workspace, editor } from "./group.classes";
import { MAX_GROUPS } from "./group.constants";
import { createGroup } from "./group.utils";
import { MatrixNavigation } from "./matrix-navigation";

//
//

export const GroupForm: React.FC = () => {
  // State
  //
  const pendingNameFocus = useRef<string | null>(null);
  const [generalSelected, setGeneralSelected] = useState(true);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);

  // Form
  //

  const { control } = useFormContext<DocumentFF>();
  const groups = useWatch({ control, name: "groups" });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "groups",
    keyName: "fieldKey",
  });

  // Properties
  //

  const selectedIndex = Math.min(selectedGroupIndex, fields.length - 1);
  const selectedField = fields[selectedIndex];
  const selectedGroup = groups[selectedIndex];
  const trackCount = groups.reduce((total, group) => total + group.tracks.length, 0);
  const canAddGroup = groups.length < MAX_GROUPS && trackCount < MAX_TRACKS;
  const canRemoveGroup = groups.length > 1;

  if (!selectedField || !selectedGroup) return null;

  // Methods
  //

  const addGroup = (): void => {
    const nextGroup = createGroup(groups);
    pendingNameFocus.current = `groups.${groups.length}.name`;
    append(nextGroup, { shouldFocus: false });
    setGeneralSelected(false);
    setSelectedGroupIndex(groups.length);
    setSelectedTrackIndex(0);
  };

  const removeGroup = (): void => {
    if (!canRemoveGroup) return;

    remove(selectedIndex);
    setSelectedGroupIndex(Math.max(0, selectedIndex - 1));
    setSelectedTrackIndex(0);
  };

  const focusNewName = (element: HTMLInputElement | null): void => {
    if (element && element.name === pendingNameFocus.current) {
      element.focus();
      element.select();
      pendingNameFocus.current = null;
    }
  };

  return (
    <div className={workspace()}>
      <MatrixNavigation
        groups={groups}
        fields={fields}
        trackCount={trackCount}
        generalSelected={generalSelected}
        selectedIndex={selectedIndex}
        selectedTrackIndex={selectedTrackIndex}
        canAddGroup={canAddGroup}
        onAddGroup={addGroup}
        onSelectGeneral={() => setGeneralSelected(true)}
        onSelectTrack={(groupIndex, trackIndex) => {
          setGeneralSelected(false);
          setSelectedGroupIndex(groupIndex);
          setSelectedTrackIndex(trackIndex);
        }}
      />

      {generalSelected ? (
        <div key="general" className={editor()}>
          <GeneralForm />
        </div>
      ) : (
        <div
          key={selectedField.fieldKey}
          className={editor({ className: GROUP_COLOR_CLASSES[selectedGroup.color] })}
        >
          <GroupSettings
            groupIndex={selectedIndex}
            canRemoveGroup={canRemoveGroup}
            onRemoveGroup={removeGroup}
            onNameMount={focusNewName}
          />

          <TrackForm
            groupIndex={selectedIndex}
            selectedTrackIndex={selectedTrackIndex}
            onSelectTrack={setSelectedTrackIndex}
          />
        </div>
      )}
    </div>
  );
};
