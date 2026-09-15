import { useId } from "react";

import { section, title, description } from "./general.classes";
import { MatrixNameField } from "./matrix-name-field";

//
//

export const GeneralForm: React.FC = () => {
  const fieldId = useId();

  return (
    <section className={section()} aria-labelledby={`${fieldId}-heading`}>
      <h2 id={`${fieldId}-heading`} className={title()}>
        General
      </h2>
      <p className={description()}>Name your career matrix.</p>

      <MatrixNameField />
    </section>
  );
};
