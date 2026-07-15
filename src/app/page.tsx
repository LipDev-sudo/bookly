import Link from "next/link";
import { ArrowRight, BarChart3, CalendarDays, CheckCircle2, Users } from "lucide-react";
import { DemoButton } from "@/components/demo-button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <CalendarDays className="h-6 w-6 text-primary" />
            <span className="text-lg">Bookly</span>
          </Link>
          <nav className="flex items-center gap-3 text-sm" aria-label="Main navigation">
            <Link href="/demo" className="hidden font-medium text-muted-foreground hover:text-foreground sm:inline">Live demo</Link>
            <Link href="/login" className="font-medium text-muted-foreground hover:text-foreground">Sign in</Link>
            <Link href="/signup" className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground hover:opacity-90">Get started</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 lg:grid-cols-[1fr_0.9fr] lg:py-24">
          <div>
            <span className="inline-flex rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Scheduling for service businesses</span>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">Run appointments and client relationships <span className="text-primary">in one place.</span></h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Bookly brings scheduling, client records, services and business performance into a focused workspace for small teams.</p>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">Start free <ArrowRight className="h-4 w-4" /></Link>
              <DemoButton />
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" />No account for demo</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" />Fictional local data</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-xl shadow-primary/5 sm:p-6" aria-label="Bookly dashboard preview">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div><p className="text-xs font-semibold uppercase tracking-wider text-primary">Today</p><p className="mt-1 font-bold">Studio overview</p></div>
              <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800 dark:bg-green-950 dark:text-green-300">Open</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3"><PreviewMetric label="Appointments" value="4" /><PreviewMetric label="Clients" value="28" /></div>
            <div className="mt-5 space-y-3">{["Marina Costa · 14:00", "Rafael Lima · 15:30", "Camila Rocha · 17:00"].map((item, index) => <div key={item} className="flex items-center gap-3 rounded-lg bg-muted p-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{index + 1}</span><span className="text-sm font-medium">{item}</span></div>)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="mb-8 max-w-2xl"><p className="text-sm font-semibold text-primary">Core workflow</p><h2 className="mt-2 text-3xl font-bold">Everything needed for the daily schedule</h2></div>
          <div className="grid gap-6 sm:grid-cols-3">
            <Feature icon={<CalendarDays className="h-6 w-6 text-primary" />} title="Smart scheduling" desc="Organize appointments, duration and status in a single calendar-ready workflow." />
            <Feature icon={<Users className="h-6 w-6 text-primary" />} title="Client CRM" desc="Keep contact details, notes and visit history connected to each booking." />
            <Feature icon={<BarChart3 className="h-6 w-6 text-primary" />} title="Business overview" desc="Review completed services and operational indicators without spreadsheet work." />
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Bookly. Built by LipDev.</span>
          <Link href="https://lipdev.vercel.app" target="_blank" rel="noreferrer" className="hover:text-foreground">Portfolio</Link>
        </div>
      </footer>
    </div>
  );
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-border p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>;
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return <article className="rounded-xl border border-border bg-card p-6"><div className="mb-3">{icon}</div><h3 className="mb-2 text-lg font-semibold">{title}</h3><p className="text-sm leading-6 text-muted-foreground">{desc}</p></article>;
}
