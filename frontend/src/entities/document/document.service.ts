import { makeAutoObservable } from "mobx";

import { DocumentBridgeService } from "./document-bridge.service";
import { createDocumentMock } from "./document.mock";
import type { Document } from "./document.types";

//
//

export class DocumentService {
  public document: Document;
  public selectedTrackId: string | null = null;

  constructor(document: Document) {
    this.document = document;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  // Document methods
  //

  public selectTrack(trackId: string): void {
    this.selectedTrackId = trackId;
  }

  // Bridge methods
  //

  public async load(): Promise<Document> {
    const document = await DocumentBridgeService.load();

    this.setDocument(document);
    return document;
  }

  public async save(): Promise<Document> {
    const document = await DocumentBridgeService.save(this.document);

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

  private setDocument(document: Document): void {
    this.document = document;
    this.selectedTrackId = null;
  }
}

export const documentService = new DocumentService(createDocumentMock());
