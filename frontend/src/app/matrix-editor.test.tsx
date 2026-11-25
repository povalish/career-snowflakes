import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DocumentService } from "@/career/document";
import type { Document } from "@/career/document";
import { createDocumentMock } from "@/career/document/document.mock";

import { DocumentWorkspace } from "./document-workspace";

//
//

const bridgeMocks = vi.hoisted(() => ({
  load: vi.fn<() => Promise<Document>>(),
  save: vi.fn<(document: Document) => Promise<Document>>(),
  import: vi.fn<() => Promise<Document | null>>(),
  export: vi.fn<() => Promise<boolean>>(),
}));

vi.mock("react-router", () => ({
  Link: () => null,
}));

vi.mock("@/career/document/document-bridge.service", () => ({
  DocumentBridgeService: {
    load: bridgeMocks.load,
    save: bridgeMocks.save,
    import: bridgeMocks.import,
    export: bridgeMocks.export,
  },
}));

let documentService: DocumentService;

beforeEach(async () => {
  documentService = new DocumentService();
  const saved = createDocumentMock();
  bridgeMocks.load.mockResolvedValue(saved);
  await documentService.load();
  bridgeMocks.save.mockImplementation(async (document) => document);
  bridgeMocks.import.mockResolvedValue(null);
  bridgeMocks.export.mockResolvedValue(false);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Matrix editor", () => {
  it("opens an imported document after the initial load fails", async () => {
    const service = new DocumentService();
    bridgeMocks.load.mockRejectedValueOnce(new Error("Invalid saved file"));
    await service.load();
    bridgeMocks.import.mockResolvedValueOnce(createDocumentMock());
    render(<DocumentWorkspace active="settings" service={service} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Invalid saved file");
    expect(screen.queryByRole("textbox", { name: "Matrix name" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Import" }));

    expect(await screen.findByRole("textbox", { name: "Matrix name" })).toHaveValue(
      "Professional Development Map",
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("passes the document from the store to the form", async () => {
    const saved = createDocumentMock();
    saved.schema.name = "Store schema";
    bridgeMocks.load.mockResolvedValueOnce(saved);
    await documentService.load();

    render(<DocumentWorkspace active="settings" service={documentService} />);

    expect(screen.getByRole("textbox", { name: "Matrix name" })).toHaveValue("Store schema");
  });

  it("saves submitted form fields through the document store", async () => {
    render(<DocumentWorkspace active="settings" service={documentService} />);

    fireEvent.change(screen.getByRole("textbox", { name: "Matrix name" }), {
      target: { value: "Updated schema" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Apply changes" }));

    await waitFor(() => expect(bridgeMocks.save).toHaveBeenCalledOnce());
    expect(bridgeMocks.save.mock.calls[0]?.[0].schema.name).toBe("Updated schema");
    expect(documentService.document?.schema.name).toBe("Updated schema");
  });

  it("imports a document and resets the settings form", async () => {
    const imported = createDocumentMock();
    imported.schema.name = "Imported schema";
    bridgeMocks.import.mockResolvedValue(imported);
    render(<DocumentWorkspace active="settings" service={documentService} />);

    fireEvent.click(screen.getByRole("button", { name: "Import" }));

    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: "Matrix name" })).toHaveValue("Imported schema"),
    );
    expect(documentService.document).toEqual(imported);
    expect(screen.getByRole("button", { name: "Apply changes" })).toBeDisabled();
    expect(screen.getByText("Document imported.")).toBeVisible();
  });

  it("keeps the form when import is cancelled or fails", async () => {
    const schemaName = createDocumentMock().schema.name;
    render(<DocumentWorkspace active="settings" service={documentService} />);
    fireEvent.click(screen.getByRole("button", { name: "Import" }));
    await waitFor(() => expect(bridgeMocks.import).toHaveBeenCalledOnce());
    expect(screen.getByRole("textbox", { name: "Matrix name" })).toHaveValue(schemaName);

    bridgeMocks.import.mockRejectedValueOnce(new Error("Invalid document"));
    fireEvent.click(screen.getByRole("button", { name: "Import" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid document");
    expect(screen.getByRole("textbox", { name: "Matrix name" })).toHaveValue(schemaName);
  });

  it("confirms before replacing unsaved edits", async () => {
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<DocumentWorkspace active="settings" service={documentService} />);
    fireEvent.change(screen.getByRole("textbox", { name: "Matrix name" }), {
      target: { value: "Unsaved schema" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Import" }));

    expect(confirm).toHaveBeenCalledOnce();
    expect(bridgeMocks.import).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox", { name: "Matrix name" })).toHaveValue("Unsaved schema");
    confirm.mockRestore();
  });

  it("replaces an unsaved draft after confirmation", async () => {
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(true);
    const imported = createDocumentMock();
    imported.schema.name = "Imported schema";
    bridgeMocks.import.mockResolvedValue(imported);
    render(<DocumentWorkspace active="settings" service={documentService} />);
    fireEvent.change(screen.getByRole("textbox", { name: "Matrix name" }), {
      target: { value: "Unsaved schema" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Import" }));

    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: "Matrix name" })).toHaveValue("Imported schema"),
    );
    expect(confirm).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Apply changes" })).toBeDisabled();
    confirm.mockRestore();
  });

  it("exports the saved document and reports omitted draft changes", async () => {
    bridgeMocks.export.mockResolvedValue(true);
    render(<DocumentWorkspace active="settings" service={documentService} />);
    fireEvent.change(screen.getByRole("textbox", { name: "Matrix name" }), {
      target: { value: "Unsaved schema" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Export" }));

    await waitFor(() => expect(bridgeMocks.export).toHaveBeenCalledOnce());
    expect(
      await screen.findByText("Saved document exported. Unsaved changes were not included."),
    ).toBeVisible();
    expect(documentService.document?.schema.name).toBe(createDocumentMock().schema.name);
  });

  it("reports export failure without changing the document", async () => {
    bridgeMocks.export.mockRejectedValueOnce(new Error("Disk unavailable"));
    const original = documentService.document;
    render(<DocumentWorkspace active="settings" service={documentService} />);

    fireEvent.click(screen.getByRole("button", { name: "Export" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Disk unavailable");
    expect(documentService.document).toBe(original);
  });
});
