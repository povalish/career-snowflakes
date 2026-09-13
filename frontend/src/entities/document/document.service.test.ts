import { describe, expect, it, vi } from "vitest";

import { createDocumentMock } from "./document.mock";
import { DocumentService } from "./document.service";
import type { Document } from "./document.types";

//
//

const bridgeMocks = vi.hoisted(() => ({
  save: vi.fn<(document: Document) => Promise<Document>>(),
}));

vi.mock("./document-bridge.service", () => ({
  DocumentBridgeService: { save: bridgeMocks.save },
}));

describe("DocumentService", () => {
  it("selects a level", () => {
    const service = new DocumentService(createDocumentMock());

    service.selectLevel(3);

    expect(service.selectedLevel).toBe(3);
  });

  it("clears the selected level when another track is selected", () => {
    const service = new DocumentService(createDocumentMock());
    service.selectLevel(3);

    service.selectTrack("backend");

    expect(service.selectedTrackId).toBe("backend");
    expect(service.selectedLevel).toBeNull();
  });

  it("persists a track progress update without clearing the selection", async () => {
    const document = createDocumentMock();
    const service = new DocumentService(document);
    bridgeMocks.save.mockImplementationOnce(async (nextDocument) => nextDocument);
    service.selectTrack("backend");
    service.selectLevel(4);

    await service.setTrackProgress("backend", 4);

    expect(bridgeMocks.save).toHaveBeenCalledWith({
      ...document,
      progress: { ...document.progress, backend: 4 },
    });
    expect(service.document.progress.backend).toBe(4);
    expect(service.selectedTrackId).toBe("backend");
    expect(service.selectedLevel).toBe(4);
  });

  it("rejects a level outside the track range", async () => {
    const service = new DocumentService(createDocumentMock());

    await expect(service.setTrackProgress("backend", 6)).rejects.toThrow(RangeError);
    expect(bridgeMocks.save).not.toHaveBeenCalled();
  });
});
