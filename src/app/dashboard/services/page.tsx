import Link from "next/link";
import { Plus, Clock, Pencil, Trash2, Briefcase } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { deleteServiceAction } from "./actions";

export default async function ServicesPage() {
  const supabase = await createSupabaseServerClient();

  const { data: services } = await supabase
    .from("services")
    .select("id, name, description, duration_min, price_cents, active, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 sm:p-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            What you sell, how long it takes, what it costs.
          </p>
        </div>
        <Link
          href="/dashboard/services/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New service
        </Link>
      </header>

      {!services || services.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.id}
              className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5"
            >
              <header className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{s.name}</h2>
                  {!s.active && (
                    <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/dashboard/services/${s.id}/edit`}
                    className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label={`Edit ${s.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <form action={deleteServiceAction}>
                    <input type="hidden" name="id" value={s.id} />
                    <button
                      type="submit"
                      className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                      aria-label={`Delete ${s.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </header>

              {s.description && (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {s.description}
                </p>
              )}

              <footer className="mt-auto flex items-center justify-between border-t border-border pt-3 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {s.duration_min} min
                </span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(s.price_cents / 100)}
                </span>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
      <Briefcase className="mx-auto h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">No services yet</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Add the services you offer so you can schedule them for clients.
      </p>
      <Link
        href="/dashboard/services/new"
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        <Plus className="h-4 w-4" /> Add your first service
      </Link>
    </div>
  );
}
