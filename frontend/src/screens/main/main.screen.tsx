import { useState } from "react";

import { observer } from "mobx-react-lite";

import { documentService } from "@/entities/document";
import { ChartView } from "@/widgets/chart-view";
import { Drawer } from "@/widgets/drawer";
import { ListView } from "@/widgets/list-view";
import { ScreenNavigation } from "@/widgets/screen-navigation";

import {
  background,
  bottomAccent,
  chartContainer,
  content,
  listContainer,
  main,
} from "./main.classes";
import { mapDocumentToChartTracks } from "./utils/mapDocumentToChartTracks";
import { mapDocumentToListViewGroups } from "./utils/mapDocumentToListViewGroups";
import { MainLoadingScreen } from "./main-loading.screen";
import { MainErrorScreen } from "./main-error.screen";

//
//

const setProgress = async (trackId: string | undefined, level: number): Promise<void> => {
  if (!trackId) return;
  await documentService.setTrackProgress(trackId, level);
};

//
//

export const MainScreen: React.FC = observer(() => {
  // State
  //

  const [detailsOpen, setDetailsOpen] = useState(false);

  // Conditions
  //

  if (documentService.state.isLoading) {
    return <MainLoadingScreen />;
  }

  if (documentService.state.errMsg) {
    return <MainErrorScreen message={documentService.state.errMsg} />
  }

  // Methods
  //

  const selectLevel = (trackId: string, level: number): void => {
    documentService.selectTrack(trackId);
    documentService.selectLevel(level);
    setDetailsOpen(true);
  };

  const selectTrack = (trackId: string): void => {
    documentService.selectTrack(trackId);
    setDetailsOpen(true);
  };

  // Aliases
  //

  const chartTracks = mapDocumentToChartTracks(documentService.document);
  const listGroups = mapDocumentToListViewGroups(documentService.document);

  const availableSelections = documentService.document.schema.groups.flatMap((group) =>
    group.tracks.map((track) => ({ group, track })),
  );
  const selected = availableSelections.find(
    ({ track }) => track.id === documentService.selectedTrackId,
  );
  const drawerSelection =
    selected ?? availableSelections.find(({ track }) => track.levels.length > 0);
  const drawerOpen = detailsOpen && Boolean(selected);

  // Render
  //

  return (
    <main className={main()}>
      <div className={background()} aria-hidden="true" />

      <div className={content()}>
        <div className={chartContainer()}>
          <ChartView tracks={chartTracks} onLevelSelect={selectLevel} />
        </div>

        <div className={listContainer()}>
          <ListView
            groups={listGroups}
            selectedTrackId={documentService.selectedTrackId}
            onTrackSelect={selectTrack}
          />
        </div>
      </div>

      <ScreenNavigation active="main" />

      <Drawer
        open={drawerOpen}
        group={drawerSelection?.group}
        track={drawerSelection?.track}
        progress={documentService.document.progress[drawerSelection?.track.id ?? ""]}
        selectedLevel={documentService.selectedLevel}
        onOpenChange={setDetailsOpen}
        onSelectLevel={(level) => documentService.selectLevel(level)}
        onSetProgress={(level) => setProgress(drawerSelection?.track.id, level)}
      />

      <div className={bottomAccent()} />
    </main>
  );
});
