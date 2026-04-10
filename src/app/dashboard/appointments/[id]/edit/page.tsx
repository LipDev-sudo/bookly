import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AppointmentForm } from "../../_components/appointment-form";
import { updateAppointmentAction } from "../../actions";

export default async function EditAppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [
    { data: appointment },
    { data: clients },
    { data: services },
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, client_id, service_id, starts_at, status, notes")
      .eq("id", id)
      .maybeSingle(),
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

  if (!appointment) notFound();

  const startsAt = new Date(appointment.starts_at);
  const date = startsAt.toISOString().slice(0, 10);
  const time = startsAt.toTimeString().slice(0, 5);

  return (
    <div className="p-6 sm:p-10">
      <Link
        href="/dashboard/appointments"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to appointments
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold">Edit appointment</h1>
      </header>

      <div className="max-w-xl rounded-lg border border-border bg-card p-6">
        <AppointmentForm
          action={updateAppointmentAction}
          hiddenId={appointment.id}
          clients={clients ?? []}
          services={services ?? []}
          defaults={{
            client_id: appointment.client_id,
            service_id: appointment.service_id,
            date,
            time,
            notes: appointment.notes,
            status: appointment.status,
          }}
          submitLabel="Save changes"
          pendingLabel="Saving..."
        />
      </div>
    </div>
  );
}
