import type { ReactNode } from "react";

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ScreenNavigation } from "./screen-navigation";

//
//

const runtimeMocks = vi.hoisted(() => ({ quit: vi.fn<() => Promise<void>>() }));

vi.mock("@wailsio/runtime", () => ({ Application: { Quit: runtimeMocks.quit } }));
vi.mock("react-router", () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("<ScreenNavigation />", () => {
  it("quits the application from the power button", () => {
    runtimeMocks.quit.mockResolvedValue(undefined);

    render(<ScreenNavigation active="main" />);
    fireEvent.click(screen.getByRole("button", { name: "Exit application" }));

    expect(runtimeMocks.quit).toHaveBeenCalledOnce();
  });
});
