import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Users,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { DemoButton } from "@/components/demo-button";
import { DEMO_DISCLOSURE, SITE_SLOGAN } from "@/lib/site";

const todayAppointments = [
  { time: "14:00", client: "Marina Costa", service: "Corte e finalização" },
  { time: "15:30", client: "Beatriz Nunes", service: "Escova modelada" },
  { time: "17:00", client: "Juliana Alves", service: "Hidratação" },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-background/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
          <Link
            href="/"
            aria-label="Horavia — início"
            className="inline-flex min-h-11 items-center"
          >
            <BrandMark />
          </Link>
          <nav
            className="flex items-center gap-2 text-sm"
            aria-label="Navegação principal"
          >
            <Link
              href="/demo"
              className="hidden min-h-11 items-center rounded-lg px-3 font-medium text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex"
            >
              Ver demonstração
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-semibold hover:bg-muted"
            >
              Acessar conta
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
          <div>
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              Agenda e gestão para negócios de serviço
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-[-0.04em] sm:text-6xl">
              Sua agenda em ordem. Seu atendimento em movimento.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              A Horavia reúne horários, clientes, serviços e andamento do dia em
              um espaço claro para quem precisa atender bem sem perder tempo com
              controles dispersos.
            </p>
            <p className="mt-4 font-semibold text-foreground">{SITE_SLOGAN}</p>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
              <DemoButton />
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg px-5 font-semibold text-foreground hover:bg-muted"
              >
                Entrar na área segura <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Sem cadastro
                para explorar
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" /> {DEMO_DISCLOSURE}
              </span>
            </div>
          </div>

          <div
            className="rounded-2xl border border-border bg-card p-4 shadow-[0_24px_70px_-36px_hsl(174_62%_24%/0.45)] sm:p-6"
            aria-label="Prévia da agenda do Estúdio Aurora"
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  Hoje
                </p>
                <p className="mt-1 font-bold">Estúdio Aurora</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                Agenda aberta
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <PreviewMetric label="Agendados" value="3" />
              <PreviewMetric label="Concluídos" value="2" />
            </div>
            <div className="mt-5 space-y-2.5">
              {todayAppointments.map((appointment) => (
                <div
                  key={`${appointment.time}-${appointment.client}`}
                  className="grid grid-cols-[3.25rem_1fr] gap-3 rounded-xl border border-border bg-background p-3"
                >
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                    <Clock3 className="h-3.5 w-3.5" /> {appointment.time}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {appointment.client}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {appointment.service}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-muted/35">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:py-20">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm font-semibold text-primary">Fluxo essencial</p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.03em]">
                O dia de atendimento, sem ruído
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <Feature
                icon={<CalendarCheck2 className="h-6 w-6" />}
                title="Agenda operacional"
                description="Horários, duração e status reunidos para leitura rápida entre um atendimento e outro."
              />
              <Feature
                icon={<Users className="h-6 w-6" />}
                title="Histórico de clientes"
                description="Contatos e frequência de visitas conectados ao serviço que cada pessoa agenda."
              />
              <Feature
                icon={<BarChart3 className="h-6 w-6" />}
                title="Visão do andamento"
                description="Indicadores derivados dos próprios registros fictícios, sem métricas comerciais inventadas."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>Horavia — demonstração fictícia desenvolvida por LipDev.</span>
          <Link
            href="https://lipdev.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center font-medium hover:text-foreground"
          >
            Conhecer o desenvolvedor
          </Link>
        </div>
      </footer>
    </div>
  );
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
    </article>
  );
}
