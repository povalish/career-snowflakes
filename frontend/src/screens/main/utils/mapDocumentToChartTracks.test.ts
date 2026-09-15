import { describe, expect, it } from "vitest";

import type { Document } from "@/entities/document";

import { mapDocumentToChartTracks } from "./mapDocumentToChartTracks";

//
//

describe("mapDocumentToChartTracks", () => {
  it("maps document tracks to chart tracks", () => {
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

    expect(mapDocumentToChartTracks(document)).toEqual([
      {
        id: "frontend",
        code: "FE",
        groupId: "technology",
        name: "Frontend",
        color: "aqua",
        levels: [
          { name: "Introduction", completed: true },
          { name: "Practice", completed: false },
        ],
      },
    ]);
  });
});
