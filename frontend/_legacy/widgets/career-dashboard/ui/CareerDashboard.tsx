import { getSelection, type CareerDocument, type Selection } from "@/entities/career";

import { CareerOverview } from "./CareerOverview";
import { LevelDetailsDialog } from "./LevelDetailsDialog";

interface CareerDashboardProps {
  document: CareerDocument;
  busy: boolean;
  error: string;
  selection: Selection | null;
  detailsOpen: boolean;
  onSelect: (selection: Selection) => void;
  onDetailsOpenChange: (open: boolean) => void;
  onProgressChange: (trackId: string, level: number) => void;
}

export function CareerDashboard({
  document,
  busy,
  error,
  selection,
  detailsOpen,
  onSelect,
  onDetailsOpenChange,
  onProgressChange,
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

  return (
    <>
      <CareerOverview
        document={document}
        selection={activeSelection}
        onSelect={onSelect}
        onActivate={activate}
      />
      <LevelDetailsDialog
        open={detailsOpen}
        group={selected.group}
        track={selected.track}
        level={selected.level}
        progress={document.progress[selected.track.id] ?? 0}
        busy={busy}
        error={error}
        onOpenChange={onDetailsOpenChange}
        onSelectLevel={(level) => onSelect({ trackId: selected.track.id, level })}
        onSetProgress={(level) => onProgressChange(selected.track.id, level)}
      />
    </>
  );
}
