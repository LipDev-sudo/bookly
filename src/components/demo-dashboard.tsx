"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronRight,
  RotateCcw,
  Trash2,
  Users,
} from "lucide-react";
import {
  createDemoState,
  DEMO_STORAGE_KEY,
  type DemoAppointment,
  type DemoState,
} from "@/lib/demo-data";

type DemoView = "overview" | "appointments" | "clients" | "services";

const views = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "clients", label: "Clients", icon: Users },
  { id: "services", label: "Services", icon: BriefcaseBusiness },
] as const;

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const DEFAULT_DEMO_JSON = JSON.stringify(createDemoState());
const DEMO_CHANGE_EVENT = "bookly-demo-change";

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
  const serialized = useSyncExternalStore(subscribeToDemo, getDemoSnapshot, () => DEFAULT_DEMO_JSON);
  const { data, error } = useMemo(() => {
    try {
      return { data: JSON.parse(serialized) as DemoState, error: null };
    } catch {
      return { data: null, error: "The saved demo data could not be loaded." };
    }
  }, [serialized]);

  const revenue = useMemo(
    () => data?.appointments.filter((item) => item.status === "completed").reduce((total, item) => total + item.price, 0) ?? 0,
    [data],
  );

  function resetDemo() {
    const next = createDemoState();
    updateDemoStorage(next);
    setView("overview");
  }

  function clearDemo() {
    updateDemoStorage({ appointments: [], clients: [], services: [] });
  }

  function completeNextAppointment() {
    if (!data) return;
    const nextId = data.appointments.find((item) => item.status === "scheduled")?.id;
    if (!nextId) return;
    updateDemoStorage({
      ...data,
      appointments: data.appointments.map((item) => item.id === nextId ? { ...item, status: "completed" } : item),
    });
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-background p-6">
        <section className="w-full max-w-md rounded-xl border border-destructive/30 bg-card p-8 text-center" role="alert">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-4 text-xl font-bold">Demo unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <button onClick={resetDemo} className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Restore demo data
          </button>
        </section>
      </main>
    );
  }

  if (!data) return <DemoSkeleton />;

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="hidden border-r border-border bg-card lg:flex lg:flex-col">
        <Link href="/" className="flex h-20 items-center gap-3 border-b border-border px-6 font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground"><CalendarDays className="h-5 w-5" /></span>
          <span>Bookly</span>
        </Link>
        <nav className="flex-1 space-y-1 p-4" aria-label="Demo navigation">
          {views.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setView(id)} aria-current={view === id ? "page" : undefined} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${view === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </nav>
        <div className="border-t border-border p-4 text-xs text-muted-foreground">
          <span className="mb-2 inline-flex rounded-full bg-muted px-2.5 py-1 font-semibold text-foreground">Local demo</span>
          <p>Fictional data stored only in this browser.</p>
        </div>
      </aside>

      <main className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 py-4 backdrop-blur sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Interactive demo</p>
              <h1 className="text-xl font-bold sm:text-2xl">Studio Aurora</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={clearDemo} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium hover:bg-muted" aria-label="Clear fictional demo data"><Trash2 className="h-4 w-4" /><span className="hidden sm:inline">Clear</span></button>
              <button onClick={resetDemo} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground hover:opacity-90"><RotateCcw className="h-4 w-4" />Reset demo</button>
            </div>
          </div>
          <nav className="mx-auto mt-4 grid max-w-6xl grid-cols-2 gap-2 sm:grid-cols-4 lg:hidden" aria-label="Demo navigation">
            {views.map(({ id, label }) => <button key={id} onClick={() => setView(id)} aria-pressed={view === id} className={`rounded-full px-3 py-2 text-sm font-medium ${view === id ? "bg-foreground text-background" : "border border-border bg-card"}`}>{label}</button>)}
          </nav>
        </header>

        <div className="mx-auto max-w-6xl p-4 sm:p-8">
          {view === "overview" && <Overview data={data} revenue={revenue} onComplete={completeNextAppointment} onNavigate={setView} onReset={resetDemo} />}
          {view === "appointments" && <Appointments items={data.appointments} onReset={resetDemo} />}
          {view === "clients" && <Clients data={data} onReset={resetDemo} />}
          {view === "services" && <Services data={data} onReset={resetDemo} />}
        </div>
      </main>
    </div>
  );
}

function DemoSkeleton() {
  return <main className="min-h-screen bg-background p-6" aria-busy="true" aria-label="Loading demo"><div className="mx-auto max-w-6xl animate-pulse space-y-6"><div className="h-12 w-52 rounded-lg bg-muted" /><div className="grid gap-4 sm:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="h-28 rounded-xl bg-muted" />)}</div><div className="h-72 rounded-xl bg-muted" /></div></main>;
}

function Overview({ data, revenue, onComplete, onNavigate, onReset }: { data: DemoState; revenue: number; onComplete: () => void; onNavigate: (view: DemoView) => void; onReset: () => void }) {
  const scheduled = data.appointments.filter((item) => item.status === "scheduled");
  const maxRevenue = Math.max(revenue, 1);
  const bars = [0.35, 0.48, 0.42, 0.68, 0.58, 1];

  return <div className="space-y-6">
    <section><h2 className="text-2xl font-bold sm:text-3xl">Business overview</h2><p className="mt-1 text-sm text-muted-foreground">A safe, interactive preview using fictional data.</p></section>
    <section className="grid gap-4 sm:grid-cols-3">
      <Metric icon={CalendarDays} label="Scheduled" value={String(scheduled.length)} />
      <Metric icon={Users} label="Clients" value={String(data.clients.length)} />
      <Metric icon={BarChart3} label="Demo revenue" value={currency.format(revenue)} />
    </section>
    <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
      <article className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-end justify-between gap-3"><div><p className="text-sm text-muted-foreground">Completed services</p><h3 className="mt-1 text-xl font-bold">Revenue trend</h3></div><span className="text-sm font-semibold text-primary">{currency.format(maxRevenue)}</span></div>
        <div className="mt-8 flex h-44 items-end gap-3" aria-label="Fictional revenue chart">{bars.map((bar, index) => <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="w-full rounded-t-md bg-primary/80" style={{ height: `${bar * 100}%`, minHeight: 12 }} /><span className="text-[11px] text-muted-foreground">M{index + 1}</span></div>)}</div>
      </article>
      <article className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between"><h3 className="text-lg font-bold">Next appointments</h3><button onClick={() => onNavigate("appointments")} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">View all<ChevronRight className="h-4 w-4" /></button></div>
        {scheduled.length ? <div className="mt-4 space-y-3">{scheduled.slice(0, 3).map((item) => <AppointmentRow key={item.id} item={item} />)}<button onClick={onComplete} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted"><Check className="h-4 w-4" />Complete next appointment</button></div> : <Empty title="No scheduled appointments" description="Reset the demo to restore sample bookings." onReset={onReset} />}
      </article>
    </section>
  </div>;
}

function Metric({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return <article className="rounded-xl border border-border bg-card p-5"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Icon className="h-4 w-4 text-primary" />{label}</div><p className="mt-3 text-2xl font-bold">{value}</p></article>;
}

function Appointments({ items, onReset }: { items: DemoAppointment[]; onReset: () => void }) {
  return <section><h2 className="text-2xl font-bold sm:text-3xl">Appointments</h2><p className="mt-1 text-sm text-muted-foreground">Upcoming and completed fictional bookings.</p>{items.length ? <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card"><div className="divide-y divide-border">{items.map((item) => <AppointmentRow key={item.id} item={item} detailed />)}</div></div> : <Empty title="No appointments yet" description="The local demo is empty. Restore the sample data to continue exploring." onReset={onReset} />}</section>;
}

function AppointmentRow({ item, detailed = false }: { item: DemoAppointment; detailed?: boolean }) {
  return <article className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="font-semibold">{item.client}</p><p className="text-sm text-muted-foreground">{item.service}</p></div><div className="flex flex-wrap items-center gap-3 text-sm"><span className="text-muted-foreground">{item.startsAt}</span>{detailed && <span className="font-semibold">{currency.format(item.price)}</span>}<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300" : item.status === "canceled" ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300" : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"}`}>{item.status}</span></div></article>;
}

function Clients({ data, onReset }: { data: DemoState; onReset: () => void }) {
  return <section><h2 className="text-2xl font-bold sm:text-3xl">Clients</h2><p className="mt-1 text-sm text-muted-foreground">Contact details are fictional and used only for demonstration.</p>{data.clients.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.clients.map((client) => <article key={client.id} className="rounded-xl border border-border bg-card p-5"><div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 font-bold text-primary">{client.name.charAt(0)}</div><h3 className="mt-4 font-bold">{client.name}</h3><p className="mt-1 truncate text-sm text-muted-foreground">{client.email}</p><p className="text-sm text-muted-foreground">{client.phone}</p><p className="mt-4 border-t border-border pt-3 text-xs font-semibold text-muted-foreground">{client.visits} recorded visits</p></article>)}</div> : <Empty title="No clients yet" description="Restore the sample records to preview the client CRM." onReset={onReset} />}</section>;
}

function Services({ data, onReset }: { data: DemoState; onReset: () => void }) {
  return <section><h2 className="text-2xl font-bold sm:text-3xl">Services</h2><p className="mt-1 text-sm text-muted-foreground">A sample catalog with duration, price and availability.</p>{data.services.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.services.map((service) => <article key={service.id} className="rounded-xl border border-border bg-card p-5"><div className="flex items-start justify-between gap-3"><h3 className="font-bold">{service.name}</h3><span className={`rounded-full px-2 py-1 text-xs font-semibold ${service.active ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300" : "bg-muted text-muted-foreground"}`}>{service.active ? "Active" : "Inactive"}</span></div><div className="mt-8 flex items-end justify-between"><span className="text-sm text-muted-foreground">{service.duration} min</span><span className="text-xl font-bold">{currency.format(service.price)}</span></div></article>)}</div> : <Empty title="No services yet" description="Restore the demo to preview the service catalog." onReset={onReset} />}</section>;
}

function Empty({ title, description, onReset }: { title: string; description: string; onReset: () => void }) {
  return <div className="mt-6 rounded-xl border border-dashed border-border bg-card p-10 text-center"><CalendarDays className="mx-auto h-9 w-9 text-muted-foreground" /><h3 className="mt-4 font-bold">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p><button onClick={onReset} className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Restore sample data</button></div>;
}
