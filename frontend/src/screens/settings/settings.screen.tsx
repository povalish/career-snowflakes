import { Link } from "react-router";

import { XIcon } from "lucide-react";

import { ROUTES } from "@/shared/config/routes";
import { buttonVariants } from "@/shared/ui/button";

import { main } from "./settings.classes";

//
//

export const SettingsScreen: React.FC = () => {
  return (
    <section className={main()}>
      SettingsScreen
      <Link
        to={ROUTES.main}
        aria-label="Back to main screen"
        className={buttonVariants({
          className: "absolute top-6 right-6",
          size: "icon-lg",
          variant: "default",
        })}
        viewTransition
      >
        <XIcon className="text-track-black" />
      </Link>
    </section>
  );
};
