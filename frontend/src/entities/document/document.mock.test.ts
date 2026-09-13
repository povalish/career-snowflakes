import { describe, expect, it } from "vitest";

import { createDocumentMock } from "./document.mock";

//
//

describe("createDocumentMock", () => {
  it("creates a complete five-level career document", () => {
    const document = createDocumentMock();
    const tracks = document.schema.groups.flatMap((group) => group.tracks);
    const trackIds = new Set(tracks.map((track) => track.id));
    const trackCodes = new Set(tracks.map((track) => track.code));

    expect(document.version).toBe(2);
    expect(document.schema.groups).toHaveLength(4);
    expect(tracks).toHaveLength(16);
    expect(trackCodes.size).toBe(tracks.length);
    expect(tracks.every((track) => /^[A-Z]{2,3}$/.test(track.code))).toBe(true);
    expect(tracks.every((track) => track.levels.length === 5)).toBe(true);
    expect(tracks.every((track) => track.levels.every((level) => level.examples.length > 0))).toBe(
      true,
    );
    expect(Object.keys(document.progress)).toHaveLength(tracks.length);
    expect(Object.keys(document.progress).every((trackId) => trackIds.has(trackId))).toBe(true);
    expect(Object.values(document.progress).every((level) => level >= 0 && level <= 5)).toBe(true);
  });
});
