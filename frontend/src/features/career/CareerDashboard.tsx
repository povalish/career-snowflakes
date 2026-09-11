import { CircleHelp } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog";
import { getSelection } from "./progress";
import { Snowflake } from "./Snowflake";
import { TrackList } from "./TrackList";
import { LevelDetails } from "./LevelDetails";
import type { CareerDocument, Selection } from "./types";

interface CareerDashboardProps {
  document: CareerDocument;
  busy: boolean;
  error: string;
  selection: Selection | null;
  detailsOpen: boolean;
  onSelect: (selection: Selection) => void;
  onDetailsOpenChange: (open: boolean) => void;
  onSave: (document: CareerDocument) => void;
}

export function CareerDashboard({
  document,
  busy,
  error,
  selection,
  detailsOpen,
  onSelect,
  onDetailsOpenChange,
  onSave,
}: CareerDashboardProps) {
  const selected = getSelection(document, selection);
  if (!selected) return null;
  const activeSelection = { trackId: selected.track.id, level: selected.level };

  function activate(next: Selection) {
    const opensDetails =
      next.trackId === activeSelection.trackId && next.level === activeSelection.level;
    onSelect(next);
    if (opensDetails) onDetailsOpenChange(true);
  }

  function changeDetailsOpen(open: boolean) {
    onDetailsOpenChange(open);
    if (!open) {
      queueMicrotask(() => {
        globalThis.document
          .querySelector<SVGPathElement>('.snowflake-segment[data-selected="true"]')
          ?.focus();
      });
    }
  }

  return (
    <>
      <section className="chart-panel" aria-labelledby="schema-title">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">ОБЗОР</p>
            <h2 id="schema-title">{document.schema.name}</h2>
          </div>
          <span className="small-badge">Направлений: {document.schema.groups.length}</span>
        </div>
        <div className="chart-layout">
          <div className="chart-container">
            <Snowflake
              document={document}
              selection={activeSelection}
              onSelect={onSelect}
              onActivate={activate}
            />
            <p className="chart-hint">
              <CircleHelp size={14} />
              Выбери сектор и нажми его ещё раз, чтобы открыть подробности
            </p>
          </div>
          <TrackList document={document} selection={activeSelection} onSelect={onSelect} />
        </div>
      </section>
      <Dialog open={detailsOpen} onOpenChange={changeDetailsOpen}>
        <DialogContent
          className="level-details-dialog max-h-[calc(100dvh-1rem)] max-w-[calc(100%-1rem)] gap-0 overflow-hidden p-0 sm:max-h-[calc(100dvh-2rem)] sm:max-w-[480px]"
          finalFocus={false}
        >
          <DialogTitle className="sr-only">
            {selected.track.name}: уровень {selected.level}
          </DialogTitle>
          <LevelDetails
            group={selected.group}
            track={selected.track}
            level={selected.level}
            progress={document.progress[selected.track.id] ?? 0}
            busy={busy}
            error={error}
            onSelectLevel={(level) => onSelect({ trackId: selected.track.id, level })}
            onSetProgress={(level) => {
              onSave({
                ...document,
                progress: { ...document.progress, [selected.track.id]: level },
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
