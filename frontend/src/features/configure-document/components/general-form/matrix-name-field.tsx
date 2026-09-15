import { useId } from "react";
import { useFormContext, useFormState } from "react-hook-form";

import type { DocumentFF } from "../../schemas/document";
import { field, label, input, errorMessage } from "./matrix-name-field.classes";

//
//

export const MatrixNameField: React.FC = () => {
  const fieldId = useId();
  const { control, register } = useFormContext<DocumentFF>();
  const { errors } = useFormState({ control, name: "name" });

  return (
    <div className={field()}>
      <label htmlFor={`${fieldId}-name`} className={label()}>
        Matrix name
      </label>
      <input
        {...register("name")}
        id={`${fieldId}-name`}
        type="text"
        className={input()}
        aria-invalid={Boolean(errors.name)}
        aria-describedby={errors.name ? `${fieldId}-error` : undefined}
      />
      {errors.name && (
        <p id={`${fieldId}-error`} role="alert" className={errorMessage()}>
          {errors.name.message}
        </p>
      )}
    </div>
  );
};
