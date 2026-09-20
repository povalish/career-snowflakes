import { useFormContext, useFormState } from "react-hook-form";

import { Check, Circle, Download, LoaderCircle, RotateCcw, Save, Upload } from "lucide-react";

import { Button } from "@/shared/ui/button";

import type { DocumentFF } from "../../schemas/document";
import { header, screenTitle, actions, status, statusIcon } from "./document-toolbar.classes";

//
//

interface IDocumentToolbar {
  isTransferring: boolean;
  onImport?: () => Promise<void>;
  onExport?: () => Promise<void>;
}

export const DocumentToolbar: React.FC<IDocumentToolbar> = ({
  isTransferring,
  onImport,
  onExport,
}) => {
  // Form
  //

  const { control, reset } = useFormContext<DocumentFF>();
  const { isDirty, isSubmitting, isSubmitSuccessful } = useFormState({ control });

  // Aliases
  //

  let StatusIcon = Check;
  let statusText = "All changes saved";

  if (isSubmitting || isTransferring) {
    StatusIcon = LoaderCircle;
    statusText = isTransferring ? "Working with file…" : "Applying…";
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
        <div>
          {onImport && (
            <Button
              type="button"
              variant="outline"
              size='xs'
              disabled={isSubmitting || isTransferring}
              onClick={() => void onImport()}
            >
              <Upload aria-hidden="true" />
              Import
            </Button>
          )}

          {onExport && (
            <Button
              type="button"
              variant="outline"
              size='xs'
              disabled={isSubmitting || isTransferring}
              onClick={() => void onExport()}
            >
              <Download aria-hidden="true" />
              Export
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className={status()} data-dirty={isDirty}>
            <StatusIcon
              className={statusIcon({ busy: isSubmitting || isTransferring })}
              aria-hidden="true"
            />
            <output>{statusText}</output>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Reset changes"
            title="Reset changes"
            disabled={!isDirty || isSubmitting || isTransferring}
            onClick={() => reset()}
          >
            <RotateCcw aria-hidden="true" />
          </Button>

          <Button type="submit" disabled={!isDirty || isSubmitting || isTransferring}>
            <Save aria-hidden="true" />
            Apply changes
          </Button>
        </div>
      </div>
    </header>
  );
};
