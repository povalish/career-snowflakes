import { useEffect, useState } from "react";

import { LoaderCircle } from "lucide-react";
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
  loadError,
  loadingIcon,
  loadingState,
  main,
} from "./main.classes";
import { mapDocumentToChartTracks } from "./utils/mapDocumentToChartTracks";
import { mapDocumentToListViewGroups } from "./utils/mapDocumentToListViewGroups";

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
  const [isLoading, setIsLoading] = useState(true);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadDocument = async (): Promise<void> => {
      try {
        await documentService.load();
      } catch (error) {
        if (!active) return;
        setLoadErrorMessage(error instanceof Error ? error.message : "Could not load document");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadDocument();

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return (
      <main className={main()}>
        <div className={background()} aria-hidden="true" />
        <output className={loadingState()}>
          <LoaderCircle className={loadingIcon()} aria-hidden="true" />
          Loading document…
        </output>
        <ScreenNavigation active="main" />
      </main>
    );
  }

  if (loadErrorMessage) {
    return (
      <main className={main()}>
        <div className={background()} aria-hidden="true" />
        <p className={loadError()} role="alert">
          Could not load document: {loadErrorMessage}
        </p>
        <ScreenNavigation active="main" />
      </main>
    );
  }

  const chartTracks = mapDocumentToChartTracks(documentService.document);
  const listGroups = mapDocumentToListViewGroups(documentService.document);

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
        <ListView
          groups={listGroups}
          selectedTrackId={documentService.selectedTrackId}
          onTrackSelect={selectTrack}
        />
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
