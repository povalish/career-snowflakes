import { RouterProvider } from "react-router";

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { documentService, type Document } from "@/career/document";
import { createDocumentMock } from "@/career/document/document.mock";

import { router } from "./routes";

const bridge = vi.hoisted(() => ({
  load: vi.fn<() => Promise<Document>>(),
  save: vi.fn<(candidate: Document) => Promise<Document>>(),
}));

vi.mock("@/career/document/document-bridge.service", () => ({ DocumentBridgeService: bridge }));

afterEach(cleanup);

it("shows the revised progress in self-assessment after removing a reached level in the editor", async () => {
  bridge.load.mockResolvedValueOnce(createDocumentMock());
  bridge.save.mockImplementationOnce(async (candidate) => candidate);
  await documentService.load();
  render(<RouterProvider router={router} />);

  expect(screen.getByRole("button", { name: "Open Frontend, current level 3" })).toBeVisible();
  fireEvent.click(screen.getByRole("link", { name: "Open settings screen" }));
  fireEvent.click(await screen.findByRole("button", { name: "FE Frontend" }));
  fireEvent.click(screen.getByRole("button", { name: "Level 2: Practice" }));
  fireEvent.click(screen.getByRole("button", { name: "Remove level" }));
  expect(bridge.save).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole("button", { name: "Apply changes" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Apply changes" })).toBeDisabled());
  await waitFor(() => expect(documentService.document?.progress.frontend).toBe(2));
  fireEvent.click(screen.getByRole("link", { name: "Back to main screen" }));

  expect(
    await screen.findByRole("button", { name: "Open Frontend, current level 2" }),
  ).toBeVisible();
  expect(
    screen.getByRole("button", { name: /Frontend: level 2, Independence, completed/ }),
  ).toBeVisible();
});
