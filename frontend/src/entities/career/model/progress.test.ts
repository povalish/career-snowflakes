import { describe, expect, it } from "vitest";

import { createCareerDocument } from "../testing/fixture";
import { getSelection, getTracks, setTrackProgress } from "./progress";

describe("career progress", () => {
  it("preserves group and track order with continuous chart indices", () => {
    expect(
      getTracks(createCareerDocument()).map(({ group, track, index }) => [
        group.id,
        track.id,
        index,
      ]),
    ).toEqual([
      ["engineering", "web", 0],
      ["engineering", "servers", 1],
      ["people", "mentoring", 2],
    ]);
  });

  it("returns no selection for an empty schema", () => {
    const document = createCareerDocument();
    document.schema.groups = [];

    expect(getSelection(document, null)).toBeNull();
  });

  it("returns a new document when track progress changes", () => {
    const document = createCareerDocument();

    const updated = setTrackProgress(document, "web", 2);

    expect(updated).not.toBe(document);
    expect(updated.progress).not.toBe(document.progress);
    expect(updated.progress).toEqual({ web: 2, servers: 0, mentoring: 0 });
    expect(document.progress).toEqual({ web: 1, servers: 0, mentoring: 0 });
  });
});

describe("career selection", () => {
  it("initially selects the next unfinished stage", () => {
    expect(getSelection(createCareerDocument(), null)).toMatchObject({
      track: { id: "web" },
      level: 2,
    });
  });

  it.each([
    [0, 1],
    [9, 3],
    [2, 2],
  ])("clamps selected level %i to %i", (requested, expected) => {
    expect(
      getSelection(createCareerDocument(), { trackId: "web", level: requested }),
    ).toMatchObject({ track: { id: "web" }, level: expected });
  });

  it("selects a valid track after the selected track disappears on import", () => {
    const document = createCareerDocument();
    document.schema.groups = document.schema.groups.filter((group) => group.id === "people");
    document.progress = { mentoring: 2 };

    expect(getSelection(document, { trackId: "web", level: 3 })).toMatchObject({
      track: { id: "mentoring" },
      level: 2,
    });
  });
});
