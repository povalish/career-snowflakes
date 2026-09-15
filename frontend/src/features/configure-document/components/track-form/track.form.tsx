import { useId, useRef } from "react";
import { useFieldArray, useFormContext, useFormState, useWatch } from "react-hook-form";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";

import type { DocumentFF } from "../../schemas/document";
import { LevelForm } from "../level-form/level.form";
import {
  control as controlClass,
  errorMessage,
  field,
  fields as fieldsClass,
  header,
  heading,
  label,
  section,
  textarea,
  titleInput,
  removeButton,
  resourcesSection,
  resourcesSummary,
  wideField,
} from "./track.classes";
import { MAX_TRACKS } from "./track.constants";
import { createTrack } from "./track.utils";

//
//

interface ITrackForm {
  groupIndex: number;
  selectedTrackIndex: number;
  onSelectTrack: (index: number) => void;
}

export const TrackForm: React.FC<ITrackForm> = ({
  groupIndex,
  selectedTrackIndex,
  onSelectTrack,
}) => {
  // State
  //

  const fieldId = useId();
  const pendingNameFocus = useRef<string | null>(null);

  // Form
  //

  const { control, register } = useFormContext<DocumentFF>();
  const { errors, isSubmitting } = useFormState({
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
    onSelectTrack(tracks.length);
  };

  const removeTrack = (): void => {
    if (!canRemoveTrack) return;

    remove(selectedIndex);
    onSelectTrack(Math.max(0, selectedIndex - 1));
  };

  // Aliases
  //

  const nameRegistration = register(`groups.${groupIndex}.tracks.${selectedIndex}.name`);
  const trackErrors = errors.groups?.[groupIndex]?.tracks?.[selectedIndex];
  const codeError = trackErrors?.code;
  const nameError = trackErrors?.name;
  const descriptionError = trackErrors?.description;

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

      <div key={selectedField.fieldKey} className={fieldsClass()}>
        <div className={field()}>
          <label htmlFor={`${fieldId}-code`} className={label()}>
            Track code
          </label>
          <input
            {...register(`groups.${groupIndex}.tracks.${selectedIndex}.code`)}
            id={`${fieldId}-code`}
            type="text"
            maxLength={3}
            className={controlClass()}
            aria-invalid={Boolean(codeError)}
            aria-describedby={codeError ? `${fieldId}-code-error` : undefined}
          />
          {codeError && (
            <p id={`${fieldId}-code-error`} role="alert" className={errorMessage()}>
              {codeError.message}
            </p>
          )}
        </div>

        <div className={field()}>
          <label htmlFor={`${fieldId}-name`} className={label()}>
            Track name
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
            className={titleInput()}
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? `${fieldId}-name-error` : undefined}
          />
          {nameError && (
            <p id={`${fieldId}-name-error`} role="alert" className={errorMessage()}>
              {nameError.message}
            </p>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={removeButton()}
          aria-label="Remove track"
          title="Remove track"
          onClick={removeTrack}
          disabled={!canRemoveTrack || isSubmitting}
        >
          <Trash2 aria-hidden="true" />
        </Button>

        <div className={wideField()}>
          <label htmlFor={`${fieldId}-description`} className={label()}>
            Track description
          </label>
          <textarea
            {...register(`groups.${groupIndex}.tracks.${selectedIndex}.description`)}
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

        <details className={resourcesSection()}>
          <summary className={resourcesSummary()}>Learning resources</summary>
          <div className={field()}>
            <label htmlFor={`${fieldId}-resources`} className={label()}>
              Track resources
            </label>
            <textarea
              {...register(`groups.${groupIndex}.tracks.${selectedIndex}.resources`)}
              id={`${fieldId}-resources`}
              className={textarea()}
              placeholder="Links, books, or notes to support this track…"
            />
          </div>
        </details>
      </div>

      <LevelForm
        key={`level-form-${selectedField.fieldKey}`}
        groupIndex={groupIndex}
        trackIndex={selectedIndex}
      />
    </section>
  );
};
