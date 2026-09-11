import { useCallback, useEffect, useRef, useState } from "react";
import type { CareerClient } from "./client";
import type { CareerDocument } from "./types";

export function useCareer(client: CareerClient) {
  const [document, setDocument] = useState<CareerDocument | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const pending = useRef(true);

  const run = useCallback(async (action: () => Promise<void>) => {
    if (pending.current) return false;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      await action();
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
      return false;
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }, []);

  const load = useCallback(
    () =>
      run(async () => {
        setDocument(await client.load());
      }),
    [client, run],
  );

  useEffect(() => {
    let cancelled = false;
    pending.current = true;
    void client
      .load()
      .then((loaded) => {
        if (!cancelled) setDocument(loaded);
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(cause instanceof Error ? cause.message : String(cause));
      })
      .finally(() => {
        if (!cancelled) {
          pending.current = false;
          setBusy(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [client]);

  const save = (next: CareerDocument) =>
    run(async () => {
      setDocument(await client.save(next));
    });

  const importDocument = () =>
    run(async () => {
      const imported = await client.importDocument();
      if (imported) setDocument(imported);
    });

  const exportDocument = () =>
    run(async () => {
      await client.exportDocument();
    });

  return { document, busy, error, load, save, importDocument, exportDocument };
}
