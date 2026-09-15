import type { RouteObject } from "react-router";
import { createMemoryRouter } from "react-router";

import { MainScreen } from "@/screens/main";
import { SettingsScreen } from "@/screens/settings";
import { ROUTES } from "@/shared/config/routes";

//
//

const routes = [
  { path: ROUTES.main, element: <MainScreen /> },
  { path: ROUTES.settings, element: <SettingsScreen /> },
] satisfies RouteObject[];

export const router = createMemoryRouter(routes);
