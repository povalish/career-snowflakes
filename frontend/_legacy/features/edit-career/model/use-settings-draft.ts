import { useState } from "react";

import type { CareerDocument } from "@/entities/career";

import { removeLevel, withSchema } from "./draft";

export function useSettingsDraft(document: CareerDocument) {
  const [draft, setDraft] = useState(() => structuredClone(document));
  const dirty = JSON.stringify(draft) !== JSON.stringify(document);

  function changeProfile(profile: CareerDocument["profile"]) {
    setDraft((current) => ({ ...current, profile }));
  }

  function changeSchemaName(name: string) {
    setDraft((current) => ({
      ...current,
      schema: { ...current.schema, name },
    }));
  }

  function changeSchema(schema: CareerDocument["schema"]) {
    setDraft((current) => withSchema(current, schema));
  }

  function deleteLevel(trackId: string, index: number) {
    setDraft((current) => removeLevel(current, trackId, index));
  }

  return {
    draft,
    dirty,
    changeProfile,
    changeSchemaName,
    changeSchema,
    deleteLevel,
  };
}
