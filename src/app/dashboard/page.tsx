import Link from "next/link";
import {
  CalendarDays,
  Users,
  Briefcase,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import {
  RevenueChart,
  type MonthlyRevenue,
} from "./_components/revenue-chart";

const MONTH_NAMES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export default async function DashboardOverviewPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Pull business, counts, and completed appointments in parallel
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();

  const [
    { data: business },
    { count: clientsCount },
    { count: servicesCount },
    { count: appointmentsCount },
    { data: completedThisMonth },
    { data: completedThisYear },
    { data: upcomingAppointments },
  ] = await Promise.all([
    supabase.from("businesses").select("name, plan").eq("owner_id", user!.id).maybeSingle(),
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("appointments").select("*", { count: "exact", head: true }),
    supabase
      .from("appointments")
      .select("services ( price_cents )")
      .eq("status", "completed")
      .gte("starts_at", startOfMonth),
    supabase
      .from("appointments")
      .select("starts_at, services ( price_cents )")
      .eq("status", "completed")
      .gte("starts_at", startOfYear),
    supabase
      .from("appointments")
      .select("id, starts_at, clients ( name ), services ( name )")
      .eq("status", "scheduled")
      .gte("starts_at", now.toISOString())
      .order("starts_at", { ascending: true })
      .limit(5),
  ]);

  // Revenue this month
  const monthlyRevenue = (completedThisMonth ?? []).reduce((sum, a) => {
    const svc = a.services as unknown as { price_cents: number } | null;
    return sum + (svc?.price_cents ?? 0);
  }, 0) / 100;

  // Monthly revenue chart data (group by month for current year)
  const revenueByMonth: Record<number, number> = {};
  for (const a of completedThisYear ?? []) {
    const month = new Date(a.starts_at).getMonth();
    const svc = a.services as unknown as { price_cents: number } | null;
    revenueByMonth[month] = (revenueByMonth[month] ?? 0) + (svc?.price_cents ?? 0);
  }

  const chartData: MonthlyRevenue[] = [];
  for (let m = 0; m <= now.getMonth(); m++) {
    chartData.push({
      month: MONTH_NAMES[m],
      revenue: (revenueByMonth[m] ?? 0) / 100,
    });
  }

  return (
    <div className="p-6 sm:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Visão geral</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Acompanhe o dia de {business?.name ?? "seu negócio"}.
        </p>
      </header>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<DollarSign className="h-5 w-5 text-primary" />}
          label="Receita no mês"
          value={formatCurrency(monthlyRevenue)}
        />
        <StatCard
          icon={<CalendarDays className="h-5 w-5 text-primary" />}
          label="Agendamentos"
          value={String(appointmentsCount ?? 0)}
        />
        <StatCard
          icon={<Users className="h-5 w-5 text-primary" />}
          label="Clientes"
          value={String(clientsCount ?? 0)}
        />
        <StatCard
          icon={<Briefcase className="h-5 w-5 text-primary" />}
          label="Serviços"
          value={String(servicesCount ?? 0)}
        />
      </div>

      {/* Revenue chart */}
      <section className="mt-8 rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Receita — {now.getFullYear()}
        </h2>
        <RevenueChart data={chartData} />
      </section>

      {/* Upcoming appointments */}
      <section className="mt-8 rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Próximos horários</h2>
          <Link
            href="/dashboard/appointments"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Ver agenda <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {!upcomingAppointments || upcomingAppointments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum horário futuro.{" "}
            <Link
              href="/dashboard/appointments/new"
              className="text-primary hover:underline"
            >
              Agendar atendimento
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {upcomingAppointments.map((a) => {
              const start = new Date(a.starts_at);
              const client = a.clients as unknown as { name: string } | null;
              const service = a.services as unknown as { name: string } | null;
              return (
                <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <span className="font-medium">{client?.name ?? "—"}</span>
                    <span className="mx-2 text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      {service?.name ?? "—"}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {start.toLocaleDateString("pt-BR", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    {start.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
