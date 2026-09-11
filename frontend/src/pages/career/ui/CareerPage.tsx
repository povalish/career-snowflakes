import { useState } from "react";

import { setTrackProgress, type CareerClient, type Selection } from "@/entities/career";
import { SettingsEditor } from "@/features/edit-career";
import { CareerActions } from "@/widgets/career-actions";
import { CareerDashboard } from "@/widgets/career-dashboard";

import { useCareerSession } from "../model/use-career-session";
import { CareerLoadState } from "./CareerLoadState";

interface CareerPageProps {
  client: CareerClient;
}

export function CareerPage({ client }: CareerPageProps) {
  const career = useCareerSession(client);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const document = career.document;

  return (
    <div className="mx-auto max-w-[1600px] px-10.5 pt-6 pb-8 [@media(max-width:1150px)]:px-6.25 [@media(max-width:800px)]:px-5 [@media(max-width:560px)]:px-3.5 [@media(max-width:560px)]:pt-4.5 [@media(max-width:560px)]:pb-6">
      <main>
        {career.error && !detailsOpen && (
          <div className="pt-4.5">
            <div
              role="alert"
              className="rounded-[8px] bg-[color-mix(in_srgb,var(--destructive)_8%,transparent)] px-4 py-3 text-[13px] text-destructive wrap-anywhere"
            >
              <strong>Не удалось выполнить действие.</strong> {career.error}
            </div>
          </div>
        )}
        {!document && (
          <CareerLoadState
            busy={career.busy}
            onRetry={() => {
              void career.load();
            }}
          />
        )}
        {document && settingsOpen && (
          <SettingsEditor
            document={document}
            busy={career.busy}
            onSave={async (next) => {
              const saved = await career.save(next);
              if (saved) setSettingsOpen(false);
              return saved;
            }}
            onClose={() => setSettingsOpen(false)}
          />
        )}
        {document && !settingsOpen && (
          <div className="relative pt-7">
            <CareerActions
              busy={career.busy}
              onImport={() => {
                void career.importDocument();
              }}
              onExport={() => {
                void career.exportDocument();
              }}
              onSettings={() => setSettingsOpen(true)}
            />
            <CareerDashboard
              document={document}
              busy={career.busy}
              error={career.error}
              selection={selection}
              detailsOpen={detailsOpen}
              onSelect={setSelection}
              onDetailsOpenChange={setDetailsOpen}
              onProgressChange={(trackId, level) => {
                void career.save(setTrackProgress(document, trackId, level));
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
