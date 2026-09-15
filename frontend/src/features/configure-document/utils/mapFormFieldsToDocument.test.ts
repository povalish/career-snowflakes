import { describe, expect, it } from "vitest";

import type { Document } from "@/entities/document";

import type { DocumentFF } from "../schemas/document";
import { mapFormFieldsToDocument } from "./mapFormFieldsToDocument";

//
//

describe("UTILS: mapFormFieldsToDocument()", () => {
  it("preserves document metadata and derives progress from the reached prefix", () => {
    const source: Document = {
      version: 2,
      profile: { name: "Alex", role: "Engineer" },
      schema: { name: "Old schema", groups: [] },
      progress: { deleted: 4 },
    };
    const formFields: DocumentFF = {
      name: "New schema",
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
              description: "Track description",
              resources: "Resources",
              levels: [
                {
                  name: "First",
                  description: "First level",
                  examplesText: " First example \n\nSecond example ",
                  reached: true,
                },
                {
                  name: "Second",
                  description: "Second level",
                  examplesText: "",
                  reached: false,
                },
                {
                  name: "Third",
                  description: "Third level",
                  examplesText: "Ignored for progress",
                  reached: true,
                },
              ],
            },
          ],
        },
      ],
    };

    expect(mapFormFieldsToDocument(formFields, source)).toEqual({
      version: 2,
      profile: { name: "Alex", role: "Engineer" },
      schema: {
        name: "New schema",
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
                description: "Track description",
                resources: "Resources",
                levels: [
                  {
                    name: "First",
                    description: "First level",
                    examples: ["First example", "Second example"],
                  },
                  { name: "Second", description: "Second level", examples: [] },
                  {
                    name: "Third",
                    description: "Third level",
                    examples: ["Ignored for progress"],
                  },
                ],
              },
            ],
          },
        ],
      },
      progress: { frontend: 1 },
    });
  });
});
