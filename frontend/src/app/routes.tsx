import { createMemoryRouter } from "react-router";

import { documentService } from "@/career/document";

import { DocumentWorkspace } from "./document-workspace";
import { ROUTES } from "./route-paths";

export const router = createMemoryRouter([
  { path: ROUTES.main, element: <DocumentWorkspace service={documentService} active="main" /> },
  {
    path: ROUTES.settings,
    element: <DocumentWorkspace service={documentService} active="settings" />,
  },
]);
