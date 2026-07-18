"use client";

import { useTransition } from "react";

export function DeleteClientButton({
  clientId,
  clientName,
  onDelete,
}: {
  clientId: string;
  clientName: string;
  onDelete: (clientId: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (
      !confirm(
        `Klantdossier van "${clientName}" en alle bijbehorende gegevens (notities, resultaten, test resultaten) permanent verwijderen? Dit kan niet ongedaan worden gemaakt.`,
      )
    )
      return;
    startTransition(() => {
      onDelete(clientId);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="ml-3 shrink-0 text-xs font-medium text-red-600 hover:underline disabled:opacity-60"
    >
      Verwijderen
    </button>
  );
}
