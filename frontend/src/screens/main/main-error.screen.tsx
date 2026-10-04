import { ScreenNavigation } from "@/widgets/screen-navigation";
import { main, background, loadError } from "./main.classes";

//
//

interface IMainErrorScreen {
  message: string;
}

export const MainErrorScreen: React.FC<IMainErrorScreen> = ({ message }) => {
  return (
    <main className={main()}>
      <div className={background()} aria-hidden="true" />
      <p className={loadError()} role="alert">
        Could not load document: {message}
      </p>
      <ScreenNavigation active="main" />
    </main>
  );
}
