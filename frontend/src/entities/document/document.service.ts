import { makeAutoObservable } from "mobx";

import { DocumentBridgeService } from "./document-bridge.service";
import { createDocumentMock } from "./document.mock";
import type { Document } from "./document.types";

//
//

export class DocumentService {
  public document: Document;
  public selectedTrackId: string | null = null;
  public selectedLevel: number | null = null;

  constructor(document: Document) {
    this.document = document;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  // Document methods
  //

  public selectTrack(trackId: string): void {
    this.selectedTrackId = trackId;
    this.selectedLevel = null;
  }

  public selectLevel(level: number): void {
    this.selectedLevel = level;
  }

  public async setTrackProgress(trackId: string, level: number): Promise<Document> {
    const track = this.document.schema.groups
      .flatMap((group) => group.tracks)
      .find((item) => item.id === trackId);

    if (!track) throw new Error(`Track not found: ${trackId}`);
    if (!Number.isInteger(level) || level < 0 || level > track.levels.length) {
      throw new RangeError(`Invalid level ${level} for track ${trackId}`);
    }

    const document = await DocumentBridgeService.save({
      ...this.document,
      progress: { ...this.document.progress, [trackId]: level },
    });

    this.setDocument(document, false);
    return document;
  }

  // Bridge methods
  //

  public async load(): Promise<Document> {
    const document = await DocumentBridgeService.load();

    this.setDocument(document);
    return document;
  }

  public async save(candidate: Document): Promise<Document> {
    const document = await DocumentBridgeService.save(candidate);

    this.setDocument(document);
    return document;
  }

  public async import(): Promise<Document | null> {
    const document = await DocumentBridgeService.import();

    if (document) this.setDocument(document);
    return document;
  }

  public async export(): Promise<boolean> {
    return DocumentBridgeService.export();
  }

  // Utilities methods
  //

  private setDocument(document: Document, resetSelection = true): void {
    this.document = document;
    if (resetSelection) {
      this.selectedTrackId = null;
      this.selectedLevel = null;
    }
  }
}

export const documentService = new DocumentService(createDocumentMock());
