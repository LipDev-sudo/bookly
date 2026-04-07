import { CalendarDays, Users, Briefcase, DollarSign } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardOverviewPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Pull business + counts in parallel
  const [{ data: business }, { count: clientsCount }, { count: servicesCount }, { count: appointmentsCount }] =
    await Promise.all([
      supabase.from("businesses").select("name, plan").eq("owner_id", user!.id).maybeSingle(),
      supabase.from("clients").select("*", { count: "exact", head: true }),
      supabase.from("services").select("*", { count: "exact", head: true }),
      supabase.from("appointments").select("*", { count: "exact", head: true }),
    ]);

  // Mock revenue for now — will compute from appointments later
  const monthlyRevenue = 0;

  return (
    <div className="p-6 sm:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back to {business?.name ?? "your business"}.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<DollarSign className="h-5 w-5 text-primary" />}
          label="Revenue this month"
          value={formatCurrency(monthlyRevenue)}
        />
        <StatCard
          icon={<CalendarDays className="h-5 w-5 text-primary" />}
          label="Appointments"
          value={String(appointmentsCount ?? 0)}
        />
        <StatCard
          icon={<Users className="h-5 w-5 text-primary" />}
          label="Clients"
          value={String(clientsCount ?? 0)}
        />
        <StatCard
          icon={<Briefcase className="h-5 w-5 text-primary" />}
          label="Services"
          value={String(servicesCount ?? 0)}
        />
      </div>

      <section className="mt-8 rounded-lg border border-border bg-card p-8 text-center">
        <h2 className="text-lg font-semibold">You&apos;re all set up.</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          The next features (calendar, CRUD pages, charts and Stripe upgrade)
          will land in the upcoming commits. Database, auth and multi-tenant
          isolation are already wired.
        </p>
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
