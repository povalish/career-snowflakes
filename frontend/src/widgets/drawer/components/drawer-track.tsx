import { Check } from "lucide-react";

import type { Level } from "@/entities/document";

import {
  exampleHeading,
  exampleItem,
  exampleList,
  levelEyebrow,
  levelHeader,
  levelStatus,
  smallIcon,
  stageDescription,
  stageTitle,
} from "./drawer.classes";

//
//

interface IDrawerTrack {
  level: number;
  progress: number;
  stage: Level;
}

export const DrawerTrack: React.FC<IDrawerTrack> = ({ level, progress, stage }) => {
  return (
    <section aria-labelledby="selected-level-title">
      <div className={levelHeader()}>
        <p className={levelEyebrow()}>УРОВЕНЬ {level}</p>
        <span className={levelStatus()}>
          {progress >= level ? (
            <>
              <Check className={smallIcon()} />
              Достигнут
            </>
          ) : (
            "Впереди"
          )}
        </span>
      </div>
      <h2 id="selected-level-title" className={stageTitle()}>
        {stage.name}
      </h2>
      <p className={stageDescription()}>
        {stage.description || "Добавьте описание этого этапа в настройках схемы."}
      </p>

      {stage.examples.length > 0 && (
        <div className="mt-6">
          <h3 className={exampleHeading()}>Как это выглядит на практике</h3>
          <ul className={exampleList()}>
            {stage.examples.map((example, index) => (
              <li key={index} className={exampleItem()}>
                {example}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
