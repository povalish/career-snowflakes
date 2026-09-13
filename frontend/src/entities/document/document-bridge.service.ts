import * as CareerService from "@bindings/career-snowflakes/careerservice.js";

import type { Document } from "./document.types";
import { fromServiceDocument } from "./document.utils";

//
//

export class DocumentBridgeService {
  private constructor() {}

  public static async load(): Promise<Document> {
    return fromServiceDocument(await CareerService.Load());
  }

  public static async save(document: Document): Promise<Document> {
    return fromServiceDocument(await CareerService.Save(document));
  }

  public static async import(): Promise<Document | null> {
    const document = await CareerService.Import();

    return document ? fromServiceDocument(document) : null;
  }

  public static async export(): Promise<boolean> {
    return CareerService.Export();
  }
}
