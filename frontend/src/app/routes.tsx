import { createMemoryRouter } from "react-router";

import { MainScreen } from "@/screens/main";
import { SettingsScreen } from "@/screens/settings";

//
//

export const router = createMemoryRouter([
  { path: "/", element: <MainScreen /> },
  { path: "/settings", element: <SettingsScreen /> },
]);
