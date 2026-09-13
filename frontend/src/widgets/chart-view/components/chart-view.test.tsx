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
    const onTrackSelect = vi.fn<(trackId: string) => void>();

    render(<ChartView tracks={tracks} onTrackSelect={onTrackSelect} />);

    fireEvent.click(screen.getByRole("button", { name: /Фронтенд: уровень 2/ }));

    expect(onTrackSelect).toHaveBeenCalledOnce();
    expect(onTrackSelect).toHaveBeenCalledWith("frontend");
  });

  it("supports selecting a level from the keyboard", () => {
    const onTrackSelect = vi.fn<(trackId: string) => void>();

    render(<ChartView tracks={tracks} onTrackSelect={onTrackSelect} />);

    fireEvent.keyDown(screen.getByRole("button", { name: /Фронтенд: уровень 1/ }), {
      key: "Enter",
    });

    expect(onTrackSelect).toHaveBeenCalledWith("frontend");
  });
});
