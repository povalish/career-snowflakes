import { describe, expect, it } from "vitest";

import { polarPoint, sectorPath } from "./geometry";

describe("snowflake geometry", () => {
  it.each([
    [0, 300, 200],
    [90, 400, 300],
    [180, 300, 400],
    [270, 200, 300],
    [360, 300, 200],
  ])("places angle %i clockwise from the top", (angle, x, y) => {
    const point = polarPoint(100, angle);
    expect(point.x).toBeCloseTo(x);
    expect(point.y).toBeCloseTo(y);
  });

  it("draws a closed quarter ring with opposite inner and outer arc directions", () => {
    const path = sectorPath(50, 100, 0, 90);

    expect(path).toBe("M 300 200 A 100 100 0 0 1 400 300 L 350 300 A 50 50 0 0 0 300 250 Z");
  });

  it("uses the large arc for a track occupying most of the circle", () => {
    const path = sectorPath(64, 236, 1, 359);

    expect(path).toContain("A 236 236 0 1 1");
    expect(path).toContain("A 64 64 0 1 0");
    expect(path).not.toMatch(/NaN|Infinity/);
  });
});
