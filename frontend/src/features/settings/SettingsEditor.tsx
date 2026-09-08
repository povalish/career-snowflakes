import { ArrowLeft, Save } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import type { CareerDocument } from "../career/types";
import { ConfirmChangesDialog, type Confirmation } from "./ConfirmChangesDialog";
import { removeLevel, withSchema } from "./draft";
import { SchemaEditor } from "./SchemaEditor";

interface SettingsEditorProps {
  document: CareerDocument;
  busy: boolean;
  onSave: (document: CareerDocument) => Promise<boolean>;
  onClose: () => void;
}

export function SettingsEditor({ document, busy, onSave, onClose }: SettingsEditorProps) {
  const fieldId = useId();
  const [draft, setDraft] = useState(() => structuredClone(document));
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(document);

  function confirm(message: string, action: () => void) {
    setConfirmation({ message, action });
  }

  function close() {
    if (dirty) confirm("Отменить изменения? Несохранённые правки будут потеряны.", onClose);
    else onClose();
  }

  return (
    <section className="settings-page" aria-label="Настройки матрицы">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void onSave(draft);
        }}
      >
        <header className="settings-header">
          <div>
            <Button type="button" variant="ghost" size="sm" onClick={close} disabled={busy}>
              <ArrowLeft aria-hidden="true" /> К диаграмме
            </Button>
            <h1>Настройки матрицы</h1>
            <p className="muted">Изменения применятся после сохранения.</p>
          </div>
          <Button type="submit" disabled={busy || Boolean(confirmation)}>
            <Save aria-hidden="true" /> {busy ? "Сохранение…" : "Сохранить изменения"}
          </Button>
        </header>
        <fieldset className="settings-content" disabled={busy || Boolean(confirmation)}>
          <section className="settings-profile" aria-label="Профиль и схема">
            <div className="settings-section-heading">
              <h2>Профиль</h2>
            </div>
            <div className="settings-profile-fields">
              <label className="field" htmlFor={`${fieldId}-name`}>
                <span>Ваше имя</span>
                <Input
                  id={`${fieldId}-name`}
                  required
                  maxLength={120}
                  value={draft.profile.name}
                  onChange={(event) =>
                    setDraft({ ...draft, profile: { ...draft.profile, name: event.target.value } })
                  }
                />
              </label>
              <label className="field" htmlFor={`${fieldId}-role`}>
                <span>Роль</span>
                <Input
                  required
                  maxLength={120}
                  value={draft.profile.role}
                  id={`${fieldId}-role`}
                  onChange={(event) =>
                    setDraft({ ...draft, profile: { ...draft.profile, role: event.target.value } })
                  }
                />
              </label>
              <label className="field" htmlFor={`${fieldId}-schema`}>
                <span>Название схемы</span>
                <Input
                  required
                  maxLength={120}
                  value={draft.schema.name}
                  id={`${fieldId}-schema`}
                  onChange={(event) =>
                    setDraft({ ...draft, schema: { ...draft.schema, name: event.target.value } })
                  }
                />
              </label>
            </div>
          </section>
          <SchemaEditor
            schema={draft.schema}
            onChange={(schema) => setDraft(withSchema(draft, schema))}
            onRemoveLevel={(trackId, index) => setDraft(removeLevel(draft, trackId, index))}
            onConfirm={confirm}
          />
        </fieldset>
        <footer className="settings-footer">
          <span className="muted" aria-live="polite">
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
