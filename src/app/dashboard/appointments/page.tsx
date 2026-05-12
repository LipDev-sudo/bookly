import Link from "next/link";
import {
  Plus,
  CalendarDays,
  Clock,
  Pencil,
  User,
  Briefcase,
} from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { deleteAppointmentAction } from "./actions";
import { DeleteButton } from "@/components/delete-button";
import { FlashToast } from "@/components/flash-toast";

const STATUS_BADGE: Record<string, string> = {
  scheduled:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  canceled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  no_show:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ toast?: string }>;
}) {
  const { toast } = await searchParams;

  const supabase = await createSupabaseServerClient();

  const { data: appointments } = await supabase
    .from("appointments")
    .select(
      `id, starts_at, ends_at, status, notes,
       clients ( name ),
       services ( name, price_cents, duration_min )`,
    )
    .order("starts_at", { ascending: false })
    .limit(100);

  return (
    <div className="p-6 sm:p-10">
      <FlashToast message={toast} />

      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All past and upcoming bookings.
          </p>
        </div>
        <Link
          href="/dashboard/appointments/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New appointment
        </Link>
      </header>

      {!appointments || appointments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Date &amp; time</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium sr-only">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {appointments.map((a) => {
                const start = new Date(a.starts_at);
                const client = a.clients as unknown as { name: string } | null;
                const service = a.services as unknown as {
                  name: string;
                  price_cents: number;
                  duration_min: number;
                } | null;

                return (
                  <tr key={a.id} className="transition-colors hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {start.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {start.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        {client?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                        {service?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {service?.duration_min ?? "?"} min
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {service
                        ? formatCurrency(service.price_cents / 100)
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[a.status] ?? ""}`}
                      >
                        {a.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/dashboard/appointments/${a.id}/edit`}
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          aria-label="Edit appointment"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteButton
                          action={deleteAppointmentAction}
                          id={a.id}
                          label={`appointment on ${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
      <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">No appointments yet</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Schedule your first appointment to get started.
      </p>
      <Link
        href="/dashboard/appointments/new"
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Plus className="h-4 w-4" /> Schedule appointment
      </Link>
    </div>
  );
}
