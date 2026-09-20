import { observer } from "mobx-react-lite";

import { documentService } from "@/entities/document";
import {
  DocumentForm,
  mapDocumentToFormFields,
  mapFormFieldsToDocument,
  type DocumentFF,
} from "@/features/configure-document";
import { ScreenNavigation } from "@/widgets/screen-navigation";

import { background, main } from "./settings.classes";

//
//

const saveDocument = async (formFields: DocumentFF): Promise<void> => {
  const candidate = mapFormFieldsToDocument(formFields, documentService.document);
  await documentService.save(candidate);
};

const importDocument = async (): Promise<DocumentFF | null> => {
  const document = await documentService.import();
  return document ? mapDocumentToFormFields(document) : null;
};

const exportDocument = async (): Promise<boolean> => documentService.export();

//
//

export const SettingsScreen: React.FC = observer(() => {
  return (
    <section className={main()}>
      <div className={background()} aria-hidden="true" />
      <DocumentForm
        defaultValues={mapDocumentToFormFields(documentService.document)}
        onSubmit={saveDocument}
        onImport={importDocument}
        onExport={exportDocument}
      />

      <ScreenNavigation active="settings" />
    </section>
  );
});
