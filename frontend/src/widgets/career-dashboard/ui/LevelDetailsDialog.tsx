import type { CareerGroup, CareerTrack } from "@/entities/career";
import { LevelDetails } from "@/features/manage-career-progress";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";

interface LevelDetailsDialogProps {
  open: boolean;
  group: CareerGroup;
  track: CareerTrack;
  level: number;
  progress: number;
  busy: boolean;
  error: string;
  onOpenChange: (open: boolean) => void;
  onSelectLevel: (level: number) => void;
  onSetProgress: (level: number) => void;
}

export function LevelDetailsDialog({
  open,
  group,
  track,
  level,
  progress,
  busy,
  error,
  onOpenChange,
  onSelectLevel,
  onSetProgress,
}: LevelDetailsDialogProps) {
  function changeOpen(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      queueMicrotask(() => {
        globalThis.document
          .querySelector<SVGPathElement>('[data-snowflake-segment][data-selected="true"]')
          ?.focus();
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent
        className="max-h-[calc(100dvh-1rem)] max-w-[calc(100%-1rem)] gap-0 overflow-hidden p-0 sm:max-h-[calc(100dvh-2rem)] sm:max-w-[480px]"
        finalFocus={false}
      >
        <DialogTitle className="sr-only">
          {track.name}: уровень {level}
        </DialogTitle>
        <LevelDetails
          group={group}
          track={track}
          level={level}
          progress={progress}
          busy={busy}
          error={error}
          variant="dialog"
          onSelectLevel={onSelectLevel}
          onSetProgress={onSetProgress}
        />
      </DialogContent>
    </Dialog>
  );
}
