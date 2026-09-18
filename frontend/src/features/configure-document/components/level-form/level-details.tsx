import { useId } from "react";
import { useFormContext, useFormState } from "react-hook-form";

import type { DocumentFF } from "../../schemas/document";
import { field, label, textarea, errorMessage } from "./level-details.classes";

//
//

interface ILevelDetails {
  groupIndex: number;
  trackIndex: number;
  levelIndex: number;
}

export const LevelDetails: React.FC<ILevelDetails> = ({ groupIndex, trackIndex, levelIndex }) => {
  const fieldId = useId();
  const { control, register } = useFormContext<DocumentFF>();
  const { errors } = useFormState({
    control,
    name: `groups.${groupIndex}.tracks.${trackIndex}.levels.${levelIndex}`,
  });
  const levelErrors = errors.groups?.[groupIndex]?.tracks?.[trackIndex]?.levels?.[levelIndex];
  const descriptionError = levelErrors?.description;
  const examplesError = levelErrors?.examplesText;

  return (
    <div className="flex flex-col">
      <div className={field()}>
        <label htmlFor={`${fieldId}-description`} className={label()}>
          Level description
        </label>
        <textarea
          {...register(
            `groups.${groupIndex}.tracks.${trackIndex}.levels.${levelIndex}.description`,
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
            `groups.${groupIndex}.tracks.${trackIndex}.levels.${levelIndex}.examplesText`,
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
  );
};
