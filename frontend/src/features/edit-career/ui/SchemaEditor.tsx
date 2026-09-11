import { useState } from "react";

import { Plus } from "lucide-react";

import type { CareerDocument, CareerGroup } from "@/entities/career";
import { Button } from "@/shared/ui/button";

import { createGroup, createTrack, MAX_GROUPS, MAX_TRACKS } from "../model/draft";
import { GroupFields } from "./GroupFields";
import { GroupTabs } from "./GroupTabs";
import { TrackEditor } from "./TrackEditor";
import { TrackSelector } from "./TrackSelector";

interface SchemaEditorProps {
  schema: CareerDocument["schema"];
  onChange: (schema: CareerDocument["schema"]) => void;
  onRemoveLevel: (trackId: string, index: number) => void;
  onConfirm: (message: string, action: () => void) => void;
}

export function SchemaEditor({ schema, onChange, onRemoveLevel, onConfirm }: SchemaEditorProps) {
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
    <section
      className="rounded-[12px] border border-border bg-card p-[26px] [@media(max-width:560px)]:p-[18px]"
      aria-label="Редактор схемы"
    >
      <div className="mb-5 flex items-center justify-between gap-[18px]">
        <div>
          <h2 className="text-[18px] font-[550]">Направления и треки</h2>
          <p className="text-xs leading-[1.7] text-muted-foreground">
            Соберите матрицу под свои цели.
          </p>
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
      <GroupTabs
        groups={schema.groups}
        selectedGroupId={group.id}
        onSelect={(nextGroupId) => {
          setGroupId(nextGroupId);
          setTrackId("");
        }}
      />
      <GroupFields
        group={group}
        canRemove={schema.groups.length > 1}
        onChange={updateGroup}
        onRemove={() =>
          onConfirm("Удалить направление со всеми треками и их прогрессом?", () =>
            onChange({ ...schema, groups: schema.groups.filter((item) => item.id !== group.id) }),
          )
        }
      />
      <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-[26px] border-t border-border pt-[25px] [@media(max-width:800px)]:grid-cols-[170px_minmax(0,1fr)] [@media(max-width:800px)]:gap-[18px] [@media(max-width:560px)]:grid-cols-1">
        <TrackSelector
          tracks={group.tracks}
          selectedTrackId={track.id}
          canAdd={trackCount < MAX_TRACKS}
          onSelect={setTrackId}
          onAdd={addTrack}
        />
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
