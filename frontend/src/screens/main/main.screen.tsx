import { observer } from "mobx-react-lite";

import { documentService } from "@/entities/document";
import { ChartView } from "@/widgets/chart-view";
import { ListView } from "@/widgets/list-view";

import { mapDocumentToChartTracks } from "./utils/mapDocumentToChartTracks";
import { mapDocumentToListViewGroups } from "./utils/mapDocumentToListViewGroups";

//
//

const handleTrackSelect = (trackId: string): void => {
  documentService.selectTrack(trackId);
};

//
//

export const MainScreen: React.FC = observer(() => {
  const chartTracks = mapDocumentToChartTracks(documentService.document);
  const listGroups = mapDocumentToListViewGroups(documentService.document);

  return (
    <main className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-8 text-foreground sm:px-8 sm:py-10">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,var(--color-card)_0%,transparent_68%)]"
        aria-hidden="true"
      />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,46rem)_minmax(13rem,15rem)] items-center justify-center gap-[clamp(2rem,5vw,4.5rem)] [@media(max-width:700px)]:grid-cols-1">
        <div className="w-full max-w-[min(92vw,72vh,46rem)]">
          <ChartView tracks={chartTracks} onTrackSelect={handleTrackSelect} />
        </div>
        <ListView groups={listGroups} selectedTrackId={documentService.selectedTrackId} />
      </div>
    </main>
  );
});
