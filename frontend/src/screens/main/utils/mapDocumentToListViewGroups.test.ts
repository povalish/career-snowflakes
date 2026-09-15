import { describe, expect, it } from "vitest";

import type { Document } from "@/entities/document";

import { mapDocumentToListViewGroups } from "./mapDocumentToListViewGroups";

//
//

describe("mapDocumentToListViewGroups", () => {
  it("maps document groups to list view groups", () => {
    const document: Document = {
      version: 2,
      profile: { name: "Alex", role: "Software Engineer" },
      schema: {
        name: "Career Matrix",
        groups: [
          {
            id: "technology",
            name: "Technology",
            color: "aqua",
            tracks: [
              {
                id: "frontend",
                code: "FE",
                name: "Frontend",
                description: "Building user interfaces.",
                levels: [
                  { name: "Introduction", description: "Learn the basics.", examples: [] },
                  { name: "Practice", description: "Apply the skill.", examples: [] },
                ],
              },
            ],
          },
        ],
      },
      progress: { frontend: 1 },
    };

    expect(mapDocumentToListViewGroups(document)).toEqual([
      {
        id: "technology",
        name: "Technology",
        color: "aqua",
        tracks: [
          {
            id: "frontend",
            code: "FE",
            name: "Frontend",
            progress: 1,
            levelCount: 2,
          },
        ],
      },
    ]);
  });
});
