import { useId, useState } from "react";
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
  trackButton,
  trackCode,
  trackList,
  wideField,
} from "./track.classes";
import { MAX_TRACKS } from "./track.constants";
import { createTrack } from "./track.utils";

//
//

interface ITrackForm {
  groupIndex: number;
}

export const TrackForm: React.FC<ITrackForm> = ({ groupIndex }) => {
  // State
  //

  const fieldId = useId();
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);

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
    append(createTrack(groups));
    setSelectedTrackIndex(tracks.length);
  };

  const removeTrack = (): void => {
    if (!canRemoveTrack) return;

    remove(selectedIndex);
    setSelectedTrackIndex(Math.max(0, selectedIndex - 1));
  };

  // Aliases
  //

  const trackErrors = errors.groups?.[groupIndex]?.tracks?.[selectedIndex];
  const codeError = trackErrors?.code;
  const nameError = trackErrors?.name;
  const descriptionError = trackErrors?.description;

  return (
    <section className={section()} aria-labelledby={`${fieldId}-heading`}>
      <div className={header()}>
        <h3 id={`${fieldId}-heading`} className={heading()}>
          Tracks
        </h3>
        <Button type="button" variant="outline" onClick={addTrack} disabled={!canAddTrack}>
          <Plus aria-hidden="true" />
          Add track
        </Button>
      </div>

      <div className={trackList()} aria-label="Select track">
        {fields.map((trackField, index) => {
          const track = tracks[index];

          return (
            <Button
              key={trackField.fieldKey}
              type="button"
              variant={index === selectedIndex ? "default" : "outline"}
              className={trackButton()}
              aria-invalid={Boolean(errors.groups?.[groupIndex]?.tracks?.[index])}
              aria-label={`${track?.code || "No code"} ${track?.name.trim() || "Unnamed track"}`}
              aria-pressed={index === selectedIndex}
              onClick={() => setSelectedTrackIndex(index)}
            >
              <span className={trackCode()}>{track?.code || "—"}</span>
              {track?.name.trim() || "Unnamed track"}
            </Button>
          );
        })}
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
            {...register(`groups.${groupIndex}.tracks.${selectedIndex}.name`)}
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

        <Button
          type="button"
          variant="destructive"
          onClick={removeTrack}
          disabled={!canRemoveTrack || isSubmitting}
        >
          <Trash2 aria-hidden="true" />
          Remove track
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

        <div className={wideField()}>
          <label htmlFor={`${fieldId}-resources`} className={label()}>
            Track resources
          </label>
          <textarea
            {...register(`groups.${groupIndex}.tracks.${selectedIndex}.resources`)}
            id={`${fieldId}-resources`}
            className={textarea()}
          />
        </div>
      </div>

      <LevelForm
        key={`level-form-${selectedField.fieldKey}`}
        groupIndex={groupIndex}
        trackIndex={selectedIndex}
      />
    </section>
  );
};
