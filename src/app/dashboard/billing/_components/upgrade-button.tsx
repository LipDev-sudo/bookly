"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

export function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Não foi possível abrir o checkout. Tente novamente.");
        setLoading(false);
      }
    } catch {
      setError("Não foi possível abrir o checkout. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {loading ? "Abrindo Stripe..." : "Testar plano Pro — US$ 19/mês"}
      </button>
      {error && <p className="text-center text-sm text-destructive">{error}</p>}
    </div>
  );
}
