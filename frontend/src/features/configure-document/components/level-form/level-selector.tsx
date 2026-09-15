import { useFormContext, useFormState } from "react-hook-form";

import type { DocumentFF } from "../../schemas/document";
import { levelList, levelButton, levelNumber } from "./level-selector.classes";

//
//

interface ILevelSelector {
  groupIndex: number;
  trackIndex: number;
  fields: readonly { fieldKey: string }[];
  levels: DocumentFF["groups"][number]["tracks"][number]["levels"];
  selectedIndex: number;
  onSelectLevel: (index: number) => void;
}

export const LevelSelector: React.FC<ILevelSelector> = ({
  groupIndex,
  trackIndex,
  fields,
  levels,
  selectedIndex,
  onSelectLevel,
}) => {
  const { control } = useFormContext<DocumentFF>();
  const { errors } = useFormState({
    control,
    name: `groups.${groupIndex}.tracks.${trackIndex}.levels`,
  });

  return (
    <div className={levelList()} aria-label="Select level">
      {fields.map((levelField, index) => {
        const level = levels[index];
        const levelLabel = `Level ${index + 1}: ${level?.name.trim() || "Unnamed level"}`;

        return (
          <button
            key={levelField.fieldKey}
            type="button"
            className={levelButton()}
            data-invalid={Boolean(
              errors.groups?.[groupIndex]?.tracks?.[trackIndex]?.levels?.[index],
            )}
            aria-label={levelLabel}
            title={levelLabel}
            aria-pressed={index === selectedIndex}
            onClick={() => onSelectLevel(index)}
          >
            <span className={levelNumber()} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
          </button>
        );
      })}
    </div>
  );
};
