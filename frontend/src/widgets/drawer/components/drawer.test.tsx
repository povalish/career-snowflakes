import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Group, Track } from "@/entities/document";

import { Drawer } from "./drawer";

//
//

const track: Track = {
  id: "backend",
  code: "BE",
  name: "Backend",
  description: "Backend track",
  resources: "",
  levels: [
    { name: "Introduction", description: "First level", examples: [] },
    { name: "Practice", description: "Second level", examples: [] },
    { name: "Independence", description: "Third level", examples: [] },
  ],
};

const group: Group = {
  id: "technology",
  name: "Technology",
  color: "aqua",
  tracks: [track],
};

//
//

afterEach(cleanup);

describe("<Drawer />", () => {
  it("renders fallback content without selection data", () => {
    render(
      <Drawer
        open
        onOpenChange={vi.fn<(open: boolean) => void>()}
        onSelectLevel={vi.fn<(level: number) => void>()}
        onSetProgress={vi.fn<(level: number) => Promise<void>>()}
      />,
    );

    expect(screen.getByRole("dialog", { name: "No track selected" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Level 1: No level selected" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("selects the next level when an explicit level is not provided", () => {
    render(
      <Drawer
        open
        group={group}
        track={track}
        progress={1}
        selectedLevel={null}
        onOpenChange={vi.fn<(open: boolean) => void>()}
        onSelectLevel={vi.fn<(level: number) => void>()}
        onSetProgress={vi.fn<(level: number) => Promise<void>>()}
      />,
    );

    expect(screen.getByRole("button", { name: "Level 2: Practice" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("reports level selection and progress changes through callbacks", async () => {
    const onSelectLevel = vi.fn<(level: number) => void>();
    const onSetProgress = vi.fn<(level: number) => Promise<void>>().mockResolvedValue(undefined);

    render(
      <Drawer
        open
        group={group}
        track={track}
        progress={1}
        selectedLevel={3}
        onOpenChange={vi.fn<(open: boolean) => void>()}
        onSelectLevel={onSelectLevel}
        onSetProgress={onSetProgress}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Level 1: Introduction" }));
    expect(onSelectLevel).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole("button", { name: "Set level 3" }));

    await waitFor(() => expect(onSetProgress).toHaveBeenCalledWith(3));
    expect(onSelectLevel).toHaveBeenLastCalledWith(3);
  });
});
