import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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
}));

vi.mock("@/career/document/document-bridge.service", () => ({
  DocumentBridgeService: { load: bridgeMocks.load, save: bridgeMocks.save },
}));

vi.mock("react-router", () => ({
  Link: () => null,
}));

//
//

let documentService: DocumentService;

beforeEach(() => {
  const initialDocument = createDocumentMock();

  documentService = new DocumentService();
  bridgeMocks.load.mockResolvedValue(initialDocument);
  bridgeMocks.save.mockImplementation(async (candidate) => candidate);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Self-assessment", () => {
  it("loads the saved document before rendering its content", async () => {
    let resolveLoad!: (document: Document) => void;
    const savedDocument = createDocumentMock();
    savedDocument.profile.name = "Saved profile";
    bridgeMocks.load.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLoad = resolve;
        }),
    );

    void documentService.load();
    render(<DocumentWorkspace active="main" service={documentService} />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading document…");
    expect(bridgeMocks.load).toHaveBeenCalledOnce();
    expect(
      screen.queryByRole("navigation", { name: "Development tracks" }),
    ).not.toBeInTheDocument();

    resolveLoad(savedDocument);

    await screen.findByRole("navigation", { name: "Development tracks" });
    expect(documentService.document?.profile.name).toBe("Saved profile");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows an error instead of the mock document when loading fails", async () => {
    bridgeMocks.load.mockRejectedValue(new Error("Saved file is invalid"));

    void documentService.load();
    render(<DocumentWorkspace active="main" service={documentService} />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not load document: Saved file is invalid",
    );
    expect(
      screen.queryByRole("navigation", { name: "Development tracks" }),
    ).not.toBeInTheDocument();
  });

  it("opens the selected chart level and highlights its track", async () => {
    void documentService.load();
    render(<DocumentWorkspace active="main" service={documentService} />);

    const navigation = await screen.findByRole("navigation", { name: "Development tracks" });
    const backendButton = within(navigation).getByRole("button", { name: /Open Backend/ });
    const frontendButton = within(navigation).getByRole("button", { name: /Open Frontend/ });
    const closedDrawer = document.querySelector<HTMLElement>("[role='dialog']");

    expect(closedDrawer).toHaveAttribute("data-closed");

    fireEvent.click(screen.getByRole("button", { name: /Backend: level 1/ }));

    expect(backendButton).toHaveAttribute("aria-current", "true");
    expect(frontendButton).not.toHaveAttribute("aria-current");
    expect(bridgeMocks.save).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog", { name: "Backend" })).toHaveAttribute("data-open");
    expect(screen.getByRole("button", { name: "Level 1: Introduction" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "Level 4: Team Growth" }));

    expect(screen.getByRole("button", { name: "Level 4: Team Growth" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("opens the next level from the track list and saves progress", async () => {
    void documentService.load();
    render(<DocumentWorkspace active="main" service={documentService} />);

    await screen.findByRole("navigation", { name: "Development tracks" });
    fireEvent.click(screen.getByRole("button", { name: /Open Backend/ }));

    expect(screen.getByRole("button", { name: "Level 3: Independence" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "Set level 3" }));

    await waitFor(() => expect(bridgeMocks.save).toHaveBeenCalledOnce());
    expect(documentService.document?.progress.backend).toBe(3);
    expect(screen.getByRole("button", { name: "Current level" })).toBeDisabled();
  });
});
