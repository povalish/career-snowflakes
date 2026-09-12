import { useId, useState } from "react";

import { Plus, Trash2 } from "lucide-react";

import type { CareerLevel } from "@/entities/career";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";

import { createLevel, MAX_LEVELS } from "../model/draft";

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
    <section className="border-t border-border pt-5" aria-label="Уровни трека">
      <div className="mb-5 flex items-center justify-between gap-[18px]">
        <div>
          <h3 className="text-[15px] font-[550]">Уровни развития</h3>
          <p className="text-xs leading-[1.7] text-muted-foreground">
            От первого шага к уверенному владению навыком.
          </p>
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
      <div className="mb-5 flex flex-wrap items-center gap-2" aria-label="Выбрать уровень">
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
      <div className="grid min-w-0 gap-5">
        <label className="flex min-w-0 flex-col gap-2 text-[12px]" htmlFor={`${fieldId}-name`}>
          <span className="text-foreground">Название уровня</span>
          <Input
            id={`${fieldId}-name`}
            required
            maxLength={120}
            value={level.name}
            onChange={(event) => updateLevel({ name: event.target.value })}
          />
        </label>
        <label
          className="flex min-w-0 flex-col gap-2 text-[12px]"
          htmlFor={`${fieldId}-description`}
        >
          <span className="text-foreground">Описание уровня</span>
          <Textarea
            id={`${fieldId}-description`}
            rows={3}
            maxLength={4000}
            value={level.description}
            onChange={(event) => updateLevel({ description: event.target.value })}
          />
        </label>
        <label className="flex min-w-0 flex-col gap-2 text-[12px]" htmlFor={`${fieldId}-examples`}>
          <span className="text-foreground">Примеры поведения и задач</span>
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
        <p
          id={`${fieldId}-examples-hint`}
          className="text-[10px] leading-[1.7] text-muted-foreground"
        >
          Один пример на строку. До 20 примеров, каждый до 1000 символов.
        </p>
        <Button
          type="button"
          variant="ghost"
          className="text-destructive"
          onClick={removeLevel}
          disabled={levels.length === 1}
        >
          <Trash2 aria-hidden="true" /> Удалить уровень
        </Button>
      </div>
    </section>
  );
}
