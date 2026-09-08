import { useState } from "react";
import { Moon, Sun, Settings2, Snowflake } from "lucide-react";
import { Button } from "./ui/button";

export function AppHeader({
  settingsDisabled,
  onSettings,
}: {
  settingsDisabled: boolean;
  onSettings: () => void;
}) {
  const [dark, setDark] = useState(true);
  function toggleTheme() {
    setDark(!dark);
    document.documentElement.classList.toggle("dark", !dark);
    document.documentElement.classList.toggle("light", dark);
  }
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-icon">
          <Snowflake size={23} strokeWidth={1.6} />
        </span>
        <span>
          career<span className="brand-light"> / snowflakes</span>
        </span>
      </div>
      <div className="header-actions">
        <span className="local-badge">
          <span />
          Локальное пространство
        </span>
        <Button
          variant="ghost"
          size="icon"
          aria-label={dark ? "Включить светлую тему" : "Включить тёмную тему"}
          onClick={toggleTheme}
        >
          {dark ? <Sun /> : <Moon />}
        </Button>
        <Button variant="outline" disabled={settingsDisabled} onClick={onSettings}>
          <Settings2 />
          Настройки
        </Button>
      </div>
    </header>
  );
}
