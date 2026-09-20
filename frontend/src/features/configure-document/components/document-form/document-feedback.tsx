import { useFormContext, useFormState } from "react-hook-form";

import type { DocumentFF } from "../../schemas/document";
import { submitError, transferSuccess } from "./document-feedback.classes";

//
//

interface IDocumentFeedback {
  transferMessage: string | null;
  transferError: string | null;
}

export const DocumentFeedback: React.FC<IDocumentFeedback> = ({
  transferMessage,
  transferError,
}) => {
  const { control } = useFormContext<DocumentFF>();
  const { errors, submitCount } = useFormState({ control });
  const submissionError = errors.root?.message;

  return (
    <>
      {transferMessage && (
        <p aria-live="polite" className={transferSuccess()}>
          {transferMessage}
        </p>
      )}
      {transferError && (
        <p role="alert" className={submitError()}>
          <strong>File operation failed.</strong> {transferError}
        </p>
      )}
      {submissionError && (
        <p role="alert" className={submitError()}>
          <strong>Failed to apply changes.</strong> {submissionError}
        </p>
      )}

      {submitCount > 0 && (errors.name || errors.groups) && (
        <p role="alert" className={submitError()}>
          Some fields need attention. Select a marked section, track, or level to review them.
        </p>
      )}
    </>
  );
};
