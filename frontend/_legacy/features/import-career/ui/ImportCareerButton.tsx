import { useState } from "react";

import { ArrowDownToLine } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";

interface ImportCareerButtonProps {
  busy: boolean;
  onImport: () => void;
}

export function ImportCareerButton({ busy, onImport }: ImportCareerButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon-lg"
        disabled={busy}
        aria-label="Импорт"
        title="Импортировать JSON"
        onClick={() => setOpen(true)}
      >
        <ArrowDownToLine aria-hidden="true" />
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
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
                setOpen(false);
                onImport();
              }}
            >
              Выбрать JSON-файл
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
