import type { CareerDocument } from "./types";

export interface CareerClient {
  load: () => Promise<CareerDocument>;
  save: (document: CareerDocument) => Promise<CareerDocument>;
  importDocument: () => Promise<CareerDocument | null>;
  exportDocument: () => Promise<boolean>;
}

const service = () => import("../../../bindings/career-snowflakes/careerservice");

export const careerClient: CareerClient = {
  // Go's Validate + Normalize guarantee non-null collections at this boundary.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  load: async () => (await (await service()).Load()) as CareerDocument,
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  save: async (document) => (await (await service()).Save(document)) as CareerDocument,
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  importDocument: async () => (await (await service()).Import()) as CareerDocument | null,
  exportDocument: async () => (await service()).Export(),
};
