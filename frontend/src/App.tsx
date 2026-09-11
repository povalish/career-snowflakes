import { AppActions } from "./components/AppActions";
import { CareerDashboard } from "./features/career/CareerDashboard";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "./components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "./components/ui/alert-dialog";
import { careerClient, type CareerClient } from "./features/career/client";
import { useCareer } from "./features/career/use-career";
import { SettingsEditor } from "./features/settings/SettingsEditor";
import type { Selection } from "./features/career/types";

export default function App({ client = careerClient }: { client?: CareerClient }) {
  const career = useCareer(client);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const document = career.document;
  return (
    <div className="app-shell">
      <main>
        {career.error && !detailsOpen && (
          <div className="notification-area">
            <div role="alert" className="error-message">
              <strong>Не удалось выполнить действие.</strong> {career.error}
            </div>
          </div>
        )}
        {!document && (
          <section className="loading-panel">
            {career.busy ? (
              <>
                <LoaderCircle className="animate-spin" />
                <h1>Открываем твою карту развития</h1>
              </>
            ) : (
              <>
                <h1>Не удалось открыть карту развития</h1>
                <p>Проверьте сообщение об ошибке и повторите загрузку.</p>
                <Button
                  onClick={() => {
                    void career.load();
                  }}
                >
                  Повторить загрузку
                </Button>
              </>
            )}
          </section>
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
          <div className="dashboard">
            <AppActions
              busy={career.busy}
              onImport={() => setImportOpen(true)}
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
              onSave={(next) => {
                void career.save(next);
              }}
            />
          </div>
        )}
      </main>
      <AlertDialog open={importOpen} onOpenChange={setImportOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Импортировать другую схему?</AlertDialogTitle>
            <AlertDialogDescription>
              Файл заменит текущую схему, профиль и прогресс. Экспортируйте текущую карту, если
              хотите сохранить её копию.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setImportOpen(false);
                void career.importDocument();
              }}
            >
              Выбрать JSON-файл
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
