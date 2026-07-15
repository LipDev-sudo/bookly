"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

const LABELS: Record<string, string> = {
  created: "Created successfully.",
  updated: "Changes saved.",
  deleted: "Deleted successfully.",
};

export function FlashToast({ message }: { message?: string }) {
  const [visible, setVisible] = useState(!!message);
  const closedRef = useRef(false);

  const close = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    setVisible(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("toast");
    window.history.replaceState({}, "", url.toString());
  }, []);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(close, 3500);
    return () => clearTimeout(t);
  }, [close, message]);

  if (!visible || !message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-lg animate-toast-in">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
      <p className="text-sm font-medium">{LABELS[message] ?? message}</p>
      <button
        onClick={close}
        className="ml-1 rounded p-0.5 text-muted-foreground hover:text-foreground"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
