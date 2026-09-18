import { createContext, useContext, useRef, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import type { DocumentFF } from "../../schemas/document";
import { MAX_TRACKS } from "../track-form/track.constants";
import { MAX_GROUPS } from "./group.constants";
import { createGroup } from "./group.utils";

//
//

export const useGroupFormState = () => {
  const pendingNameFocus = useRef<string | null>(null);
  const [isGeneralTabSelected, setIsGeneralTabSelected] = useState(true);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);

  const { control } = useFormContext<DocumentFF>();
  const groups = useWatch({ control, name: "groups" });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "groups",
    keyName: "fieldKey",
  });

  const selectedIndex = Math.min(selectedGroupIndex, fields.length - 1);
  const trackCount = groups.reduce((total, group) => total + group.tracks.length, 0);
  const canAddGroup = groups.length < MAX_GROUPS && trackCount < MAX_TRACKS;
  const canRemoveGroup = groups.length > 1;

  const selectGeneral = (): void => {
    setIsGeneralTabSelected(true);
  };

  const selectTrack = (groupIndex: number, trackIndex: number): void => {
    setIsGeneralTabSelected(false);
    setSelectedGroupIndex(groupIndex);
    setSelectedTrackIndex(trackIndex);
  };

  const addGroup = (): void => {
    const nextGroup = createGroup(groups);
    pendingNameFocus.current = `groups.${groups.length}.name`;
    append(nextGroup, { shouldFocus: false });
    selectTrack(groups.length, 0);
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

  return {
    groups,
    fields,
    editor: {
      isGeneralTabSelected: isGeneralTabSelected,
      selectedGroupIndex: selectedIndex,
      selectedTrackIndex,
      canAddGroup,
      canRemoveGroup,
      selectGeneral,
      selectTrack,
      addGroup,
      removeGroup,
      focusNewName,
    },
  };
};

export const GroupFormContext = createContext<
  ReturnType<typeof useGroupFormState>["editor"] | null
>(null);

export const useGroupFormContext = () => {
  const context = useContext(GroupFormContext);

  if (!context) {
    throw new Error("useGroupFormContext must be used within GroupForm");
  }

  return context;
};
