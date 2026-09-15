import { Link } from "react-router";

import { XIcon } from "lucide-react";
import { observer } from "mobx-react-lite";

import { documentService } from "@/entities/document";
import { DocumentForm, mapDocumentToFormFields } from "@/features/configure-document";
import { ROUTES } from "@/shared/config/routes";
import { buttonVariants } from "@/shared/ui/button";

import { main } from "./settings.classes";

//
//

export const SettingsScreen: React.FC = observer(() => {
  return (
    <section className={main()}>
      <DocumentForm defaultValues={mapDocumentToFormFields(documentService.document)} />

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
