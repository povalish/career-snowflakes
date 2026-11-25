import { useState } from "react";

import type { Document } from "@/career/document";

import { ChartView } from "./chart";
import { mapDocumentToChartTracks } from "./chart/mapDocumentToChartTracks";
import { ListView } from "./list";
import { mapDocumentToListViewGroups } from "./list/mapDocumentToListViewGroups";
import {
  background,
  bottomAccent,
  chartContainer,
  content,
  listContainer,
  main,
} from "./self-assessment.classes";
import { Drawer } from "./track-details";
import { withTrackProgress } from "./with-track-progress";

interface SelfAssessmentProps {
  document: Document;
  onSave: (candidate: Document) => Promise<Document>;
}

export function SelfAssessmentScreen({ document, onSave }: SelfAssessmentProps) {
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  function openTrack(trackId: string, level: number | null = null) {
    setSelectedTrackId(trackId);
    setSelectedLevel(level);
    setDetailsOpen(true);
  }

  const tracks = document.schema.groups.flatMap((group) =>
    group.tracks.map((track) => ({ group, track })),
  );
  const selected = tracks.find(({ track }) => track.id === selectedTrackId);
  const details = selected ?? tracks.find(({ track }) => track.levels.length > 0);

  async function setProgress(level: number): Promise<void> {
    if (selected) await onSave(withTrackProgress(document, selected.track.id, level));
  }

  return (
    <main className={main()}>
      <div className={background()} aria-hidden="true" />
      <div className={content()}>
        <div className={chartContainer()}>
          <ChartView tracks={mapDocumentToChartTracks(document)} onLevelSelect={openTrack} />
        </div>
        <div className={listContainer()}>
          <ListView
            groups={mapDocumentToListViewGroups(document)}
            selectedTrackId={selectedTrackId}
            onTrackSelect={openTrack}
          />
        </div>
      </div>
      <Drawer
        open={detailsOpen && Boolean(selected)}
        group={details?.group}
        track={details?.track}
        progress={details && document.progress[details.track.id]}
        selectedLevel={selectedLevel}
        onOpenChange={setDetailsOpen}
        onSelectLevel={setSelectedLevel}
        onSetProgress={setProgress}
      />
      <div className={bottomAccent()} aria-hidden="true" />
    </main>
  );
}
