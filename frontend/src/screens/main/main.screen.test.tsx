import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createDocumentMock, documentService } from "@/entities/document";
import type { Document } from "@/entities/document";

import { MainScreen } from "./main.screen";

//
//

const bridgeMocks = vi.hoisted(() => ({
  save: vi.fn<(document: Document) => Promise<Document>>(),
}));

vi.mock("@/entities/document/document-bridge.service", () => ({
  DocumentBridgeService: { save: bridgeMocks.save },
}));

vi.mock("react-router", () => ({
  Link: () => null,
}));

//
//

beforeEach(() => {
  documentService.document = createDocumentMock();
  documentService.selectedTrackId = null;
  documentService.selectedLevel = null;
  bridgeMocks.save.mockImplementation(async (document) => document);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("<MainScreen />", () => {
  it("opens the selected chart level and highlights its track", () => {
    render(<MainScreen />);

    const navigation = screen.getByRole("navigation", { name: "Development tracks" });
    const backendButton = within(navigation).getByRole("button", { name: /Open Backend/ });
    const frontendButton = within(navigation).getByRole("button", { name: /Open Frontend/ });
    const closedDrawer = document.querySelector<HTMLElement>("[role='dialog']");

    expect(closedDrawer).toHaveAttribute("data-closed");

    fireEvent.click(screen.getByRole("button", { name: /Backend: level 1/ }));

    expect(documentService.selectedTrackId).toBe("backend");
    expect(documentService.selectedLevel).toBe(1);
    expect(backendButton).toHaveAttribute("aria-current", "true");
    expect(frontendButton).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("dialog", { name: "Backend" })).toHaveAttribute("data-open");
    expect(screen.getByRole("button", { name: "Level 1: Introduction" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "Level 4: Team Growth" }));

    expect(documentService.selectedLevel).toBe(4);
    expect(screen.getByRole("button", { name: "Level 4: Team Growth" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("opens the next level from the track list and saves progress", async () => {
    render(<MainScreen />);

    fireEvent.click(screen.getByRole("button", { name: /Open Backend/ }));

    expect(documentService.selectedLevel).toBeNull();
    expect(screen.getByRole("button", { name: "Level 3: Independence" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "Set level 3" }));

    await waitFor(() => expect(bridgeMocks.save).toHaveBeenCalledOnce());
    expect(documentService.document.progress.backend).toBe(3);
    expect(documentService.selectedLevel).toBe(3);
    expect(screen.getByRole("button", { name: "Current level" })).toBeDisabled();
  });
});
