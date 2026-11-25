import { describe, expect, it } from "vitest";

import { createDocumentMock } from "@/career/document/document.mock";

import { withTrackProgress } from "./with-track-progress";

describe("withTrackProgress", () => {
  it("changes only the specified track in the candidate document", () => {
    const saved = createDocumentMock();
    const candidate = withTrackProgress(saved, "backend", 4);

    expect(candidate.progress).toEqual({ ...saved.progress, backend: 4 });
    expect(saved.progress.backend).toBe(2);
  });

  it("rejects a level outside the selected track", () => {
    expect(() => withTrackProgress(createDocumentMock(), "backend", 6)).toThrow(RangeError);
  });
});
