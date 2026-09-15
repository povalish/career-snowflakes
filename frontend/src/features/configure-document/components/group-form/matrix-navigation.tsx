import { useId } from "react";
import { useFormContext, useFormState } from "react-hook-form";

import { FileText, Plus } from "lucide-react";

import { Button } from "@/shared/ui/button";

import type { DocumentFF } from "../../schemas/document";
import { GroupNavigation } from "./group-navigation";
import {
  sidebar,
  header,
  heading,
  groupList,
  count,
  errorHint,
  generalButton,
  generalIcon,
} from "./matrix-navigation.classes";

//
//

interface IMatrixNavigation {
  groups: DocumentFF["groups"];
  fields: readonly { fieldKey: string }[];
  trackCount: number;
  generalSelected: boolean;
  selectedIndex: number;
  selectedTrackIndex: number;
  canAddGroup: boolean;
  onAddGroup: () => void;
  onSelectGeneral: () => void;
  onSelectTrack: (groupIndex: number, trackIndex: number) => void;
}

export const MatrixNavigation: React.FC<IMatrixNavigation> = ({
  groups,
  fields,
  trackCount,
  generalSelected,
  selectedIndex,
  selectedTrackIndex,
  canAddGroup,
  onAddGroup,
  onSelectGeneral,
  onSelectTrack,
}) => {
  const fieldId = useId();
  const { control } = useFormContext<DocumentFF>();
  const { errors, isSubmitting } = useFormState({ control, name: ["groups", "name"] });

  return (
    <nav className={sidebar()} aria-label="Matrix structure">
      {(errors.groups || errors.name) && (
        <span id={`${fieldId}-invalid`} className={errorHint()}>
          Contains invalid fields
        </span>
      )}
      <button
        type="button"
        className={generalButton()}
        aria-pressed={generalSelected}
        data-invalid={Boolean(errors.name)}
        aria-describedby={errors.name ? `${fieldId}-invalid` : undefined}
        onClick={onSelectGeneral}
      >
        <FileText className={generalIcon()} aria-hidden="true" />
        General
      </button>
      <div className={header()}>
        <h2 id={`${fieldId}-heading`} className={heading()}>
          Your matrix
        </h2>
        <span className={count()}>{trackCount} tracks</span>
      </div>
      <div className={groupList()}>
        {fields.map((groupField, index) => (
          <GroupNavigation
            key={groupField.fieldKey}
            group={groups[index]}
            groupIndex={index}
            selected={!generalSelected && index === selectedIndex}
            selectedTrackIndex={selectedTrackIndex}
            invalidDescriptionId={`${fieldId}-invalid`}
            onSelectTrack={onSelectTrack}
          />
        ))}
      </div>
      <Button
        type="button"
        variant="ghost"
        onClick={onAddGroup}
        disabled={!canAddGroup || isSubmitting}
      >
        <Plus aria-hidden="true" /> Add group
      </Button>
    </nav>
  );
};
