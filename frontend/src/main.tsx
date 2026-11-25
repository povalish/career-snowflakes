import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/app";
import "@/app/styles/globals.css";
import { documentService } from "@/career/document";

const root = document.getElementById("root");
if (!root) throw new Error("Application root element not found");

// Start setting up document while application is loading
void documentService.load();

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
