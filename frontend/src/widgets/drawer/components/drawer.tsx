import { useState } from "react";

import { Dialog } from "@base-ui/react/dialog";

import type { Group, Track } from "@/entities/document";
import { TRACK_COLOR_CLASSES } from "@/shared/config/track-colors";

import { FALLBACK_GROUP, FALLBACK_TRACK } from "../constants/fallbacks";
import { DrawerDescription } from "./drawer-description";
import { DrawerError } from "./drawer-error";
import { DrawerFooter } from "./drawer-footer";
import { DrawerHeader } from "./drawer-header";
import { DrawerLevels } from "./drawer-levels";
import { DrawerTrack } from "./drawer-track";
import { backdrop, popup } from "./drawer.classes";

//
//

export interface IDrawer {
  open: boolean;
  group?: Group;
  track?: Track;
  progress?: number;
  selectedLevel?: number | null;
  onOpenChange: (open: boolean) => void;
  onSelectLevel: (level: number) => void;
  onSetProgress: (level: number) => Promise<void>;
}

export const Drawer: React.FC<IDrawer> = ({
  open,
  group = FALLBACK_GROUP,
  track = FALLBACK_TRACK,
  progress = 0,
  selectedLevel = null,
  onOpenChange,
  onSelectLevel,
  onSetProgress,
}) => {
  const defaultLevel = Math.min(progress + 1, track.levels.length);
  const level =
    selectedLevel !== null && track.levels[selectedLevel - 1] ? selectedLevel : defaultLevel;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const stage = track.levels[level - 1];
  const colorClass = TRACK_COLOR_CLASSES[group.color] ?? TRACK_COLOR_CLASSES.aqua;

  if (!stage) return null;

  const handleOpenChange = (nextOpen: boolean): void => {
    if (nextOpen) setError("");
    onOpenChange(nextOpen);
  };

  const handleSetProgress = async (nextLevel: number): Promise<void> => {
    setBusy(true);
    setError("");

    try {
      await onSetProgress(nextLevel);
      onSelectLevel(Math.max(1, nextLevel));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal keepMounted>
        <Dialog.Backdrop className={backdrop()} />
        <Dialog.Popup className={popup({ className: colorClass })}>
          <DrawerHeader
            groupName={group.name}
            trackName={track.name}
            progress={progress}
            levelCount={track.levels.length}
          />
          <DrawerDescription description={track.description} />
          {error && <DrawerError error={error} />}
          <DrawerLevels
            levels={track.levels}
            progress={progress}
            selectedLevel={level}
            onSelectLevel={onSelectLevel}
          />
          <DrawerTrack level={level} progress={progress} stage={stage} />
          <DrawerFooter
            busy={busy}
            level={level}
            progress={progress}
            onSetProgress={(nextLevel) => void handleSetProgress(nextLevel)}
          />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
