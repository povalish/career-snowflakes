import { describe, expect, it, vi } from "vitest";

import { createDocumentMock } from "./document.mock";
import { DocumentService } from "./document.service";
import type { Document } from "./document.types";

const bridge = vi.hoisted(() => ({
  load: vi.fn<() => Promise<Document>>(),
  save: vi.fn<(document: Document) => Promise<Document>>(),
}));

vi.mock("./document-bridge.service", () => ({ DocumentBridgeService: bridge }));

describe("DocumentService", () => {
  it("retains the last confirmed document when saving a draft fails", async () => {
    const service = new DocumentService();
    const saved = createDocumentMock();
    bridge.load.mockResolvedValueOnce(saved);
    await service.load();
    bridge.save.mockRejectedValueOnce(new Error("Disk unavailable"));

    await expect(service.save({ ...saved, progress: {} })).rejects.toThrow("Disk unavailable");
    expect(service.document).toBe(saved);
  });
});
