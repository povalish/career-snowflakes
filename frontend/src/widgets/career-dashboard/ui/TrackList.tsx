import { ChevronRight } from "lucide-react";

import {
  getTrackColorClass,
  getTracks,
  type CareerDocument,
  type Selection,
} from "@/entities/career";

interface TrackListProps {
  document: CareerDocument;
  selection: Selection;
  onSelect: (selection: Selection) => void;
}

export function TrackList({ document, selection, onSelect }: TrackListProps) {
  const entries = getTracks(document);
  return (
    <nav
      className="grid gap-4 pt-[18px] [@media(max-width:700px)]:grid-cols-2 [@media(max-width:700px)]:gap-x-[7px] [@media(max-width:700px)]:gap-y-[18px]"
      aria-label="Треки развития"
    >
      {document.schema.groups.map((group) => (
        <section key={group.id} className={getTrackColorClass(group.color)}>
          <h3 className="mt-0 mr-0 mb-[5px] ml-[9px] flex items-center gap-[7px] text-[10px] font-medium text-[var(--track-color)]">
            <span className="inline-block size-[6px] shrink-0 rounded-full bg-[var(--track-color)]" />
            {group.name}
          </h3>
          {entries
            .filter((entry) => entry.group.id === group.id)
            .map(({ track, index }) => {
              const progress = document.progress[track.id] ?? 0;
              return (
                <button
                  key={track.id}
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-[7px] rounded-[5px] border border-transparent bg-transparent px-2 py-[6px] text-left text-[10px] text-muted-foreground hover:bg-muted focus-visible:outline-ring/50 aria-pressed:border-[color-mix(in_srgb,var(--track-color)_24%,transparent)] aria-pressed:bg-[color-mix(in_srgb,var(--track-color)_8%,transparent)] aria-pressed:text-foreground aria-pressed:[&>svg]:opacity-80 min-[1400px]:py-[7px] min-[1400px]:text-[11px] [&>svg]:shrink-0 [&>svg]:opacity-0"
                  aria-pressed={selection.trackId === track.id}
                  onClick={() =>
                    onSelect({
                      trackId: track.id,
                      level: Math.min(progress + 1, track.levels.length),
                    })
                  }
                >
                  <span className="text-[8px] [font-variant-numeric:tabular-nums] opacity-65">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 [overflow-wrap:anywhere]">{track.name}</span>
                  <span className="text-[var(--track-color)] [font-variant-numeric:tabular-nums]">
                    {progress}
                    <span className="text-muted-foreground opacity-60">/{track.levels.length}</span>
                  </span>
                  <ChevronRight size={13} aria-hidden="true" />
                </button>
              );
            })}
        </section>
      ))}
    </nav>
  );
}
