import Link from "next/link";
import { Plus, Mail, Phone, Pencil, Trash2, Users } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { deleteClientAction } from "./actions";

export default async function ClientsPage() {
  const supabase = await createSupabaseServerClient();

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, email, phone, notes, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 sm:p-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your client list and contact info.
          </p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New client
        </Link>
      </header>

      {!clients || clients.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <article
              key={c.id}
              className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5"
            >
              <header className="flex items-start justify-between">
                <h2 className="text-lg font-semibold">{c.name}</h2>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/dashboard/clients/${c.id}/edit`}
                    className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label={`Edit ${c.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <form action={deleteClientAction}>
                    <input type="hidden" name="id" value={c.id} />
                    <button
                      type="submit"
                      className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                      aria-label={`Delete ${c.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </header>

              <div className="space-y-1.5 text-sm text-muted-foreground">
                {c.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{c.email}</span>
                  </div>
                )}
                {c.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{c.phone}</span>
                  </div>
                )}
              </div>

              {c.notes && (
                <p className="line-clamp-3 border-t border-border pt-3 text-xs text-muted-foreground">
                  {c.notes}
                </p>
              )}
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
      <Users className="mx-auto h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">No clients yet</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Add your first client to start tracking appointments and history.
      </p>
      <Link
        href="/dashboard/clients/new"
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        <Plus className="h-4 w-4" /> Add your first client
      </Link>
    </div>
  );
}
