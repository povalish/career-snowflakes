import { AppHeader } from "./components/AppHeader";
import { CareerDashboard } from "./features/career/CareerDashboard";
import { useState } from "react";
import { Check, LoaderCircle } from "lucide-react";
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
  const document = career.document;
  return (
    <div className="app-shell">
      <AppHeader
        settingsDisabled={!document || career.busy || settingsOpen}
        onSettings={() => setSettingsOpen(true)}
      />
      <main>
        <div className="notification-area" aria-live="polite">
          {career.error && (
            <div role="alert" className="error-message">
              <strong>Не удалось выполнить действие.</strong> {career.error}
            </div>
          )}
          {career.notice && (
            <output className="success-message">
              <Check size={15} />
              {career.notice}
            </output>
          )}
        </div>
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
          <CareerDashboard
            document={document}
            busy={career.busy}
            selection={selection}
            onSelect={setSelection}
            onImport={() => setImportOpen(true)}
            onExport={() => {
              void career.exportDocument();
            }}
            onSave={(next) => {
              void career.save(next);
            }}
          />
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
