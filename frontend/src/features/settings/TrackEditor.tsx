import { Trash2 } from "lucide-react";
import { useId } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import type { CareerTrack } from "../career/types";
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
    <div className="settings-track-editor">
      <div className="settings-section-heading">
        <h3>Трек</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="destructive-text"
          disabled={!canRemove}
          onClick={() => onConfirm("Удалить трек и его прогресс?", onRemove)}
        >
          <Trash2 aria-hidden="true" /> Удалить трек
        </Button>
      </div>
      <div className="settings-fields">
        <label className="field" htmlFor={`${fieldId}-name`}>
          <span>Название трека</span>
          <Input
            id={`${fieldId}-name`}
            required
            maxLength={120}
            value={track.name}
            onChange={(event) => onChange({ ...track, name: event.target.value })}
          />
        </label>
        <label className="field" htmlFor={`${fieldId}-description`}>
          <span>Описание трека</span>
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
