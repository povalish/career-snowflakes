import { Link } from "react-router";

import { House, Settings2 } from "lucide-react";

import { ROUTES } from "@/shared/config/routes";

import { icon, navigation, navigationLink } from "./screen-navigation.classes";

//
//

interface IScreenNavigation {
  active: "main" | "settings";
}

export const ScreenNavigation: React.FC<IScreenNavigation> = ({ active }) => {
  return (
    <nav className={navigation()} aria-label="Screen navigation">
      <Link
        to={ROUTES.main}
        aria-label="Back to main screen"
        aria-current={active === "main" ? "page" : undefined}
        title="Home"
        className={navigationLink()}
        viewTransition
      >
        <House className={icon()} aria-hidden="true" />
      </Link>
      <Link
        to={ROUTES.settings}
        aria-label="Open settings screen"
        aria-current={active === "settings" ? "page" : undefined}
        title="Settings"
        className={navigationLink()}
        viewTransition
      >
        <Settings2 className={icon()} aria-hidden="true" />
      </Link>
    </nav>
  );
};
