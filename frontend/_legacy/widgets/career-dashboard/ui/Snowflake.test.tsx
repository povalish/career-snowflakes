import { useState } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Selection } from "@/entities/career";
import { createCareerDocument } from "@/entities/career/testing";

import { Snowflake } from "./Snowflake";

function InteractiveSnowflake() {
  const [selection, setSelection] = useState<Selection>({ trackId: "web", level: 2 });
  return (
    <Snowflake
      document={createCareerDocument()}
      selection={selection}
      onSelect={setSelection}
      onActivate={setSelection}
    />
  );
}

describe("Snowflake", () => {
  it("renders each stage as an accessible button and distinguishes completion from selection", () => {
    render(<InteractiveSnowflake />);

    expect(screen.getAllByRole("button")).toHaveLength(6);
    expect(
      screen.getByRole("button", { name: "Веб, уровень 1: Основы, достигнут" }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Веб, уровень 2: Практика" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.getAllByRole("button").filter((button) => button.getAttribute("tabindex") === "0"),
    ).toHaveLength(1);
  });

  it("reports the activated stage without mutating progress", () => {
    const document = createCareerDocument();
    const onSelect = vi.fn<(selection: Selection) => void>();
    const onActivate = vi.fn<(selection: Selection) => void>();
    render(
      <Snowflake
        document={document}
        selection={{ trackId: "web", level: 2 }}
        onSelect={onSelect}
        onActivate={onActivate}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Менторство, уровень 2: Развитие" }));

    expect(onActivate).toHaveBeenCalledWith({ trackId: "mentoring", level: 2 });
    expect(onSelect).not.toHaveBeenCalled();
    expect(document.progress).toEqual({ web: 1, servers: 0, mentoring: 0 });
  });

  it("activates with Enter and keeps arrow keys as navigation", () => {
    const onSelect = vi.fn<(selection: Selection) => void>();
    const onActivate = vi.fn<(selection: Selection) => void>();
    render(
      <Snowflake
        document={createCareerDocument()}
        selection={{ trackId: "web", level: 2 }}
        onSelect={onSelect}
        onActivate={onActivate}
      />,
    );
    const stage = screen.getByRole("button", { name: "Веб, уровень 2: Практика" });

    fireEvent.keyDown(stage, { key: "Enter" });
    expect(onActivate).toHaveBeenCalledWith({ trackId: "web", level: 2 });
    expect(onSelect).not.toHaveBeenCalled();

    fireEvent.keyDown(stage, { key: "ArrowUp" });
    expect(onSelect).toHaveBeenCalledWith({ trackId: "web", level: 3 });
    expect(onActivate).toHaveBeenCalledOnce();
  });

  it("navigates across tracks, clamps shorter tracks and wraps at either end", () => {
    render(<InteractiveSnowflake />);
    fireEvent.keyDown(screen.getByRole("button", { name: "Веб, уровень 2: Практика" }), {
      key: "ArrowRight",
    });
    const servers = screen.getByRole("button", { name: "Серверы, уровень 1: Основы API" });
    expect(servers).toHaveAttribute("aria-pressed", "true");
    expect(servers).toHaveFocus();

    fireEvent.keyDown(servers, { key: "ArrowRight" });
    const mentoring = screen.getByRole("button", { name: "Менторство, уровень 1: Поддержка" });
    expect(mentoring).toHaveFocus();
    fireEvent.keyDown(mentoring, { key: "ArrowRight" });
    const web = screen.getByRole("button", { name: "Веб, уровень 1: Основы, достигнут" });
    expect(web).toHaveFocus();
    fireEvent.keyDown(web, { key: "ArrowLeft" });
    expect(mentoring).toHaveFocus();
  });

  it("navigates levels with arrows, Home and End while preserving one tab stop", () => {
    render(<InteractiveSnowflake />);
    fireEvent.keyDown(screen.getByRole("button", { name: "Веб, уровень 2: Практика" }), {
      key: "ArrowUp",
    });
    const last = screen.getByRole("button", { name: "Веб, уровень 3: Архитектура" });
    expect(last).toHaveFocus();
    fireEvent.keyDown(last, { key: "ArrowUp" });
    expect(last).toHaveAttribute("aria-pressed", "true");
    fireEvent.keyDown(last, { key: "Home" });
    const first = screen.getByRole("button", { name: "Веб, уровень 1: Основы, достигнут" });
    expect(first).toHaveFocus();
    fireEvent.keyDown(first, { key: "ArrowDown" });
    expect(first).toHaveAttribute("aria-pressed", "true");
    fireEvent.keyDown(first, { key: "End" });
    expect(last).toHaveFocus();
    expect(
      screen.getAllByRole("button").filter((button) => button.getAttribute("tabindex") === "0"),
    ).toHaveLength(1);
  });
});
