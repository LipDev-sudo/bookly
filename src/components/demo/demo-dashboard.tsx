"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Trash2 } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import {
  completeNextAppointment,
  createDemoState,
  createEmptyDemoState,
  DEMO_STORAGE_KEY,
  getDemoMetrics,
  parseDemoState,
  type DemoState,
} from "@/lib/demo-data";
import { DEMO_DISCLOSURE } from "@/lib/site";
import {
  DemoMobileNavigation,
  DemoSidebar,
  type DemoView,
} from "./demo-navigation";
import { DemoOverview } from "./demo-overview";
import {
  DemoAppointments,
  DemoClients,
  DemoServices,
} from "./demo-sections";
import { DemoSkeleton } from "./demo-ui";

const DEFAULT_DEMO_JSON = JSON.stringify(createDemoState());
const DEMO_CHANGE_EVENT = "horavia-demo-change";

function subscribeToDemo(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(DEMO_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(DEMO_CHANGE_EVENT, callback);
  };
}

function getDemoSnapshot() {
  return window.localStorage.getItem(DEMO_STORAGE_KEY) ?? DEFAULT_DEMO_JSON;
}

function updateDemoStorage(data: DemoState) {
  window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(DEMO_CHANGE_EVENT));
}

export function DemoDashboard() {
  const [view, setView] = useState<DemoView>("overview");
  const [confirmClear, setConfirmClear] = useState(false);
  const clearButtonRef = useRef<HTMLButtonElement>(null);
  const serialized = useSyncExternalStore(
    subscribeToDemo,
    getDemoSnapshot,
    () => DEFAULT_DEMO_JSON,
  );
  const { data, error } = useMemo(() => {
    try {
      return { data: parseDemoState(serialized), error: null };
    } catch (caughtError) {
      return {
        data: null,
        error:
          caughtError instanceof Error
            ? caughtError.message
            : "Não foi possível carregar a demonstração.",
      };
    }
  }, [serialized]);
  const metrics = useMemo(
    () => (data ? getDemoMetrics(data) : null),
    [data],
  );

  function resetDemo() {
    updateDemoStorage(createDemoState());
    setView("overview");
    setConfirmClear(false);
  }

  function closeClearConfirmation() {
    setConfirmClear(false);
    window.requestAnimationFrame(() => clearButtonRef.current?.focus());
  }

  function clearDemo() {
    updateDemoStorage(createEmptyDemoState());
    closeClearConfirmation();
  }

  function completeNext() {
    if (!data) return;
    updateDemoStorage(completeNextAppointment(data));
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-background p-6">
        <section
          className="w-full max-w-md rounded-2xl border border-destructive/30 bg-card p-8 text-center"
          role="alert"
        >
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-4 text-xl font-bold">Demonstração indisponível</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <button
            type="button"
            onClick={resetDemo}
            className="mt-6 min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            Restaurar dados fictícios
          </button>
        </section>
      </main>
    );
  }

  if (!data || !metrics) return <DemoSkeleton />;

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[248px_1fr]">
      <DemoSidebar view={view} onChange={setView} />
      <main className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 py-4 backdrop-blur sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="grid min-h-11 min-w-11 shrink-0 place-items-center lg:hidden"
                aria-label="Voltar para o início da Horavia"
              >
                <BrandMark compact />
              </Link>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Demonstração interativa
                </p>
                <h1 className="mt-1 text-xl font-bold sm:text-2xl">
                  {data.business.name}
                </h1>
                <p className="mt-1 hidden text-xs text-muted-foreground sm:block">
                  {data.business.category} · {data.business.city}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                ref={clearButtonRef}
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm font-medium hover:bg-muted"
                aria-label="Limpar dados fictícios da demonstração"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Limpar</span>
              </button>
              <button
                type="button"
                onClick={resetDemo}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <RotateCcw className="h-4 w-4" /> Restaurar
              </button>
            </div>
          </div>
          <DemoMobileNavigation view={view} onChange={setView} />
        </header>

        {confirmClear ? (
          <section
            className="mx-auto mt-4 max-w-6xl px-4 sm:px-8"
            role="alertdialog"
            aria-labelledby="clear-demo-title"
            aria-describedby="clear-demo-description"
          >
            <div className="flex flex-col gap-4 rounded-2xl border border-destructive/25 bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 id="clear-demo-title" className="font-bold">
                  Limpar os registros fictícios?
                </h2>
                <p
                  id="clear-demo-description"
                  className="mt-1 text-sm text-muted-foreground"
                >
                  A agenda ficará vazia neste navegador. Você poderá restaurá-la depois.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={closeClearConfirmation}
                  className="min-h-11 rounded-lg border border-border px-4 text-sm font-semibold hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={clearDemo}
                  className="min-h-11 rounded-lg bg-destructive px-4 text-sm font-semibold text-white hover:opacity-90"
                >
                  Limpar dados
                </button>
              </div>
            </div>
          </section>
        ) : null}

        <div className="mx-auto max-w-6xl p-4 sm:p-8">
          <p className="mb-6 text-xs text-muted-foreground lg:hidden">
            {DEMO_DISCLOSURE}
          </p>
          {view === "overview" ? (
            <DemoOverview
              data={data}
              metrics={metrics}
              onComplete={completeNext}
              onNavigate={setView}
              onReset={resetDemo}
            />
          ) : null}
          {view === "appointments" ? (
            <DemoAppointments items={data.appointments} onReset={resetDemo} />
          ) : null}
          {view === "clients" ? (
            <DemoClients data={data} onReset={resetDemo} />
          ) : null}
          {view === "services" ? (
            <DemoServices data={data} onReset={resetDemo} />
          ) : null}
        </div>
      </main>
    </div>
  );
}
