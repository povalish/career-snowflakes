import { useId } from "react";
import { useFormContext, useFormState } from "react-hook-form";

import type { DocumentFF } from "../../schemas/document";
import { wideField, label, textarea, errorMessage } from "./track-description.classes";

//
//

interface ITrackDescription {
  groupIndex: number;
  trackIndex: number;
}

export const TrackDescription: React.FC<ITrackDescription> = ({ groupIndex, trackIndex }) => {
  const fieldId = useId();
  const { control, register } = useFormContext<DocumentFF>();
  const { errors } = useFormState({
    control,
    name: `groups.${groupIndex}.tracks.${trackIndex}.description`,
  });
  const descriptionError = errors.groups?.[groupIndex]?.tracks?.[trackIndex]?.description;

  return (
    <div className={wideField()}>
      <label htmlFor={`${fieldId}-description`} className={label()}>
        Track description
      </label>
      <textarea
        {...register(`groups.${groupIndex}.tracks.${trackIndex}.description`)}
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
  );
};
