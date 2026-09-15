import { useId } from "react";
import { useFormContext, useFormState } from "react-hook-form";

import type { DocumentFF } from "../../schemas/document";
import { description, errorMessage, field, input, label, section, title } from "./general.classes";

//
//

export const GeneralForm: React.FC = () => {
  const fieldId = useId();
  const { control, register } = useFormContext<DocumentFF>();
  const { errors } = useFormState({ control, name: "name" });

  return (
    <section className={section()} aria-labelledby={`${fieldId}-heading`}>
      <h2 id={`${fieldId}-heading`} className={title()}>
        General
      </h2>
      <p className={description()}>Name your career matrix.</p>

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
    </section>
  );
};
