import {
  BarChart3,
  CalendarDays,
  Check,
  ChevronRight,
  Users,
} from "lucide-react";
import type { DemoMetrics, DemoState } from "@/lib/demo-data";
import type { DemoView } from "./demo-navigation";
import { AppointmentRow, EmptyState, MetricCard, currency } from "./demo-ui";

type DemoOverviewProps = {
  data: DemoState;
  metrics: DemoMetrics;
  onComplete: () => void;
  onNavigate: (view: DemoView) => void;
  onReset: () => void;
};

export function DemoOverview({
  data,
  metrics,
  onComplete,
  onNavigate,
  onReset,
}: DemoOverviewProps) {
  const scheduled = data.appointments.filter(
    (appointment) => appointment.status === "scheduled",
  );
  const total = data.appointments.length;
  const completedPercent = total
    ? Math.round((metrics.completed / total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold text-primary">Operação de hoje</p>
        <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
          Visão geral do atendimento
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Indicadores calculados somente a partir dos registros fictícios abaixo.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          icon={CalendarDays}
          label="Horários agendados"
          value={String(metrics.scheduled)}
        />
        <MetricCard
          icon={Users}
          label="Clientes cadastrados"
          value={String(data.clients.length)}
        />
        <MetricCard
          icon={BarChart3}
          label="Receita concluída"
          value={currency.format(metrics.revenue)}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <p className="text-sm text-muted-foreground">Andamento dos registros</p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <h3 className="text-xl font-bold">
              {metrics.completed} de {total} concluídos
            </h3>
            <span className="text-sm font-semibold text-primary">
              {completedPercent}%
            </span>
          </div>
          <div
            className="mt-5 h-2 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label="Atendimentos concluídos"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={metrics.completed}
          >
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${completedPercent}%` }}
            />
          </div>
          <dl className="mt-7 grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm">
            <div>
              <dt className="text-muted-foreground">Concluídos</dt>
              <dd className="mt-1 text-lg font-bold text-emerald-700 dark:text-emerald-300">
                {metrics.completed}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Cancelados</dt>
              <dd className="mt-1 text-lg font-bold text-red-700 dark:text-red-300">
                {metrics.canceled}
              </dd>
            </div>
          </dl>
        </article>

        <article className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold">Próximos horários</h3>
            <button
              type="button"
              onClick={() => onNavigate("appointments")}
              className="inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline"
            >
              Ver agenda <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          {scheduled.length ? (
            <div className="mt-2 divide-y divide-border">
              {scheduled.slice(0, 3).map((item) => (
                <AppointmentRow key={item.id} item={item} />
              ))}
              <button
                type="button"
                onClick={onComplete}
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold hover:bg-muted"
              >
                <Check className="h-4 w-4" /> Concluir próximo atendimento
              </button>
            </div>
          ) : (
            <EmptyState
              title="Nenhum horário agendado"
              description="Restaure os registros fictícios para continuar explorando o fluxo."
              onReset={onReset}
            />
          )}
        </article>
      </section>
    </div>
  );
}
