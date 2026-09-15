import { useId } from "react";
import { useFormContext, useFormState } from "react-hook-form";

import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";

import type { DocumentFF } from "../../schemas/document";
import { TrackDescription } from "./track-description";
import {
  fields as fieldsClass,
  field,
  label,
  control as controlClass,
  titleInput,
  removeButton,
  errorMessage,
} from "./track-fields.classes";
import { TrackResources } from "./track-resources";

//
//

interface ITrackFields {
  groupIndex: number;
  trackIndex: number;
  canRemoveTrack: boolean;
  onRemoveTrack: () => void;
  onNameMount: (element: HTMLInputElement | null) => void;
}

export const TrackFields: React.FC<ITrackFields> = ({
  groupIndex,
  trackIndex,
  canRemoveTrack,
  onRemoveTrack,
  onNameMount,
}) => {
  const fieldId = useId();
  const { control, register } = useFormContext<DocumentFF>();
  const { errors, isSubmitting } = useFormState({
    control,
    name: `groups.${groupIndex}.tracks.${trackIndex}`,
  });
  const nameRegistration = register(`groups.${groupIndex}.tracks.${trackIndex}.name`);
  const trackErrors = errors.groups?.[groupIndex]?.tracks?.[trackIndex];
  const codeError = trackErrors?.code;
  const nameError = trackErrors?.name;

  return (
    <div className={fieldsClass()}>
      <div className={field()}>
        <label htmlFor={`${fieldId}-code`} className={label()}>
          Track code
        </label>
        <input
          {...register(`groups.${groupIndex}.tracks.${trackIndex}.code`)}
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
            onNameMount(element);
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
        onClick={onRemoveTrack}
        disabled={!canRemoveTrack || isSubmitting}
      >
        <Trash2 aria-hidden="true" />
      </Button>

      <TrackDescription groupIndex={groupIndex} trackIndex={trackIndex} />

      <TrackResources groupIndex={groupIndex} trackIndex={trackIndex} />
    </div>
  );
};
