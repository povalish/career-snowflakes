import { ArrowUpFromLine, Settings2 } from "lucide-react";

import { ImportCareerButton } from "@/features/import-career";
import { ThemeToggle } from "@/features/toggle-theme";
import { Button } from "@/shared/ui/button";

interface CareerActionsProps {
  busy: boolean;
  onImport: () => void;
  onExport: () => void;
  onSettings: () => void;
}

export function CareerActions({ busy, onImport, onExport, onSettings }: CareerActionsProps) {
  return (
    <fieldset
      className="absolute top-0 right-4 z-10 m-0 flex min-w-0 items-center gap-0.5 rounded-[12px] border border-border bg-[color-mix(in_srgb,var(--card)_92%,transparent)] p-1 shadow-[0_8px_24px_rgb(0_0_0_/_18%)] backdrop-blur-[12px]"
      aria-label="Действия с картой"
    >
      <ImportCareerButton busy={busy} onImport={onImport} />
      <Button
        variant="ghost"
        size="icon-lg"
        disabled={busy}
        aria-label="Экспорт"
        title="Экспортировать JSON"
        onClick={onExport}
      >
        <ArrowUpFromLine aria-hidden="true" />
      </Button>
      <span className="mx-0.5 h-5 w-px bg-border" aria-hidden="true" />
      <ThemeToggle />
      <Button
        variant="ghost"
        size="icon-lg"
        disabled={busy}
        aria-label="Настройки"
        title="Открыть настройки"
        onClick={onSettings}
      >
        <Settings2 aria-hidden="true" />
      </Button>
    </fieldset>
  );
}
