import { useId } from "react";
import { useFormContext } from "react-hook-form";

import type { DocumentFF } from "../../schemas/document";
import {
  field,
  label,
  textarea,
  resourcesSection,
  resourcesSummary,
} from "./track-resources.classes";

//
//

interface ITrackResources {
  groupIndex: number;
  trackIndex: number;
}

export const TrackResources: React.FC<ITrackResources> = ({ groupIndex, trackIndex }) => {
  const fieldId = useId();
  const { register } = useFormContext<DocumentFF>();

  return (
    <details className={resourcesSection()}>
      <summary className={resourcesSummary()}>Learning resources</summary>
      <div className={field()}>
        <label htmlFor={`${fieldId}-resources`} className={label()}>
          Track resources
        </label>
        <textarea
          {...register(`groups.${groupIndex}.tracks.${trackIndex}.resources`)}
          id={`${fieldId}-resources`}
          className={textarea()}
          placeholder="Links, books, or notes to support this track…"
        />
      </div>
    </details>
  );
};
