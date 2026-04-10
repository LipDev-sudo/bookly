import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AppointmentForm } from "../_components/appointment-form";
import { createAppointmentAction } from "../actions";

export default async function NewAppointmentPage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: clients }, { data: services }] = await Promise.all([
    supabase
      .from("clients")
      .select("id, name")
      .order("name", { ascending: true }),
    supabase
      .from("services")
      .select("id, name, duration_min")
      .eq("active", true)
      .order("name", { ascending: true }),
  ]);

  return (
    <div className="p-6 sm:p-10">
      <Link
        href="/dashboard/appointments"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to appointments
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold">New appointment</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a client, service, date and time.
        </p>
      </header>

      {(!clients || clients.length === 0) && (
        <div className="mb-6 rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground">
          You need to{" "}
          <Link href="/dashboard/clients/new" className="text-primary underline">
            add a client
          </Link>{" "}
          before scheduling an appointment.
        </div>
      )}

      {(!services || services.length === 0) && (
        <div className="mb-6 rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground">
          You need to{" "}
          <Link
            href="/dashboard/services/new"
            className="text-primary underline"
          >
            create a service
          </Link>{" "}
          before scheduling an appointment.
        </div>
      )}

      <div className="max-w-xl rounded-lg border border-border bg-card p-6">
        <AppointmentForm
          action={createAppointmentAction}
          clients={clients ?? []}
          services={services ?? []}
          submitLabel="Schedule"
          pendingLabel="Scheduling..."
        />
      </div>
    </div>
  );
}
