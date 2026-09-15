import { useFormContext, useFormState } from "react-hook-form";

import { Check, Circle, LoaderCircle, RotateCcw, Save } from "lucide-react";

import { Button } from "@/shared/ui/button";

import type { DocumentFF } from "../../schemas/document";
import { header, screenTitle, actions, status, statusIcon } from "./document-toolbar.classes";

//
//

export const DocumentToolbar: React.FC = () => {
  // Form
  //

  const { control, reset } = useFormContext<DocumentFF>();
  const { isDirty, isSubmitting, isSubmitSuccessful } = useFormState({ control });

  // Aliases
  //

  let StatusIcon = Check;
  let statusText = "All changes saved";

  if (isSubmitting) {
    StatusIcon = LoaderCircle;
    statusText = "Applying…";
  } else if (isDirty) {
    StatusIcon = Circle;
    statusText = "Unsaved changes";
  } else if (isSubmitSuccessful) {
    statusText = "Changes saved";
  }

  return (
    <header className={header()}>
      <h1 className={screenTitle()}>Document settings</h1>
      <div className={actions()}>
        <div className={status()} data-dirty={isDirty}>
          <StatusIcon className={statusIcon({ busy: isSubmitting })} aria-hidden="true" />
          <output>{statusText}</output>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Reset changes"
          title="Reset changes"
          disabled={!isDirty || isSubmitting}
          onClick={() => reset()}
        >
          <RotateCcw aria-hidden="true" />
        </Button>

        <Button type="submit" disabled={!isDirty || isSubmitting}>
          <Save aria-hidden="true" />
          Apply changes
        </Button>
      </div>
    </header>
  );
};
