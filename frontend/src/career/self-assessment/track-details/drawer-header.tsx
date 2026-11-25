import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";

import {
  closeButton,
  groupLabel,
  groupMarker,
  icon,
  progressValue,
  title,
  titleRow,
} from "./drawer.classes";

//
//

interface IDrawerHeader {
  groupName: string;
  trackName: string;
  progress: number;
  levelCount: number;
}

export const DrawerHeader: React.FC<IDrawerHeader> = ({
  groupName,
  trackName,
  progress,
  levelCount,
}) => {
  return (
    <>
      <Dialog.Close className={closeButton()} aria-label="Close">
        <X className={icon()} />
      </Dialog.Close>

      <header className="pr-10">
        <p className={groupLabel()}>
          <span className={groupMarker()} />
          {groupName}
        </p>
        <div className={titleRow()}>
          <Dialog.Title className={title()}>{trackName}</Dialog.Title>
          <span className={progressValue()}>
            {progress}
            <span className="text-xs text-muted-foreground"> / {levelCount}</span>
          </span>
        </div>
      </header>
    </>
  );
};
