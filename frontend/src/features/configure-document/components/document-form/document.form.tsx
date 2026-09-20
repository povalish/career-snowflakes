import { useState } from "react";
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
  onImport?: () => Promise<DocumentFF | null>;
  onExport?: () => Promise<boolean>;
}

export const DocumentForm: React.FC<IDocumentForm> = ({
  defaultValues,
  onSubmit,
  onImport,
  onExport,
}) => {
  // Form
  //

  const methods = useForm<DocumentFF>({
    defaultValues,
    mode: "onBlur",
    resolver: zodResolver(documentSchema),
  });

  const { isDirty, isSubmitting } = methods.formState;
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferMessage, setTransferMessage] = useState<string | null>(null);
  const [transferError, setTransferError] = useState<string | null>(null);

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

  const importFile = async (): Promise<void> => {
    if (!onImport) return;
    if (
      isDirty &&
      !window.confirm("Importing a document will discard your unsaved changes. Continue?")
    ) {
      return;
    }

    setIsTransferring(true);
    setTransferError(null);
    setTransferMessage(null);

    try {
      const imported = await onImport();
      if (imported) {
        methods.reset(imported);
        setTransferMessage("Document imported.");
      }
    } catch (cause) {
      setTransferError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setIsTransferring(false);
    }
  };

  const exportFile = async (): Promise<void> => {
    if (!onExport) return;

    setIsTransferring(true);
    setTransferError(null);
    setTransferMessage(null);

    try {
      if (await onExport()) {
        setTransferMessage(
          isDirty
            ? "Saved document exported. Unsaved changes were not included."
            : "Document exported.",
        );
      }
    } catch (cause) {
      setTransferError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setIsTransferring(false);
    }
  };

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
        <DocumentToolbar
          isTransferring={isTransferring}
          onImport={onImport ? importFile : undefined}
          onExport={onExport ? exportFile : undefined}
        />
        <DocumentFeedback transferMessage={transferMessage} transferError={transferError} />

        <fieldset className={body()} disabled={isSubmitting || isTransferring}>
          <GroupForm />
        </fieldset>
      </form>
    </FormProvider>
  );
};
