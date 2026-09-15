import { useId, useState } from "react";
import { useFieldArray, useFormContext, useFormState, useWatch } from "react-hook-form";

import { Plus, Trash2 } from "lucide-react";

import { GROUP_COLOR_CLASSES, GROUP_COLORS } from "@/shared/config/track-colors";
import { Button } from "@/shared/ui/button";

import type { DocumentFF } from "../../schemas/document";
import { MAX_TRACKS } from "../track-form/track.constants";
import { TrackForm } from "../track-form/track.form";
import {
  colorDot,
  control as controlClass,
  errorMessage,
  field,
  fields as fieldsClass,
  groupButton,
  groupList,
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
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);

  // Form
  //

  const { control, register } = useFormContext<DocumentFF>();
  const { errors, isSubmitting } = useFormState({ control, name: "groups" });
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
  const trackCount = groups.reduce((count, group) => count + group.tracks.length, 0);
  const canAddGroup = groups.length < MAX_GROUPS && trackCount < MAX_TRACKS;
  const canRemoveGroup = groups.length > 1;

  if (!selectedField || !selectedGroup) return null;

  // Methods
  //

  const addGroup = (): void => {
    const nextGroup = createGroup(groups);
    append(nextGroup);
    setSelectedGroupIndex(groups.length);
  };

  const removeGroup = (): void => {
    if (!canRemoveGroup) return;

    remove(selectedIndex);
    setSelectedGroupIndex(Math.max(0, selectedIndex - 1));
  };

  // Aliases
  //

  const nameError = errors.groups?.[selectedIndex]?.name;
  const colorError = errors.groups?.[selectedIndex]?.color;

  return (
    <section className={section()} aria-labelledby={`${fieldId}-heading`}>
      <div className={header()}>
        <h2 id={`${fieldId}-heading`} className={heading()}>
          Groups
        </h2>
        <Button type="button" variant="outline" onClick={addGroup} disabled={!canAddGroup}>
          <Plus aria-hidden="true" />
          Add group
        </Button>
      </div>

      <div className={groupList()} aria-label="Select group">
        {fields.map((groupField, index) => {
          const group = groups[index];
          const colorClass = group ? GROUP_COLOR_CLASSES[group.color] : GROUP_COLOR_CLASSES.aqua;

          return (
            <Button
              key={groupField.fieldKey}
              type="button"
              variant={index === selectedIndex ? "default" : "outline"}
              className={groupButton()}
              aria-invalid={Boolean(errors.groups?.[index])}
              aria-pressed={index === selectedIndex}
              onClick={() => setSelectedGroupIndex(index)}
            >
              <span className={colorDot({ className: colorClass })} aria-hidden="true" />
              {group?.name.trim() || "Unnamed group"}
            </Button>
          );
        })}
      </div>

      <div key={selectedField.fieldKey}>
        <div className={fieldsClass()}>
          <div className={field()}>
            <label htmlFor={`${fieldId}-name`} className={label()}>
              Group name
            </label>
            <input
              {...register(`groups.${selectedIndex}.name`)}
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

          <div className={field()}>
            <label htmlFor={`${fieldId}-color`} className={label()}>
              Group color
            </label>
            <select
              {...register(`groups.${selectedIndex}.color`)}
              id={`${fieldId}-color`}
              className={controlClass()}
              aria-invalid={Boolean(colorError)}
              aria-describedby={colorError ? `${fieldId}-color-error` : undefined}
            >
              {GROUP_COLORS.map((color) => (
                <option key={color} value={color}>
                  {COLOR_NAMES[color]}
                </option>
              ))}
            </select>
            {colorError && (
              <p id={`${fieldId}-color-error`} role="alert" className={errorMessage()}>
                {colorError.message}
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="destructive"
            onClick={removeGroup}
            disabled={!canRemoveGroup || isSubmitting}
          >
            <Trash2 aria-hidden="true" />
            Remove group
          </Button>
        </div>

        <TrackForm groupIndex={selectedIndex} />
      </div>
    </section>
  );
};
