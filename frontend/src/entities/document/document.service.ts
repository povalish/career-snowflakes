import * as CareerService from "@bindings/career-snowflakes/careerservice.js";
import { makeAutoObservable, runInAction } from "mobx";

import type { Document } from "./document.types";
import { fromServiceDocument, getErrorMessage } from "./document.utils";

//
//

export class DocumentBridge {
  public document: Document | null = null;
  public pending = false;
  public error: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public async load(): Promise<Document> {
    return this.execute(CareerService.Load, fromServiceDocument, (document) => {
      this.document = document;
    });
  }

  public async save(document: Document): Promise<Document> {
    return this.execute(
      () => CareerService.Save(document),
      fromServiceDocument,
      (saved) => {
        this.document = saved;
      },
    );
  }

  public async import(): Promise<Document | null> {
    return this.execute(
      CareerService.Import,
      (document) => (document ? fromServiceDocument(document) : null),
      (document) => {
        if (document) this.document = document;
      },
    );
  }

  public async export(): Promise<boolean> {
    return this.execute(CareerService.Export, (exported) => exported);
  }

  private async execute<TServiceResult, TResult>(
    operation: () => PromiseLike<TServiceResult>,
    transform: (result: TServiceResult) => TResult,
    commit?: (result: TResult) => void,
  ): Promise<TResult> {
    this.pending = true;
    this.error = null;

    try {
      const result = transform(await operation());

      runInAction(() => commit?.(result));
      return result;
    } catch (cause) {
      runInAction(() => {
        this.error = getErrorMessage(cause);
      });
      throw cause;
    } finally {
      runInAction(() => {
        this.pending = false;
      });
    }
  }
}

export const documentService = new DocumentBridge();
