"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

type Props = {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label: string;
};

export function DeleteButton({ action, id, label }: Props) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return;
    const fd = new FormData();
    fd.set("id", id);
    startTransition(() => action(fd));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive disabled:opacity-50"
      aria-label={`Delete ${label}`}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
