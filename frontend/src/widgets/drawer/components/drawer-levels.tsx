import type { Level } from "@/entities/document";

import { levelButton, levelList } from "./drawer.classes";

//
//

interface IDrawerLevels {
  levels: readonly Level[];
  progress: number;
  selectedLevel: number;
  onSelectLevel: (level: number) => void;
}

export const DrawerLevels: React.FC<IDrawerLevels> = ({
  levels,
  progress,
  selectedLevel,
  onSelectLevel,
}) => {
  return (
    <div className={levelList()} aria-label="Track levels">
      {levels.map((level, index) => {
        const levelNumber = index + 1;

        return (
          <button
            key={levelNumber}
            type="button"
            className={levelButton()}
            aria-label={`Level ${levelNumber}: ${level.name}`}
            aria-pressed={selectedLevel === levelNumber}
            data-completed={progress >= levelNumber}
            onClick={() => onSelectLevel(levelNumber)}
          >
            {levelNumber}
          </button>
        );
      })}
    </div>
  );
};
