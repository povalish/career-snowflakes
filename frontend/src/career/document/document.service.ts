import { makeAutoObservable, observableRef, runInAction } from "mobx";

import { DocumentBridgeService } from "./document-bridge.service";
import type { Document } from "./document.types";

export class DocumentService {
  document: Document | null = null;
  loadError: string | null = null;

  constructor() {
    makeAutoObservable(this, { document: observableRef });
  }

  async load(): Promise<void> {
    this.loadError = null;
    try {
      this.commit(await DocumentBridgeService.load());
    } catch (cause) {
      runInAction(() => {
        this.loadError = cause instanceof Error ? cause.message : String(cause);
      });
    }
  }

  async save(candidate: Document): Promise<Document> {
    const saved = await DocumentBridgeService.save(candidate);
    this.commit(saved);
    return saved;
  }

  async import(): Promise<Document | null> {
    const imported = await DocumentBridgeService.import();
    if (imported) this.commit(imported);
    return imported;
  }

  export(): Promise<boolean> {
    return DocumentBridgeService.export();
  }

  private commit(document: Document): void {
    this.document = document;
    this.loadError = null;
  }
}

export const documentService = new DocumentService();
