import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { documentService } from "@/entities/document";

import { MainScreen } from "./main.screen";

// The screen test does not exercise the Wails bridge.
vi.mock("@/entities/document/document-bridge.service", () => ({
  DocumentBridgeService: {},
}));

//
//

afterEach(cleanup);

describe("<MainScreen />", () => {
  it("highlights the track whose chart level was selected", () => {
    render(<MainScreen />);

    fireEvent.click(screen.getByRole("button", { name: /Бэкенд: уровень 1/ }));

    expect(documentService.selectedTrackId).toBe("backend");
    expect(screen.getByText("Бэкенд").parentElement).toHaveAttribute("aria-current", "true");
    expect(screen.getByText("Интерфейсы").parentElement).not.toHaveAttribute("aria-current");
  });
});
