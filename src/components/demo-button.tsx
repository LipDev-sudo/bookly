"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DemoButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDemo() {
    setLoading(true);
    try {
      const res = await fetch("/api/demo", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        router.push("/dashboard");
      } else {
        alert(data.error ?? "Demo login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDemo}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 font-medium hover:bg-muted disabled:opacity-50"
    >
      {loading ? "Loading demo..." : "Try the demo"}
    </button>
  );
}
