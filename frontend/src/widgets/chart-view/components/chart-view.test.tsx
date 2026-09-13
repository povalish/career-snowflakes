import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ChartViewTrack } from "../types/chart-view.types";
import { ChartView } from "./chart-view";

//
//

const tracks: ChartViewTrack[] = [
  {
    id: "frontend",
    code: "FE",
    groupId: "engineering",
    name: "Фронтенд",
    color: "aqua",
    levels: [
      { name: "Основы", completed: true },
      { name: "Архитектура", completed: false },
    ],
  },
];

//
//

afterEach(cleanup);

describe("<ChartView />", () => {
  it("reports the track when a level is selected", () => {
    const onLevelSelect = vi.fn<(trackId: string, level: number) => void>();

    render(<ChartView tracks={tracks} onLevelSelect={onLevelSelect} />);

    fireEvent.click(screen.getByRole("button", { name: /Фронтенд: level 2/ }));

    expect(onLevelSelect).toHaveBeenCalledOnce();
    expect(onLevelSelect).toHaveBeenCalledWith("frontend", 2);
    expect(screen.getByText("FE")).toBeVisible();
  });

  it("supports selecting a level from the keyboard", () => {
    const onLevelSelect = vi.fn<(trackId: string, level: number) => void>();

    render(<ChartView tracks={tracks} onLevelSelect={onLevelSelect} />);

    fireEvent.keyDown(screen.getByRole("button", { name: /Фронтенд: level 1/ }), {
      key: "Enter",
    });

    expect(onLevelSelect).toHaveBeenCalledWith("frontend", 1);
  });
});
