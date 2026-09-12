import { useId, useState } from "react";

import { ArrowLeft, Save } from "lucide-react";

import type { CareerDocument } from "@/entities/career";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { useSettingsDraft } from "../model/use-settings-draft";
import { ConfirmChangesDialog, type Confirmation } from "./ConfirmChangesDialog";
import { SchemaEditor } from "./SchemaEditor";

interface SettingsEditorProps {
  document: CareerDocument;
  busy: boolean;
  onSave: (document: CareerDocument) => Promise<boolean>;
  onClose: () => void;
}

export function SettingsEditor({ document, busy, onSave, onClose }: SettingsEditorProps) {
  const fieldId = useId();
  const { draft, dirty, changeProfile, changeSchemaName, changeSchema, deleteLevel } =
    useSettingsDraft(document);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  function confirm(message: string, action: () => void) {
    setConfirmation({ message, action });
  }

  function close() {
    if (dirty) confirm("Отменить изменения? Несохранённые правки будут потеряны.", onClose);
    else onClose();
  }

  return (
    <section className="py-8" aria-label="Настройки матрицы">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void onSave(draft);
        }}
      >
        <header className="mb-[25px] flex items-center justify-between gap-[18px] [@media(max-width:560px)]:flex-col [@media(max-width:560px)]:items-start">
          <div>
            <Button type="button" variant="ghost" size="sm" onClick={close} disabled={busy}>
              <ArrowLeft aria-hidden="true" /> К диаграмме
            </Button>
            <h1 className="text-[28px] font-[550] tracking-[-0.8px]">Настройки матрицы</h1>
            <p className="text-xs leading-[1.7] text-muted-foreground">
              Изменения применятся после сохранения.
            </p>
          </div>
          <Button type="submit" disabled={busy || Boolean(confirmation)}>
            <Save aria-hidden="true" /> {busy ? "Сохранение…" : "Сохранить изменения"}
          </Button>
        </header>
        <fieldset
          className="grid min-w-0 gap-6 border-0 p-0"
          disabled={busy || Boolean(confirmation)}
        >
          <section
            className="rounded-[12px] border border-border bg-card p-6.5 [@media(max-width:560px)]:p-4.5"
            aria-label="Профиль и схема"
          >
            <div className="mb-5 flex items-center justify-between gap-4.5">
              <h2 className="text-[18px] font-[550]">Профиль</h2>
            </div>
            <div className="grid grid-cols-3 gap-5 [@media(max-width:800px)]:grid-cols-1">
              <label
                className="flex min-w-0 flex-col gap-2 text-[12px]"
                htmlFor={`${fieldId}-name`}
              >
                <span className="text-foreground">Ваше имя</span>
                <Input
                  id={`${fieldId}-name`}
                  required
                  maxLength={120}
                  pattern=".*\S.*"
                  value={draft.profile.name}
                  onChange={(event) =>
                    changeProfile({ ...draft.profile, name: event.target.value })
                  }
                />
              </label>
              <label
                className="flex min-w-0 flex-col gap-2 text-[12px]"
                htmlFor={`${fieldId}-role`}
              >
                <span className="text-foreground">Роль</span>
                <Input
                  id={`${fieldId}-role`}
                  required
                  maxLength={120}
                  pattern=".*\S.*"
                  value={draft.profile.role}
                  onChange={(event) =>
                    changeProfile({ ...draft.profile, role: event.target.value })
                  }
                />
              </label>
              <label
                className="flex min-w-0 flex-col gap-2 text-[12px]"
                htmlFor={`${fieldId}-schema`}
              >
                <span className="text-foreground">Название схемы</span>
                <Input
                  id={`${fieldId}-schema`}
                  required
                  maxLength={120}
                  pattern=".*\S.*"
                  value={draft.schema.name}
                  onChange={(event) => changeSchemaName(event.target.value)}
                />
              </label>
            </div>
          </section>
          <SchemaEditor
            schema={draft.schema}
            onChange={changeSchema}
            onRemoveLevel={deleteLevel}
            onConfirm={confirm}
          />
        </fieldset>
        <footer className="sticky bottom-0 mt-[22px] flex items-center justify-between gap-[18px] border-t border-border bg-background py-[18px] [@media(max-width:560px)]:flex-col [@media(max-width:560px)]:items-start">
          <span className="text-xs leading-[1.7] text-muted-foreground" aria-live="polite">
            {dirty ? "Есть несохранённые изменения" : "Все изменения сохранены"}
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={close}
            disabled={busy || Boolean(confirmation)}
          >
            Отмена
          </Button>
        </footer>
      </form>
      <ConfirmChangesDialog confirmation={confirmation} onDismiss={() => setConfirmation(null)} />
    </section>
  );
}
