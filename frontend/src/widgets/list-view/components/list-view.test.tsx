import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { ListViewGroup } from "../types/list-view.types";
import { ListView } from "./list-view";

//
//

const groups: ListViewGroup[] = [
  {
    id: "engineering",
    name: "Engineering",
    color: "aqua",
    tracks: [
      {
        id: "frontend",
        code: "FE",
        name: "Frontend",
        progress: 2,
        levelCount: 4,
      },
      {
        id: "backend",
        code: "BE",
        name: "Backend",
        progress: 1,
        levelCount: 3,
      },
    ],
  },
  {
    id: "people",
    name: "People",
    color: "purple",
    tracks: [
      {
        id: "mentoring",
        code: "MNT",
        name: "Mentoring",
        progress: 3,
        levelCount: 5,
      },
    ],
  },
];

//
//

describe("<ListView />", () => {
  it("renders every group and all track data", () => {
    const onTrackSelect = vi.fn<(trackId: string) => void>();

    render(<ListView groups={groups} selectedTrackId="backend" onTrackSelect={onTrackSelect} />);

    const navigation = screen.getByRole("navigation", { name: "Development tracks" });

    expect(within(navigation).getByRole("heading", { name: "Engineering" })).toBeVisible();
    expect(within(navigation).getByRole("heading", { name: "People" })).toBeVisible();
    expect(within(navigation).getAllByRole("listitem")).toHaveLength(3);

    for (const track of groups.flatMap((group) => group.tracks)) {
      expect(within(navigation).getByText(track.code)).toBeVisible();
      expect(within(navigation).getByText(track.name)).toBeVisible();
      expect(
        within(navigation).getByLabelText(`${track.progress} of ${track.levelCount} levels`),
      ).toHaveTextContent(`${track.progress}/${track.levelCount}`);
    }

    expect(within(navigation).getByText("Backend").parentElement).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(within(navigation).getByText("Frontend").parentElement).not.toHaveAttribute(
      "aria-current",
    );

    fireEvent.click(within(navigation).getByRole("button", { name: /Open Frontend/ }));

    expect(onTrackSelect).toHaveBeenCalledWith("frontend");
  });
});
