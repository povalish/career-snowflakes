import { useId, useRef, useState } from "react";
import { useFieldArray, useFormContext, useFormState, useWatch } from "react-hook-form";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";

import type { DocumentFF } from "../../schemas/document";
import {
  control as controlClass,
  errorMessage,
  field,
  fields as fieldsClass,
  header,
  heading,
  label,
  levelButton,
  levelList,
  levelNumber,
  levelCaption,
  levelEyebrow,
  removeButton,
  nameField,
  section,
  textarea,
} from "./level.classes";
import { MAX_LEVELS } from "./level.constants";
import { createLevel } from "./level.utils";

//
//

interface ILevelForm {
  groupIndex: number;
  trackIndex: number;
}

export const LevelForm: React.FC<ILevelForm> = ({ groupIndex, trackIndex }) => {
  // State
  //

  const fieldId = useId();
  const pendingNameFocus = useRef<string | null>(null);
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(0);

  // Form
  //

  const { control, register } = useFormContext<DocumentFF>();
  const { errors, isSubmitting } = useFormState({
    control,
    name: `groups.${groupIndex}.tracks.${trackIndex}.levels`,
  });
  const groups = useWatch({ control, name: "groups" });
  const levels = groups[groupIndex]?.tracks[trackIndex]?.levels ?? [];
  const { fields, append, remove } = useFieldArray({
    control,
    name: `groups.${groupIndex}.tracks.${trackIndex}.levels`,
    keyName: "fieldKey",
  });

  // Properties
  //

  const selectedIndex = Math.min(selectedLevelIndex, fields.length - 1);
  const selectedField = fields[selectedIndex];
  const selectedLevel = levels[selectedIndex];
  const canAddLevel = levels.length < MAX_LEVELS;
  const canRemoveLevel = levels.length > 1;

  if (!selectedField || !selectedLevel) return null;

  // Methods
  //

  const addLevel = (): void => {
    pendingNameFocus.current = `groups.${groupIndex}.tracks.${trackIndex}.levels.${levels.length}.name`;
    append(createLevel(levels.length + 1), { shouldFocus: false });
    setSelectedLevelIndex(levels.length);
  };

  const removeLevel = (): void => {
    if (!canRemoveLevel) return;

    remove(selectedIndex);
    setSelectedLevelIndex(Math.max(0, selectedIndex - 1));
  };

  // Aliases
  //

  const nameRegistration = register(
    `groups.${groupIndex}.tracks.${trackIndex}.levels.${selectedIndex}.name`,
  );
  const levelErrors = errors.groups?.[groupIndex]?.tracks?.[trackIndex]?.levels?.[selectedIndex];
  const nameError = levelErrors?.name;
  const descriptionError = levelErrors?.description;
  const examplesError = levelErrors?.examplesText;

  return (
    <section className={section()} aria-labelledby={`${fieldId}-heading`}>
      <div className={header()}>
        <h4 id={`${fieldId}-heading`} className={heading()}>
          Development levels
        </h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLevel}
          disabled={!canAddLevel || isSubmitting}
        >
          <Plus aria-hidden="true" />
          Add level
        </Button>
      </div>

      <div className={levelList()} aria-label="Select level">
        {fields.map((levelField, index) => {
          const level = levels[index];
          const levelLabel = `Level ${index + 1}: ${level?.name.trim() || "Unnamed level"}`;

          return (
            <button
              key={levelField.fieldKey}
              type="button"
              className={levelButton()}
              data-invalid={Boolean(
                errors.groups?.[groupIndex]?.tracks?.[trackIndex]?.levels?.[index],
              )}
              aria-label={levelLabel}
              title={levelLabel}
              aria-pressed={index === selectedIndex}
              onClick={() => setSelectedLevelIndex(index)}
            >
              <span className={levelNumber()} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      <div className={levelCaption()}>
        <span className={levelEyebrow()}>
          Level {selectedIndex + 1} of {levels.length}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={removeButton()}
          aria-label="Remove level"
          title="Remove level"
          onClick={removeLevel}
          disabled={!canRemoveLevel || isSubmitting}
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </div>
      <div key={selectedField.fieldKey} className={fieldsClass()}>
        <div className={nameField()}>
          <label htmlFor={`${fieldId}-name`} className={label()}>
            Level name
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
            maxLength={120}
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
          <label htmlFor={`${fieldId}-description`} className={label()}>
            Level description
          </label>
          <textarea
            {...register(
              `groups.${groupIndex}.tracks.${trackIndex}.levels.${selectedIndex}.description`,
            )}
            id={`${fieldId}-description`}
            maxLength={4000}
            className={textarea()}
            aria-invalid={Boolean(descriptionError)}
            aria-describedby={descriptionError ? `${fieldId}-description-error` : undefined}
          />
          {descriptionError && (
            <p id={`${fieldId}-description-error`} role="alert" className={errorMessage()}>
              {descriptionError.message}
            </p>
          )}
        </div>

        <div className={field()}>
          <label htmlFor={`${fieldId}-examples`} className={label()}>
            Level examples (one per line)
          </label>
          <textarea
            {...register(
              `groups.${groupIndex}.tracks.${trackIndex}.levels.${selectedIndex}.examplesText`,
            )}
            id={`${fieldId}-examples`}
            className={textarea()}
            aria-invalid={Boolean(examplesError)}
            aria-describedby={examplesError ? `${fieldId}-examples-error` : undefined}
          />
          {examplesError && (
            <p id={`${fieldId}-examples-error`} role="alert" className={errorMessage()}>
              {examplesError.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
