import Link from "next/link";
import { CalendarDays, Users, BarChart3, ArrowRight } from "lucide-react";
import { DemoButton } from "@/components/demo-button";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Bookly</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <span className="mb-4 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          Built for service businesses
        </span>
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
          Booking & client management,{" "}
          <span className="text-primary">made simple.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Bookly is a lightweight scheduling and CRM for barbershops, salons,
          personal trainers and any small service business. Stop juggling
          spreadsheets and DMs.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
          >
            Start free <ArrowRight className="h-4 w-4" />
          </Link>
          <DemoButton />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 sm:grid-cols-3">
        <Feature
          icon={<CalendarDays className="h-6 w-6 text-primary" />}
          title="Smart scheduling"
          desc="Drag-and-drop calendar, recurring slots, automatic conflict detection."
        />
        <Feature
          icon={<Users className="h-6 w-6 text-primary" />}
          title="Client CRM"
          desc="Notes, history, contact info — every appointment links back to a client."
        />
        <Feature
          icon={<BarChart3 className="h-6 w-6 text-primary" />}
          title="Revenue insights"
          desc="See your monthly revenue, top clients and busiest hours at a glance."
        />
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Bookly. Built by LipDev.</span>
          <Link
            href="https://lipdev-portfolio.vercel.app"
            className="hover:text-foreground"
          >
            Portfolio
          </Link>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-3">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
