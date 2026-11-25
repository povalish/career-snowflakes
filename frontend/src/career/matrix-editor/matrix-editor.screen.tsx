import type { Document } from "@/career/document";

import { DocumentForm } from "./document-form/document.form";
import { background, main } from "./matrix-editor.classes";
import type { DocumentFF } from "./schemas/document";
import { mapDocumentToFormFields } from "./utils/mapDocumentToFormFields";
import { mapFormFieldsToDocument } from "./utils/mapFormFieldsToDocument";

interface MatrixEditorProps {
  document: Document;
  onSave: (candidate: Document) => Promise<Document>;
  onImport: () => Promise<Document | null>;
  onExport: () => Promise<boolean>;
}

export function MatrixEditorScreen({ document, onSave, onImport, onExport }: MatrixEditorProps) {
  async function importDocument(): Promise<DocumentFF | null> {
    const imported = await onImport();
    return imported && mapDocumentToFormFields(imported);
  }

  async function saveDraft(fields: DocumentFF): Promise<void> {
    await onSave(mapFormFieldsToDocument(fields, document));
  }

  return (
    <section className={main()}>
      <div className={background()} aria-hidden="true" />
      <DocumentForm
        defaultValues={mapDocumentToFormFields(document)}
        onSubmit={saveDraft}
        onImport={importDocument}
        onExport={onExport}
      />
    </section>
  );
}
