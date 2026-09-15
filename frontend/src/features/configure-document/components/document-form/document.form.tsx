import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { documentSchema, type DocumentFF } from "../../schemas/document";
import { GroupForm } from "../group-form/group.form";
import { DocumentFeedback } from "./document-feedback";
import { DocumentToolbar } from "./document-toolbar";
import { form, body } from "./document.classes";

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

  const { isSubmitting } = methods.formState;

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
        <DocumentToolbar />
        <DocumentFeedback />

        <fieldset className={body()} disabled={isSubmitting}>
          <GroupForm />
        </fieldset>
      </form>
    </FormProvider>
  );
};
