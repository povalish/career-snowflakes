import { section, title, description } from "./general.classes";
import { MatrixNameField } from "./matrix-name-field";

//
//

export const GeneralForm: React.FC = () => {
  return (
    <section className={section()}>
      <h2 className={title()}>General</h2>
      <p className={description()}>Name your career matrix.</p>

      <MatrixNameField />
    </section>
  );
};
