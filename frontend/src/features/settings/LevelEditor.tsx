import { Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import type { CareerLevel } from "../career/types";
import { createLevel, MAX_LEVELS } from "./draft";

interface LevelEditorProps {
  levels: CareerLevel[];
  onChange: (levels: CareerLevel[]) => void;
  onRemoveLevel: (index: number) => void;
  onConfirm: (message: string, action: () => void) => void;
}

export function LevelEditor({ levels, onChange, onRemoveLevel, onConfirm }: LevelEditorProps) {
  const fieldId = useId();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeIndex = Math.min(selectedIndex, levels.length - 1);
  const level = levels[activeIndex];

  if (!level) return null;

  function updateLevel(change: Partial<CareerLevel>) {
    onChange(levels.map((item, index) => (index === activeIndex ? { ...item, ...change } : item)));
  }

  function addLevel() {
    onChange([...levels, createLevel(levels.length + 1)]);
    setSelectedIndex(levels.length);
  }

  function removeLevel() {
    onConfirm(
      "Удалить этот уровень? Если он достигнут, число пройденных этапов уменьшится на один.",
      () => {
        onRemoveLevel(activeIndex);
        setSelectedIndex(Math.max(0, activeIndex - 1));
      },
    );
  }

  return (
    <section className="settings-levels" aria-label="Уровни трека">
      <div className="settings-section-heading">
        <div>
          <h3>Уровни развития</h3>
          <p className="muted">От первого шага к уверенному владению навыком.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addLevel}
          disabled={levels.length >= MAX_LEVELS}
        >
          <Plus aria-hidden="true" /> Добавить уровень
        </Button>
      </div>
      <div className="settings-level-tabs" aria-label="Выбрать уровень">
        {levels.map((_, index) => (
          <Button
            key={index}
            type="button"
            variant={index === activeIndex ? "default" : "outline"}
            aria-pressed={index === activeIndex}
            aria-label={`Уровень ${index + 1}`}
            onClick={() => setSelectedIndex(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
      <div className="settings-fields">
        <label className="field" htmlFor={`${fieldId}-name`}>
          <span>Название уровня</span>
          <Input
            id={`${fieldId}-name`}
            required
            maxLength={120}
            value={level.name}
            onChange={(event) => updateLevel({ name: event.target.value })}
          />
        </label>
        <label className="field" htmlFor={`${fieldId}-description`}>
          <span>Описание уровня</span>
          <Textarea
            id={`${fieldId}-description`}
            rows={3}
            maxLength={4000}
            value={level.description}
            onChange={(event) => updateLevel({ description: event.target.value })}
          />
        </label>
        <label className="field" htmlFor={`${fieldId}-examples`}>
          <span>Примеры поведения и задач</span>
          <Textarea
            rows={4}
            id={`${fieldId}-examples`}
            maxLength={8000}
            aria-describedby={`${fieldId}-examples-hint`}
            placeholder="Каждый пример с новой строки"
            value={level.examples.join("\n")}
            onChange={(event) =>
              updateLevel({ examples: event.target.value ? event.target.value.split("\n") : [] })
            }
          />
        </label>
        <p id={`${fieldId}-examples-hint`} className="field-hint">
          Один пример на строку. До 20 примеров, каждый до 1000 символов.
        </p>
        <Button
          type="button"
          variant="ghost"
          className="destructive-text"
          onClick={removeLevel}
          disabled={levels.length === 1}
        >
          <Trash2 aria-hidden="true" /> Удалить уровень
        </Button>
      </div>
    </section>
  );
}
