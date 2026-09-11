import { Plus } from "lucide-react";

import type { CareerTrack } from "@/entities/career";
import { Button } from "@/shared/ui/button";

interface TrackSelectorProps {
  tracks: CareerTrack[];
  selectedTrackId: string;
  canAdd: boolean;
  onSelect: (trackId: string) => void;
  onAdd: () => void;
}

export function TrackSelector({
  tracks,
  selectedTrackId,
  canAdd,
  onSelect,
  onAdd,
}: TrackSelectorProps) {
  return (
    <nav
      className="flex flex-col items-stretch gap-2 [@media(max-width:560px)]:flex-row [@media(max-width:560px)]:flex-wrap"
      aria-label="Треки направления"
    >
      {tracks.map((track) => (
        <Button
          key={track.id}
          type="button"
          variant={track.id === selectedTrackId ? "secondary" : "ghost"}
          className="h-auto min-h-9 justify-start whitespace-normal text-left"
          aria-pressed={track.id === selectedTrackId}
          onClick={() => onSelect(track.id)}
        >
          <span>{track.name || "Без названия"}</span>
          <span className="text-xs leading-[1.7] text-muted-foreground">{track.levels.length}</span>
        </Button>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-auto min-h-9 justify-start whitespace-normal text-left"
        onClick={onAdd}
        disabled={!canAdd}
      >
        <Plus aria-hidden="true" /> Добавить трек
      </Button>
    </nav>
  );
}
