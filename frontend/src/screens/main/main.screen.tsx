import { createDocumentMock } from "@/entities/document";
import { ChartView, mapDocumentToChartTracks } from "@/widgets/chart-view";

const documentMock = createDocumentMock();
const chartTracks = mapDocumentToChartTracks(documentMock);

export const MainScreen: React.FC = () => {
  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-10">
      <section
        className="mx-auto max-w-190 overflow-hidden rounded-xl border border-border bg-card"
        aria-labelledby="schema-title"
      >
        <header className="px-5 pt-5 sm:px-6 sm:pt-6">
          <p className="mb-1 text-[9px] font-semibold tracking-[1.6px] text-muted-foreground">
            ОБЗОР
          </p>
          <h1 id="schema-title" className="text-lg font-medium tracking-[-0.3px]">
            {documentMock.schema.name}
          </h1>
        </header>

        <div className="mx-auto w-full max-w-165 px-2 pb-4 sm:px-5 sm:pb-6">
          <ChartView tracks={chartTracks} />
        </div>
      </section>
    </main>
  );
};
