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
    name: "Инженерия",
    color: "aqua",
    tracks: [
      {
        id: "frontend",
        code: "FE",
        name: "Фронтенд",
        progress: 2,
        levelCount: 4,
      },
      {
        id: "backend",
        code: "BE",
        name: "Бэкенд",
        progress: 1,
        levelCount: 3,
      },
    ],
  },
  {
    id: "people",
    name: "Работа с людьми",
    color: "purple",
    tracks: [
      {
        id: "mentoring",
        code: "MNT",
        name: "Менторство",
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

    const navigation = screen.getByRole("navigation", { name: "Треки развития" });

    expect(within(navigation).getByRole("heading", { name: "Инженерия" })).toBeVisible();
    expect(within(navigation).getByRole("heading", { name: "Работа с людьми" })).toBeVisible();
    expect(within(navigation).getAllByRole("listitem")).toHaveLength(3);

    for (const track of groups.flatMap((group) => group.tracks)) {
      expect(within(navigation).getByText(track.code)).toBeVisible();
      expect(within(navigation).getByText(track.name)).toBeVisible();
      expect(
        within(navigation).getByLabelText(`${track.progress} из ${track.levelCount} уровней`),
      ).toHaveTextContent(`${track.progress}/${track.levelCount}`);
    }

    expect(within(navigation).getByText("Бэкенд").parentElement).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(within(navigation).getByText("Фронтенд").parentElement).not.toHaveAttribute(
      "aria-current",
    );

    fireEvent.click(within(navigation).getByRole("button", { name: /Открыть Фронтенд/ }));

    expect(onTrackSelect).toHaveBeenCalledWith("frontend");
  });
});
