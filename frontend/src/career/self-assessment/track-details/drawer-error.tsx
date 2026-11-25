import { errorMessage } from "./drawer.classes";

//
//

interface IDrawerError {
  error: string;
}

export const DrawerError: React.FC<IDrawerError> = ({ error }) => {
  return (
    <div role="alert" className={errorMessage()}>
      <strong>Failed to save the level.</strong> {error}
    </div>
  );
};
