import { useId, useRef, useState } from "react";
import { useFieldArray, useFormContext, useFormState, useWatch } from "react-hook-form";

import { Check, FileText, Plus, Trash2 } from "lucide-react";

import { GROUP_COLOR_CLASSES, GROUP_COLORS } from "@/shared/config/track-colors";
import { Button } from "@/shared/ui/button";

import type { DocumentFF } from "../../schemas/document";
import { GeneralForm } from "../general-form/general.form";
import { MAX_TRACKS } from "../track-form/track.constants";
import { TrackForm } from "../track-form/track.form";
import {
  colorDot,
  colorOption,
  colorInput,
  colorCheck,
  palette,
  control as controlClass,
  errorMessage,
  field,
  fields as fieldsClass,
  groupButton,
  generalButton,
  generalIcon,
  groupList,
  sidebar,
  workspace,
  editor,
  errorHint,
  groupItem,
  trackButton,
  trackCode,
  trackName,
  count,
  removeButton,
  header,
  heading,
  label,
  section,
} from "./group.classes";
import { COLOR_NAMES, MAX_GROUPS } from "./group.constants";
import { createGroup } from "./group.utils";

//
//

export const GroupForm: React.FC = () => {
  // State
  //
  const fieldId = useId();
  const pendingNameFocus = useRef<string | null>(null);
  const [generalSelected, setGeneralSelected] = useState(true);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);

  // Form
  //

  const { control, register } = useFormContext<DocumentFF>();
  const { errors, isSubmitting } = useFormState({ control, name: ["groups", "name"] });
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

  // Aliases
  //

  const nameRegistration = register(`groups.${selectedIndex}.name`);
  const nameError = errors.groups?.[selectedIndex]?.name;
  const colorError = errors.groups?.[selectedIndex]?.color;

  return (
    <div className={workspace()}>
      <nav className={sidebar()} aria-label="Matrix structure">
        {(errors.groups || errors.name) && (
          <span id={`${fieldId}-invalid`} className={errorHint()}>
            Contains invalid fields
          </span>
        )}
        <button
          type="button"
          className={generalButton()}
          aria-pressed={generalSelected}
          data-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${fieldId}-invalid` : undefined}
          onClick={() => setGeneralSelected(true)}
        >
          <FileText className={generalIcon()} aria-hidden="true" />
          General
        </button>
        <div className={header()}>
          <h2 id={`${fieldId}-heading`} className={heading()}>
            Your matrix
          </h2>
          <span className={count()}>{trackCount} tracks</span>
        </div>
        <div className={groupList()}>
          {fields.map((groupField, index) => {
            const group = groups[index];
            const colorClass = group ? GROUP_COLOR_CLASSES[group.color] : GROUP_COLOR_CLASSES.aqua;

            return (
              <section key={groupField.fieldKey} className={groupItem({ className: colorClass })}>
                <button
                  type="button"
                  className={groupButton()}
                  aria-label={group?.name.trim() || "Unnamed group"}
                  data-invalid={Boolean(errors.groups?.[index])}
                  aria-describedby={errors.groups?.[index] ? `${fieldId}-invalid` : undefined}
                  aria-pressed={!generalSelected && index === selectedIndex}
                  onClick={() => {
                    setGeneralSelected(false);
                    setSelectedGroupIndex(index);
                    setSelectedTrackIndex(0);
                  }}
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
                      !generalSelected &&
                      index === selectedIndex &&
                      trackIndex === Math.min(selectedTrackIndex, group.tracks.length - 1)
                    }
                    data-invalid={Boolean(errors.groups?.[index]?.tracks?.[trackIndex])}
                    aria-describedby={
                      errors.groups?.[index]?.tracks?.[trackIndex]
                        ? `${fieldId}-invalid`
                        : undefined
                    }
                    onClick={() => {
                      setGeneralSelected(false);
                      setSelectedGroupIndex(index);
                      setSelectedTrackIndex(trackIndex);
                    }}
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
          })}
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={addGroup}
          disabled={!canAddGroup || isSubmitting}
        >
          <Plus aria-hidden="true" /> Add group
        </Button>
      </nav>

      {generalSelected ? (
        <div key="general" className={editor()}>
          <GeneralForm />
        </div>
      ) : (
        <div
          key={selectedField.fieldKey}
          className={editor({ className: GROUP_COLOR_CLASSES[selectedGroup.color] })}
        >
          <section className={section()} aria-label="Group settings">
            <div className={header()}>
              <span className={heading()}>Group settings</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className={removeButton()}
                aria-label="Remove group"
                title="Remove group"
                onClick={removeGroup}
                disabled={!canRemoveGroup || isSubmitting}
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </div>
            <div className={fieldsClass()}>
              <div className={field()}>
                <label htmlFor={`${fieldId}-name`} className={label()}>
                  Group name
                </label>
                <input
                  {...nameRegistration}
                  ref={(element) => {
                    nameRegistration.ref(element);
                    if (element && element.name === pendingNameFocus.current) {
                      element.focus();
                      element.select();
                      pendingNameFocus.current = null;
                    }
                  }}
                  id={`${fieldId}-name`}
                  type="text"
                  className={controlClass()}
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? `${fieldId}-name-error` : undefined}
                />
                {nameError && (
                  <p id={`${fieldId}-name-error`} role="alert" className={errorMessage()}>
                    {nameError.message}
                  </p>
                )}
              </div>

              <fieldset className={field()}>
                <legend className={label()}>Group color</legend>
                <div className={palette()}>
                  {GROUP_COLORS.map((color) => (
                    <label
                      key={color}
                      className={colorOption({ className: GROUP_COLOR_CLASSES[color] })}
                      title={COLOR_NAMES[color]}
                    >
                      <input
                        {...register(`groups.${selectedIndex}.color`)}
                        type="radio"
                        value={color}
                        aria-label={COLOR_NAMES[color]}
                        className={colorInput()}
                        aria-describedby={colorError ? `${fieldId}-color-error` : undefined}
                      />
                      <span className={colorCheck()} aria-hidden="true">
                        <Check />
                      </span>
                    </label>
                  ))}
                </div>
                {colorError && (
                  <p id={`${fieldId}-color-error`} role="alert" className={errorMessage()}>
                    {colorError.message}
                  </p>
                )}
              </fieldset>
            </div>
          </section>
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
