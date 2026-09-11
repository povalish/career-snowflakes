import { useState } from "react";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/shared/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = useState(() => !document.documentElement.classList.contains("light"));

  function toggleTheme() {
    const nextDark = !dark;
    document.documentElement.classList.toggle("dark", nextDark);
    document.documentElement.classList.toggle("light", !nextDark);
    setDark(nextDark);
  }

  const label = dark ? "Включить светлую тему" : "Включить тёмную тему";

  return (
    <Button variant="ghost" size="icon-lg" aria-label={label} title={label} onClick={toggleTheme}>
      {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  );
}
