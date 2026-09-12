import { useEffect, useId, useRef } from "react";
import { FormProvider, useForm, useFormContext, useFormState, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/shared/ui/input";

import { templateSchema } from "../schemas/template.schema";
import type { TemplateFF, TemplateFormState } from "../types/template.types";
import { GroupsEditor } from "./groups.editor";

//
//

interface ITemplateForm {
  defaultValues: TemplateFF;
  disabled?: boolean;
  onStateChange: (state: TemplateFormState) => void;
}

interface ITemplateFormObserver {
  onStateChange: (state: TemplateFormState) => void;
}

const TemplateFormObserver: React.FC<ITemplateFormObserver> = ({ onStateChange }) => {
  const { control } = useFormContext<TemplateFF>();
  const { isDirty, isValid } = useFormState({ control });
  const values = useWatch({
    control,
    compute: (formValues) => formValues,
  });
  const onStateChangeRef = useRef(onStateChange);

  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);

  useEffect(() => {
    onStateChangeRef.current({ values, isDirty, isValid });
  }, [values, isDirty, isValid]);

  return null;
};

export const TemplateForm: React.FC<ITemplateForm> = ({
  defaultValues,
  disabled = false,
  onStateChange,
}) => {
  const fieldId = useId();
  const form = useForm<TemplateFF>({
    resolver: zodResolver(templateSchema),
    mode: "onChange",
    defaultValues,
    shouldUnregister: false,
  });
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <FormProvider {...form}>
      <form
        className="rounded-[12px] border border-border bg-card p-6.5 [@media(max-width:560px)]:p-4.5"
        aria-label="Схема матрицы"
        onSubmit={(event) => event.preventDefault()}
      >
        <TemplateFormObserver onStateChange={onStateChange} />

        <fieldset className="grid min-w-0 gap-6 border-0 p-0" disabled={disabled}>
          <div className="grid min-w-0 gap-2 text-[12px]">
            <label className="text-foreground" htmlFor={`${fieldId}-name`}>
              Название схемы
            </label>

            <Input
              {...register("name")}
              id={`${fieldId}-name`}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${fieldId}-name-error` : undefined}
            />

            {errors.name && (
              <span id={`${fieldId}-name-error`} className="text-destructive" role="alert">
                {errors.name.message}
              </span>
            )}
          </div>

          <GroupsEditor />
        </fieldset>
      </form>
    </FormProvider>
  );
};
