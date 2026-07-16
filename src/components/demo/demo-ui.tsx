import { CalendarDays, type LucideIcon } from "lucide-react";
import type { DemoAppointment } from "@/lib/demo-data";

export const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const STATUS_LABEL = {
  scheduled: "Agendado",
  completed: "Concluído",
  canceled: "Cancelado",
} as const;

const STATUS_CLASS = {
  scheduled:
    "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  completed:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  canceled: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200",
} as const;

export function AppointmentRow({
  item,
  detailed = false,
}: {
  item: DemoAppointment;
  detailed?: boolean;
}) {
  return (
    <article className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-semibold">{item.client}</p>
        <p className="truncate text-sm text-muted-foreground">{item.service}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-muted-foreground">{item.startsAt}</span>
        {detailed ? (
          <span className="font-semibold">{currency.format(item.price)}</span>
        ) : null}
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASS[item.status]}`}
        >
          {STATUS_LABEL[item.status]}
        </span>
      </div>
    </article>
  );
}

export function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
    </article>
  );
}

export function EmptyState({
  title,
  description,
  onReset,
}: {
  title: string;
  description: string;
  onReset: () => void;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-8 text-center sm:p-10">
      <CalendarDays className="mx-auto h-9 w-9 text-muted-foreground" />
      <h3 className="mt-4 font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Restaurar dados fictícios
      </button>
    </div>
  );
}

export function DemoSkeleton() {
  return (
    <main
      className="min-h-screen bg-background p-6"
      aria-busy="true"
      aria-label="Carregando demonstração"
    >
      <div className="mx-auto max-w-6xl animate-pulse space-y-6">
        <div className="h-12 w-52 rounded-lg bg-muted" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-28 rounded-2xl bg-muted" />
          ))}
        </div>
        <div className="h-72 rounded-2xl bg-muted" />
      </div>
    </main>
  );
}
