import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createDocumentMock, documentService } from "@/entities/document";

import { SettingsScreen } from "./settings.screen";

//
//

vi.mock("react-router", () => ({
  Link: () => null,
}));

vi.mock("@/entities/document/document-bridge.service", () => ({
  DocumentBridgeService: {},
}));

beforeEach(() => {
  documentService.document = createDocumentMock();
});

afterEach(cleanup);

describe("<SettingsScreen />", () => {
  it("passes the document from the store to the form", () => {
    documentService.document.schema.name = "Store schema";

    render(<SettingsScreen />);

    expect(screen.getByText("Store schema")).toBeVisible();
  });
});
