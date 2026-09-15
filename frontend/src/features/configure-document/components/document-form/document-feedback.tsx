import { useFormContext, useFormState } from "react-hook-form";

import type { DocumentFF } from "../../schemas/document";
import { submitError } from "./document-feedback.classes";

//
//

export const DocumentFeedback: React.FC = () => {
  const { control } = useFormContext<DocumentFF>();
  const { errors, submitCount } = useFormState({ control });
  const submissionError = errors.root?.message;

  return (
    <>
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
