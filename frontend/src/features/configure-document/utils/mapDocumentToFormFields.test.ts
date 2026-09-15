import { describe, expect, it } from "vitest";

import type { Document } from "@/entities/document";

import { mapDocumentToFormFields } from "./mapDocumentToFormFields";

//
//

describe("UTILS: mapDocumentToFormFields()", () => {
  it("maps editable document data and marks reached levels", () => {
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
                resources: "[React](https://react.dev)",
                levels: [
                  {
                    name: "Introduction",
                    description: "Learn the basics.",
                    examples: ["Build a component", "Check accessibility"],
                  },
                  {
                    name: "Practice",
                    description: "Apply the skill.",
                    examples: [],
                  },
                  {
                    name: "Independence",
                    description: "Work independently.",
                    examples: ["Design a user flow"],
                  },
                ],
              },
              {
                id: "backend",
                code: "BE",
                name: "Backend",
                description: "Building services.",
                resources: "",
                levels: [
                  {
                    name: "Introduction",
                    description: "Learn the basics.",
                    examples: [],
                  },
                ],
              },
            ],
          },
        ],
      },
      progress: { frontend: 2 },
    };
    const originalDocument = structuredClone(document);

    expect(mapDocumentToFormFields(document)).toEqual({
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
              resources: "[React](https://react.dev)",
              levels: [
                {
                  name: "Introduction",
                  description: "Learn the basics.",
                  examplesText: "Build a component\nCheck accessibility",
                  reached: true,
                },
                {
                  name: "Practice",
                  description: "Apply the skill.",
                  examplesText: "",
                  reached: true,
                },
                {
                  name: "Independence",
                  description: "Work independently.",
                  examplesText: "Design a user flow",
                  reached: false,
                },
              ],
            },
            {
              id: "backend",
              code: "BE",
              name: "Backend",
              description: "Building services.",
              resources: "",
              levels: [
                {
                  name: "Introduction",
                  description: "Learn the basics.",
                  examplesText: "",
                  reached: false,
                },
              ],
            },
          ],
        },
      ],
    });
    expect(document).toEqual(originalDocument);
  });
});
