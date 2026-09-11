import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Moon, Settings2, Sun } from "lucide-react";
import { Button } from "./ui/button";

interface AppActionsProps {
  busy: boolean;
  onImport: () => void;
  onExport: () => void;
  onSettings: () => void;
}

export function AppActions({ busy, onImport, onExport, onSettings }: AppActionsProps) {
  const [dark, setDark] = useState(() => !document.documentElement.classList.contains("light"));

  function toggleTheme() {
    const nextDark = !dark;
    document.documentElement.classList.toggle("dark", nextDark);
    document.documentElement.classList.toggle("light", !nextDark);
    setDark(nextDark);
  }

  return (
    <fieldset className="app-actions" aria-label="Действия с картой">
      <Button
        variant="ghost"
        size="icon-lg"
        disabled={busy}
        aria-label="Импорт"
        title="Импортировать JSON"
        onClick={onImport}
      >
        <ArrowDownToLine aria-hidden="true" />
      </Button>
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
      <span className="action-divider" aria-hidden="true" />
      <Button
        variant="ghost"
        size="icon-lg"
        aria-label={dark ? "Включить светлую тему" : "Включить тёмную тему"}
        title={dark ? "Включить светлую тему" : "Включить тёмную тему"}
        onClick={toggleTheme}
      >
        {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
      </Button>
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
