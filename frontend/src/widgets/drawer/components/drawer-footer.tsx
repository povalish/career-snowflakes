import { ArrowUpRight, Check, RotateCcw } from "lucide-react";

import {
  footer,
  footerContent,
  helperText,
  icon,
  resetButton,
  resetIcon,
  saveButton,
} from "./drawer.classes";

//
//

interface IDrawerFooter {
  busy: boolean;
  level: number;
  progress: number;
  onSetProgress: (level: number) => void;
}

export const DrawerFooter: React.FC<IDrawerFooter> = ({ busy, level, progress, onSetProgress }) => {
  return (
    <footer className={footer()}>
      <div className={footerContent()}>
        <button
          type="button"
          className={saveButton()}
          disabled={busy || progress === level}
          onClick={() => onSetProgress(level)}
        >
          {progress === level ? (
            <>
              <Check className={icon()} />
              Текущий уровень
            </>
          ) : (
            <>
              Установить уровень {level}
              <ArrowUpRight className={icon()} />
            </>
          )}
        </button>
        <p className={helperText()}>Предыдущие этапы также считаются достигнутыми.</p>
        {progress > 0 && (
          <button
            type="button"
            className={resetButton()}
            disabled={busy}
            onClick={() => onSetProgress(0)}
          >
            <RotateCcw className={resetIcon()} />
            Сбросить прогресс трека
          </button>
        )}
      </div>
    </footer>
  );
};
