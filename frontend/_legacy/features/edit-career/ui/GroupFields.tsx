import { useId } from "react";

import { Trash2 } from "lucide-react";

import type { CareerGroup } from "@/entities/career";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { GROUP_COLORS } from "../model/draft";

interface GroupFieldsProps {
  group: CareerGroup;
  canRemove: boolean;
  onChange: (group: CareerGroup) => void;
  onRemove: () => void;
}

const colorNames = {
  aqua: "Бирюзовый",
  blue: "Синий",
  purple: "Фиолетовый",
  red: "Красный",
  green: "Зелёный",
  yellow: "Жёлтый",
  orange: "Оранжевый",
};

export function GroupFields({ group, canRemove, onChange, onRemove }: GroupFieldsProps) {
  const fieldId = useId();

  return (
    <div className="mb-[26px] flex items-end gap-5 [@media(max-width:800px)]:flex-wrap">
      <label className="flex min-w-0 flex-1 flex-col gap-2 text-[12px]" htmlFor={`${fieldId}-name`}>
        <span className="text-foreground">Название направления</span>
        <Input
          id={`${fieldId}-name`}
          required
          maxLength={120}
          value={group.name}
          onChange={(event) => onChange({ ...group, name: event.target.value })}
        />
      </label>
      <label
        className="flex min-w-0 flex-1 flex-col gap-2 text-[12px]"
        htmlFor={`${fieldId}-color`}
      >
        <span className="text-foreground">Цвет направления</span>
        <select
          className="h-9 rounded-[6px] border border-input bg-background px-2.5 py-0 focus-visible:outline-ring/50"
          id={`${fieldId}-color`}
          value={group.color}
          onChange={(event) => onChange({ ...group, color: event.target.value })}
        >
          {GROUP_COLORS.map((color) => (
            <option key={color} value={color}>
              {colorNames[color]}
            </option>
          ))}
        </select>
      </label>
      <Button
        type="button"
        variant="ghost"
        className="text-destructive"
        disabled={!canRemove}
        onClick={onRemove}
      >
        <Trash2 aria-hidden="true" /> Удалить направление
      </Button>
    </div>
  );
}
