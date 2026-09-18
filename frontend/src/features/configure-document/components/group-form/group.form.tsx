import { GROUP_COLOR_CLASSES } from "@/shared/config/track-colors";

import { GeneralForm } from "../general-form/general.form";
import { TrackForm } from "../track-form/track.form";
import { GroupFormContext, useGroupFormState } from "./group-form.context";
import { GroupSettings } from "./group-settings";
import { workspace, editor } from "./group.classes";
import { MatrixNavigation } from "./matrix-navigation";

//
//

export const GroupForm: React.FC = () => {
  const { groups, fields, editor: editorState } = useGroupFormState();

  const { isGeneralTabSelected, selectedGroupIndex } = editorState;
  const selectedField = fields[selectedGroupIndex];
  const selectedGroup = groups[selectedGroupIndex];

  if (!selectedField || !selectedGroup) return null;

  return (
    <GroupFormContext.Provider value={editorState}>
      <div className={workspace()}>
        <MatrixNavigation groups={groups} fields={fields} />

        {isGeneralTabSelected && (
          <div key="general" className={editor()}>
            <GeneralForm />
          </div>
        )}

        {!isGeneralTabSelected && (
          <div
            key={selectedField.fieldKey}
            className={editor({ className: GROUP_COLOR_CLASSES[selectedGroup.color] })}
          >
            <GroupSettings groupIndex={selectedGroupIndex} />
            <TrackForm groupIndex={selectedGroupIndex} />
          </div>
        )}
      </div>
    </GroupFormContext.Provider>
  );
};
