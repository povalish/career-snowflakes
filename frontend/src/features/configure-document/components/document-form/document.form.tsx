import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Circle, LoaderCircle, RotateCcw, Save } from "lucide-react";

import { Button } from "@/shared/ui/button";

import { documentSchema, type DocumentFF } from "../../schemas/document";
import { GroupForm } from "../group-form/group.form";
import {
  actions,
  body,
  form,
  header,
  screenTitle,
  status,
  statusIcon,
  submitError,
} from "./document.classes";

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

  const submissionError = methods.formState.errors.root?.message;
  const { isDirty, isSubmitting, isSubmitSuccessful } = methods.formState;

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
          <h1 className={screenTitle()}>Document settings</h1>
          <div className={actions()}>
            <div className={status()} data-dirty={isDirty}>
              {isSubmitting ? (
                <LoaderCircle className={statusIcon({ busy: true })} aria-hidden="true" />
              ) : isDirty ? (
                <Circle className={statusIcon()} aria-hidden="true" />
              ) : (
                <Check className={statusIcon()} aria-hidden="true" />
              )}
              <output>
                {isSubmitting
                  ? "Applying…"
                  : isDirty
                    ? "Unsaved changes"
                    : isSubmitSuccessful
                      ? "Changes saved"
                      : "All changes saved"}
              </output>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Reset changes"
              title="Reset changes"
              disabled={!isDirty || isSubmitting}
              onClick={() => methods.reset()}
            >
              <RotateCcw aria-hidden="true" />
            </Button>
            <Button type="submit" disabled={!isDirty || isSubmitting}>
              <Save aria-hidden="true" />
              Apply changes
            </Button>
          </div>
        </header>

        {submissionError && (
          <p role="alert" className={submitError()}>
            <strong>Failed to apply changes.</strong> {submissionError}
          </p>
        )}

        {methods.formState.submitCount > 0 &&
          (methods.formState.errors.name || methods.formState.errors.groups) && (
            <p role="alert" className={submitError()}>
              Some fields need attention. Select a marked section, track, or level to review them.
            </p>
          )}

        <fieldset className={body()} disabled={isSubmitting}>
          <GroupForm />
        </fieldset>
      </form>
    </FormProvider>
  );
};
