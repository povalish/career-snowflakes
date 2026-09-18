import { useId } from "react";
import { useFormContext, useFormState } from "react-hook-form";

import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";

import type { DocumentFF } from "../../schemas/document";
import { LevelDetails } from "./level-details";
import {
  levelCaption,
  levelEyebrow,
  removeButton,
  fields as fieldsClass,
  label,
  nameField,
  control as controlClass,
  errorMessage,
} from "./level-editor.classes";

//
//

interface ILevelEditor {
  fieldKey: string;
  groupIndex: number;
  trackIndex: number;
  levelIndex: number;
  levelCount: number;
  canRemoveLevel: boolean;
  onRemoveLevel: () => void;
  onNameMount: (element: HTMLInputElement | null) => void;
}

export const LevelEditor: React.FC<ILevelEditor> = ({
  fieldKey,
  groupIndex,
  trackIndex,
  levelIndex,
  levelCount,
  canRemoveLevel,
  onRemoveLevel,
  onNameMount,
}) => {
  const fieldId = useId();
  const { control, register } = useFormContext<DocumentFF>();
  const { errors, isSubmitting } = useFormState({
    control,
    name: `groups.${groupIndex}.tracks.${trackIndex}.levels.${levelIndex}`,
  });
  const nameRegistration = register(
    `groups.${groupIndex}.tracks.${trackIndex}.levels.${levelIndex}.name`,
  );
  const levelErrors = errors.groups?.[groupIndex]?.tracks?.[trackIndex]?.levels?.[levelIndex];
  const nameError = levelErrors?.name;

  return (
    <>
      <div className={levelCaption()}>
        <span className={levelEyebrow()}>
          Level {levelIndex + 1} of {levelCount}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={removeButton()}
          aria-label="Remove level"
          title="Remove level"
          onClick={onRemoveLevel}
          disabled={!canRemoveLevel || isSubmitting}
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </div>

      <div key={fieldKey} className={fieldsClass()}>
        <div className={nameField()}>
          <label htmlFor={`${fieldId}-name`} className={label()}>
            Level name
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

        <LevelDetails groupIndex={groupIndex} trackIndex={trackIndex} levelIndex={levelIndex} />
      </div>
    </>
  );
};
