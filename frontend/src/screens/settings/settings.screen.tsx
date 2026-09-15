import { Link } from "react-router";

import { XIcon } from "lucide-react";
import { observer } from "mobx-react-lite";

import { documentService } from "@/entities/document";
import {
  DocumentForm,
  mapDocumentToFormFields,
  mapFormFieldsToDocument,
  type DocumentFF,
} from "@/features/configure-document";
import { ROUTES } from "@/shared/config/routes";
import { buttonVariants } from "@/shared/ui/button";

import { main } from "./settings.classes";

//
//

const saveDocument = async (formFields: DocumentFF): Promise<void> => {
  const candidate = mapFormFieldsToDocument(formFields, documentService.document);
  await documentService.save(candidate);
};

//
//

export const SettingsScreen: React.FC = observer(() => {
  return (
    <section className={main()}>
      <DocumentForm
        defaultValues={mapDocumentToFormFields(documentService.document)}
        onSubmit={saveDocument}
      />

      <Link
        to={ROUTES.main}
        aria-label="Back to main screen"
        className={buttonVariants({
          className: "absolute top-6 right-6",
          size: "icon-lg",
          variant: "default",
        })}
        viewTransition
      >
        <XIcon className="text-track-black" />
      </Link>
    </section>
  );
});
