import { Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import type { CareerDocument, CareerGroup } from "../career/types";
import { createGroup, createTrack, GROUP_COLORS, MAX_GROUPS, MAX_TRACKS } from "./draft";
import { TrackEditor } from "./TrackEditor";

interface SchemaEditorProps {
  schema: CareerDocument["schema"];
  onChange: (schema: CareerDocument["schema"]) => void;
  onRemoveLevel: (trackId: string, index: number) => void;
  onConfirm: (message: string, action: () => void) => void;
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

export function SchemaEditor({ schema, onChange, onRemoveLevel, onConfirm }: SchemaEditorProps) {
  const fieldId = useId();
  const [groupId, setGroupId] = useState(schema.groups[0]?.id ?? "");
  const [trackId, setTrackId] = useState("");
  const group = schema.groups.find((item) => item.id === groupId) ?? schema.groups[0];
  const track = group?.tracks.find((item) => item.id === trackId) ?? group?.tracks[0];
  const trackCount = schema.groups.reduce((count, item) => count + item.tracks.length, 0);

  if (!group || !track) return null;

  function updateGroup(nextGroup: CareerGroup) {
    onChange({
      ...schema,
      groups: schema.groups.map((item) => (item.id === nextGroup.id ? nextGroup : item)),
    });
  }

  function addGroup() {
    const newGroup = createGroup(schema.groups.length);
    onChange({ ...schema, groups: [...schema.groups, newGroup] });
    setGroupId(newGroup.id);
    setTrackId("");
  }

  function addTrack() {
    if (!group) return;
    const newTrack = createTrack();
    updateGroup({ ...group, tracks: [...group.tracks, newTrack] });
    setTrackId(newTrack.id);
  }

  return (
    <section className="settings-schema" aria-label="Редактор схемы">
      <div className="settings-section-heading">
        <div>
          <h2>Направления и треки</h2>
          <p className="muted">Соберите матрицу под свои цели.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addGroup}
          disabled={schema.groups.length >= MAX_GROUPS || trackCount >= MAX_TRACKS}
        >
          <Plus aria-hidden="true" /> Добавить направление
        </Button>
      </div>
      <div className="settings-group-tabs" aria-label="Выбрать направление">
        {schema.groups.map((item) => (
          <Button
            key={item.id}
            type="button"
            variant={item.id === group.id ? "default" : "outline"}
            aria-pressed={item.id === group.id}
            onClick={() => {
              setGroupId(item.id);
              setTrackId("");
            }}
          >
            <span className="color-dot" style={{ backgroundColor: `var(--track-${item.color})` }} />
            {item.name || "Без названия"}
          </Button>
        ))}
      </div>
      <div className="settings-group-fields">
        <label className="field" htmlFor={`${fieldId}-name`}>
          <span>Название направления</span>
          <Input
            id={`${fieldId}-name`}
            required
            maxLength={120}
            value={group.name}
            onChange={(event) => updateGroup({ ...group, name: event.target.value })}
          />
        </label>
        <label className="field" htmlFor={`${fieldId}-color`}>
          <span>Цвет направления</span>
          <select
            id={`${fieldId}-color`}
            value={group.color}
            onChange={(event) => updateGroup({ ...group, color: event.target.value })}
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
          className="destructive-text"
          disabled={schema.groups.length === 1}
          onClick={() =>
            onConfirm("Удалить направление со всеми треками и их прогрессом?", () =>
              onChange({ ...schema, groups: schema.groups.filter((item) => item.id !== group.id) }),
            )
          }
        >
          <Trash2 aria-hidden="true" /> Удалить направление
        </Button>
      </div>
      <div className="settings-track-layout">
        <nav className="settings-track-list" aria-label="Треки направления">
          {group.tracks.map((item) => (
            <Button
              key={item.id}
              type="button"
              variant={item.id === track.id ? "secondary" : "ghost"}
              aria-pressed={item.id === track.id}
              onClick={() => setTrackId(item.id)}
            >
              <span>{item.name || "Без названия"}</span>
              <span className="muted">{item.levels.length}</span>
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTrack}
            disabled={trackCount >= MAX_TRACKS}
          >
            <Plus aria-hidden="true" /> Добавить трек
          </Button>
        </nav>
        <TrackEditor
          key={track.id}
          track={track}
          canRemove={group.tracks.length > 1}
          onChange={(nextTrack) =>
            updateGroup({
              ...group,
              tracks: group.tracks.map((item) => (item.id === nextTrack.id ? nextTrack : item)),
            })
          }
          onRemove={() =>
            updateGroup({ ...group, tracks: group.tracks.filter((item) => item.id !== track.id) })
          }
          onRemoveLevel={(index) => onRemoveLevel(track.id, index)}
          onConfirm={onConfirm}
        />
      </div>
    </section>
  );
}
