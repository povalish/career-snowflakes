import { ScreenNavigation } from "@/widgets/screen-navigation";
import { LoaderCircle } from "lucide-react";
import { main, background, loadingState, loadingIcon } from "./main.classes";

//
//

export const MainLoadingScreen: React.FC = () => {
  return (
    <main className={main()}>
      <div className={background()} aria-hidden="true" />
      <output className={loadingState()}>
        <LoaderCircle className={loadingIcon()} aria-hidden="true" />
        Loading document…
      </output>
      <ScreenNavigation active="main" />
    </main>
  );
}
