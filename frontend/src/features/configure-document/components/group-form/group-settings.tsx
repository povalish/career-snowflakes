import { useId } from "react";
import { useFormContext, useFormState } from "react-hook-form";

import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";

import type { DocumentFF } from "../../schemas/document";
import { GroupColorField } from "./group-color-field";
import {
  header,
  heading,
  section,
  fields as fieldsClass,
  field,
  label,
  control as controlClass,
  removeButton,
  errorMessage,
} from "./group-settings.classes";

//
//

interface IGroupSettings {
  groupIndex: number;
  canRemoveGroup: boolean;
  onRemoveGroup: () => void;
  onNameMount: (element: HTMLInputElement | null) => void;
}

export const GroupSettings: React.FC<IGroupSettings> = ({
  groupIndex,
  canRemoveGroup,
  onRemoveGroup,
  onNameMount,
}) => {
  const fieldId = useId();
  const { control, register } = useFormContext<DocumentFF>();
  const { errors, isSubmitting } = useFormState({ control, name: `groups.${groupIndex}.name` });
  const nameRegistration = register(`groups.${groupIndex}.name`);
  const nameError = errors.groups?.[groupIndex]?.name;

  return (
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
          onClick={onRemoveGroup}
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
              onNameMount(element);
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

        <GroupColorField groupIndex={groupIndex} />
      </div>
    </section>
  );
};
