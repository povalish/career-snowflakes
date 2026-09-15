import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createDocumentMock, documentService } from "@/entities/document";
import type { Document } from "@/entities/document";

import { SettingsScreen } from "./settings.screen";

//
//

const bridgeMocks = vi.hoisted(() => ({
  save: vi.fn<(document: Document) => Promise<Document>>(),
}));

vi.mock("react-router", () => ({
  Link: () => null,
}));

vi.mock("@/entities/document/document-bridge.service", () => ({
  DocumentBridgeService: { save: bridgeMocks.save },
}));

beforeEach(() => {
  documentService.document = createDocumentMock();
  bridgeMocks.save.mockImplementation(async (document) => document);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("<SettingsScreen />", () => {
  it("passes the document from the store to the form", () => {
    documentService.document.schema.name = "Store schema";

    render(<SettingsScreen />);

    expect(screen.getByRole("textbox", { name: "Schema name" })).toHaveValue("Store schema");
  });

  it("saves submitted form fields through the document store", async () => {
    render(<SettingsScreen />);

    fireEvent.change(screen.getByRole("textbox", { name: "Schema name" }), {
      target: { value: "Updated schema" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Apply changes" }));

    await waitFor(() => expect(bridgeMocks.save).toHaveBeenCalledOnce());
    expect(bridgeMocks.save.mock.calls[0]?.[0].schema.name).toBe("Updated schema");
    expect(documentService.document.schema.name).toBe("Updated schema");
  });
});
