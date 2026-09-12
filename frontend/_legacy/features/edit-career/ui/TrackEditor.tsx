import { useId } from "react";

import { Trash2 } from "lucide-react";

import type { CareerTrack } from "@/entities/career";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";

import { LevelEditor } from "./LevelEditor";

interface TrackEditorProps {
  track: CareerTrack;
  canRemove: boolean;
  onChange: (track: CareerTrack) => void;
  onRemove: () => void;
  onRemoveLevel: (index: number) => void;
  onConfirm: (message: string, action: () => void) => void;
}

export function TrackEditor({
  track,
  canRemove,
  onChange,
  onRemove,
  onRemoveLevel,
  onConfirm,
}: TrackEditorProps) {
  const fieldId = useId();
  return (
    <div className="grid min-w-0 gap-5">
      <div className="mb-5 flex items-center justify-between gap-[18px]">
        <h3 className="text-[15px] font-[550]">Трек</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive"
          disabled={!canRemove}
          onClick={() => onConfirm("Удалить трек и его прогресс?", onRemove)}
        >
          <Trash2 aria-hidden="true" /> Удалить трек
        </Button>
      </div>
      <div className="grid min-w-0 gap-5">
        <label className="flex min-w-0 flex-col gap-2 text-[12px]" htmlFor={`${fieldId}-name`}>
          <span className="text-foreground">Название трека</span>
          <Input
            id={`${fieldId}-name`}
            required
            maxLength={120}
            value={track.name}
            onChange={(event) => onChange({ ...track, name: event.target.value })}
          />
        </label>
        <label
          className="flex min-w-0 flex-col gap-2 text-[12px]"
          htmlFor={`${fieldId}-description`}
        >
          <span className="text-foreground">Описание трека</span>
          <Textarea
            id={`${fieldId}-description`}
            rows={3}
            maxLength={4000}
            value={track.description}
            onChange={(event) => onChange({ ...track, description: event.target.value })}
          />
        </label>
      </div>
      <LevelEditor
        levels={track.levels}
        onChange={(levels) => onChange({ ...track, levels })}
        onRemoveLevel={onRemoveLevel}
        onConfirm={onConfirm}
      />
    </div>
  );
}
