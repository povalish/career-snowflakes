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

export interface Confirmation {
  message: string;
  action: () => void;
}

interface ConfirmChangesDialogProps {
  confirmation: Confirmation | null;
  onDismiss: () => void;
}

export function ConfirmChangesDialog({ confirmation, onDismiss }: ConfirmChangesDialogProps) {
  return (
    <AlertDialog
      open={Boolean(confirmation)}
      onOpenChange={(open) => {
        if (!open) onDismiss();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Подтверждение действия</AlertDialogTitle>
          <AlertDialogDescription>{confirmation?.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Продолжить редактирование</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              confirmation?.action();
              onDismiss();
            }}
          >
            Подтвердить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
