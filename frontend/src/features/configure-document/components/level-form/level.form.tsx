import { useId, useRef, useState } from "react";
import { useFieldArray, useFormContext, useFormState, useWatch } from "react-hook-form";

import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/button";

import type { DocumentFF } from "../../schemas/document";
import { LevelEditor } from "./level-editor";
import { LevelSelector } from "./level-selector";
import { section, header, heading } from "./level.classes";
import { MAX_LEVELS } from "./level.constants";
import { createLevel } from "./level.utils";

//
//

interface ILevelForm {
  groupIndex: number;
  trackIndex: number;
}

export const LevelForm: React.FC<ILevelForm> = ({ groupIndex, trackIndex }) => {
  // State
  //

  const fieldId = useId();
  const pendingNameFocus = useRef<string | null>(null);
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(0);

  // Form
  //

  const { control } = useFormContext<DocumentFF>();
  const { isSubmitting } = useFormState({
    control,
    name: `groups.${groupIndex}.tracks.${trackIndex}.levels`,
  });
  const groups = useWatch({ control, name: "groups" });
  const levels = groups[groupIndex]?.tracks[trackIndex]?.levels ?? [];
  const { fields, append, remove } = useFieldArray({
    control,
    name: `groups.${groupIndex}.tracks.${trackIndex}.levels`,
    keyName: "fieldKey",
  });

  // Properties
  //

  const selectedIndex = Math.min(selectedLevelIndex, fields.length - 1);
  const selectedField = fields[selectedIndex];
  const selectedLevel = levels[selectedIndex];
  const canAddLevel = levels.length < MAX_LEVELS;
  const canRemoveLevel = levels.length > 1;

  if (!selectedField || !selectedLevel) return null;

  // Methods
  //

  const addLevel = (): void => {
    pendingNameFocus.current = `groups.${groupIndex}.tracks.${trackIndex}.levels.${levels.length}.name`;
    append(createLevel(levels.length + 1), { shouldFocus: false });
    setSelectedLevelIndex(levels.length);
  };

  const removeLevel = (): void => {
    if (!canRemoveLevel) return;

    remove(selectedIndex);
    setSelectedLevelIndex(Math.max(0, selectedIndex - 1));
  };

  const focusNewName = (element: HTMLInputElement | null): void => {
    if (element && element.name === pendingNameFocus.current) {
      element.focus();
      element.select();
      pendingNameFocus.current = null;
    }
  };

  return (
    <section className={section()} aria-labelledby={`${fieldId}-heading`}>
      <div className={header()}>
        <h4 id={`${fieldId}-heading`} className={heading()}>
          Development levels
        </h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLevel}
          disabled={!canAddLevel || isSubmitting}
        >
          <Plus aria-hidden="true" />
          Add level
        </Button>
      </div>

      <LevelSelector
        groupIndex={groupIndex}
        trackIndex={trackIndex}
        fields={fields}
        levels={levels}
        selectedIndex={selectedIndex}
        onSelectLevel={setSelectedLevelIndex}
      />
      <LevelEditor
        fieldKey={selectedField.fieldKey}
        groupIndex={groupIndex}
        trackIndex={trackIndex}
        levelIndex={selectedIndex}
        levelCount={levels.length}
        canRemoveLevel={canRemoveLevel}
        onRemoveLevel={removeLevel}
        onNameMount={focusNewName}
      />
    </section>
  );
};
