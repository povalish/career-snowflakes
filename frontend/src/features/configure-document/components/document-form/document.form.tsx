import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/button";

import { documentSchema, type DocumentFF } from "../../schemas/document";
import { GroupForm } from "../group-form/group.form";
import { errorMessage, field, form, header, input, submitError } from "./document.classes";

//
//

interface IDocumentForm {
  defaultValues: DocumentFF;
  onSubmit: (values: DocumentFF) => Promise<void>;
}

export const DocumentForm: React.FC<IDocumentForm> = ({ defaultValues, onSubmit }) => {
  // Form
  //

  const methods = useForm<DocumentFF>({
    defaultValues,
    mode: "onBlur",
    resolver: zodResolver(documentSchema),
  });

  const nameError = methods.formState.errors.name;
  const submissionError = methods.formState.errors.root?.message;

  // Methods
  //

  const submit = methods.handleSubmit(async (values) => {
    methods.clearErrors("root");

    try {
      await onSubmit(values);
      methods.reset(values);
    } catch (cause) {
      methods.setError("root", {
        message: cause instanceof Error ? cause.message : String(cause),
        type: "server",
      });
    }
  });

  // Render
  //

  return (
    <FormProvider {...methods}>
      <form
        className={form()}
        aria-label="Document settings"
        noValidate
        onSubmit={(event) => void submit(event)}
      >
        <header className={header()}>
          <h1 className="text-2xl font-semibold">Configure document</h1>
          <Button
            type="submit"
            disabled={!methods.formState.isDirty || methods.formState.isSubmitting}
          >
            Apply changes
          </Button>
        </header>

        {submissionError && (
          <p role="alert" className={submitError()}>
            <strong>Failed to apply changes.</strong> {submissionError}
          </p>
        )}

        <div className={field()}>
          <label htmlFor="schema-name" className="text-sm font-medium">
            Schema name
          </label>
          <input
            {...methods.register("name")}
            id="schema-name"
            type="text"
            className={input()}
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? "schema-name-error" : undefined}
          />
          {nameError && (
            <p id="schema-name-error" role="alert" className={errorMessage()}>
              {nameError.message}
            </p>
          )}
        </div>

        <GroupForm />
      </form>
    </FormProvider>
  );
};
