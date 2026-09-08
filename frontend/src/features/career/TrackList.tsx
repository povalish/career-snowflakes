import { ChevronRight } from "lucide-react";
import { getTracks } from "./progress";
import { trackStyle } from "./track-style";
import type { CareerDocument, Selection } from "./types";

interface TrackListProps {
  document: CareerDocument;
  selection: Selection;
  onSelect: (selection: Selection) => void;
}

export function TrackList({ document, selection, onSelect }: TrackListProps) {
  const entries = getTracks(document);
  return (
    <nav className="track-list" aria-label="Треки развития">
      {document.schema.groups.map((group) => (
        <section key={group.id} className="track-group" style={trackStyle(group.color)}>
          <h3>
            <span className="color-dot" />
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
                  className="track-row"
                  aria-pressed={selection.trackId === track.id}
                  onClick={() =>
                    onSelect({
                      trackId: track.id,
                      level: Math.min(progress + 1, track.levels.length),
                    })
                  }
                >
                  <span className="track-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="track-name">{track.name}</span>
                  <span className="track-count">
                    {progress}
                    <span>/{track.levels.length}</span>
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
