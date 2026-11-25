import { useState } from "react";

import { LoaderCircle } from "lucide-react";
import { observer } from "mobx-react-lite";

import type { DocumentService } from "@/career/document";
import { MatrixEditorScreen } from "@/career/matrix-editor";
import { SelfAssessmentScreen } from "@/career/self-assessment";
import { Button } from "@/shared/ui/button";

import { ScreenNavigation } from "./navigation";

export const DocumentWorkspace = observer(function DocumentWorkspace({
  active,
  service,
}: {
  active: "main" | "settings";
  service: DocumentService;
}) {
  const { document, loadError } = service;
  const [importError, setImportError] = useState("");
  const [importing, setImporting] = useState(false);

  async function importDocument() {
    setImporting(true);
    setImportError("");
    try {
      await service.import();
    } catch (cause) {
      setImportError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setImporting(false);
    }
  }

  return (
    <>
      {document ? (
        active === "main" ? (
          <SelfAssessmentScreen
            document={document}
            onSave={(candidate) => service.save(candidate)}
          />
        ) : (
          <MatrixEditorScreen
            document={document}
            onSave={(candidate) => service.save(candidate)}
            onImport={() => service.import()}
            onExport={() => service.export()}
          />
        )
      ) : (
        <main className="grid min-h-screen place-content-center justify-items-center gap-3 bg-background text-foreground">
          {loadError !== null ? (
            <>
              <p role="alert" className="text-sm text-destructive">
                Could not load document: {loadError}
              </p>
              {active === "settings" && (
                <Button type="button" disabled={importing} onClick={() => void importDocument()}>
                  Import
                </Button>
              )}
              {importError && (
                <p role="alert" className="text-sm text-destructive">
                  {importError}
                </p>
              )}
            </>
          ) : (
            <output className="flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle
                className="size-4 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
              Loading document…
            </output>
          )}
        </main>
      )}
      <ScreenNavigation active={active} />
    </>
  );
});
