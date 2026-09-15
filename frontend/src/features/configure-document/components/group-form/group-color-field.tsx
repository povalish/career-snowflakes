import { useId } from "react";
import { useFormContext, useFormState } from "react-hook-form";

import { Check } from "lucide-react";

import { GROUP_COLOR_CLASSES, GROUP_COLORS } from "@/shared/config/track-colors";

import type { DocumentFF } from "../../schemas/document";
import {
  field,
  label,
  palette,
  colorOption,
  colorInput,
  colorCheck,
  errorMessage,
} from "./group-color-field.classes";
import { COLOR_NAMES } from "./group.constants";

//
//

interface IGroupColorField {
  groupIndex: number;
}

export const GroupColorField: React.FC<IGroupColorField> = ({ groupIndex }) => {
  const fieldId = useId();
  const { control, register } = useFormContext<DocumentFF>();
  const { errors } = useFormState({ control, name: `groups.${groupIndex}.color` });
  const colorError = errors.groups?.[groupIndex]?.color;

  return (
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
              {...register(`groups.${groupIndex}.color`)}
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
  );
};
