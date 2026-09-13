import { createDocumentMock } from "@/entities/document";
import { ChartView, mapDocumentToChartTracks } from "@/widgets/chart-view";

//
//

const documentMock = createDocumentMock();
const chartTracks = mapDocumentToChartTracks(documentMock);

//
//

export const MainScreen: React.FC = () => {
  return (
    <main className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-8 text-foreground sm:px-8 sm:py-10">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,var(--color-card)_0%,transparent_68%)]"
        aria-hidden="true"
      />

      <div className="mx-auto flex w-full max-w-7xl items-center justify-center">
        <div className="w-full max-w-[min(92vw,72vh,46rem)]">
          <ChartView tracks={chartTracks} />
        </div>
      </div>
    </main>
  );
};
