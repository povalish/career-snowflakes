import { LoaderCircle } from "lucide-react";

import { Button } from "@/shared/ui/button";

interface CareerLoadStateProps {
  busy: boolean;
  onRetry: () => void;
}

export function CareerLoadState({ busy, onRetry }: CareerLoadStateProps) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
      {busy ? (
        <>
          <LoaderCircle className="animate-spin motion-reduce:animate-none" />
          <h1 className="text-[24px]">Открываем твою карту развития</h1>
        </>
      ) : (
        <>
          <h1 className="text-[24px]">Не удалось открыть карту развития</h1>
          <p className="text-muted-foreground">
            Проверьте сообщение об ошибке и повторите загрузку.
          </p>
          <Button onClick={onRetry}>Повторить загрузку</Button>
        </>
      )}
    </section>
  );
}
