import { describe, expect, it } from "vitest";

import { documentSchema, type DocumentFF } from "./document";

//
//

const createLevel = (): DocumentFF["groups"][number]["tracks"][number]["levels"][number] => ({
  name: "Introduction",
  description: "Level description",
  examplesText: "First example\nSecond example",
  reached: false,
});

const createTrack = (
  id = "frontend",
  code = "FE",
): DocumentFF["groups"][number]["tracks"][number] => ({
  id,
  code,
  name: "Frontend",
  description: "Track description",
  resources: "[React](https://react.dev)",
  levels: [createLevel()],
});

const createDocument = (): DocumentFF => ({
  name: "Engineering",
  groups: [
    {
      id: "technology",
      name: "Technology",
      color: "aqua",
      tracks: [createTrack()],
    },
  ],
});

//
//

describe("ZOD: documentSchema", () => {
  it("accepts valid document form fields", () => {
    expect(documentSchema.safeParse(createDocument()).success).toBe(true);
  });

  it("validates nested form fields", () => {
    const document = createDocument();
    const [group] = document.groups;
    const [track] = group?.tracks ?? [];
    const [level] = track?.levels ?? [];

    if (!track || !level) throw new Error("Expected the test document to contain a level");

    document.name = " ";
    track.code = "frontend";
    level.examplesText = Array.from({ length: 21 }, (_, index) => `Example ${index}`).join("\n");

    const result = documentSchema.safeParse(document);

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.error.issues.map(({ path }) => path)).toEqual(
      expect.arrayContaining([
        ["name"],
        ["groups", 0, "tracks", 0, "code"],
        ["groups", 0, "tracks", 0, "levels", 0, "examplesText"],
      ]),
    );
  });

  it("rejects duplicate IDs and track codes across groups", () => {
    const document = createDocument();
    document.groups.push({
      id: "frontend",
      name: "Craft",
      color: "purple",
      tracks: [createTrack("quality", "FE")],
    });

    const result = documentSchema.safeParse(document);

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ["groups", 1, "id"] }),
        expect.objectContaining({ path: ["groups", 1, "tracks", 0, "code"] }),
      ]),
    );
  });

  it("allows no more than 32 tracks across all groups", () => {
    const document = createDocument();
    document.groups = [
      {
        id: "first",
        name: "First",
        color: "red",
        tracks: Array.from({ length: 17 }, (_, index) =>
          createTrack(`first-${index}`, `A${String.fromCharCode(65 + index)}`),
        ),
      },
      {
        id: "second",
        name: "Second",
        color: "blue",
        tracks: Array.from({ length: 16 }, (_, index) =>
          createTrack(`second-${index}`, `B${String.fromCharCode(65 + index)}`),
        ),
      },
    ];

    const result = documentSchema.safeParse(document);

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.error.issues).toContainEqual(
      expect.objectContaining({
        message: "Use no more than 32 tracks in total",
        path: ["groups"],
      }),
    );
  });
});
