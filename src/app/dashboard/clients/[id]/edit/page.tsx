import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ClientForm } from "../../_components/client-form";
import { updateClientAction } from "../../actions";

type Params = { id: string };

export default async function EditClientPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data: client } = await supabase
    .from("clients")
    .select("id, name, email, phone, notes")
    .eq("id", id)
    .maybeSingle();

  if (!client) notFound();

  return (
    <div className="p-6 sm:p-10">
      <Link
        href="/dashboard/clients"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to clients
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold">Edit client</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update {client.name}&apos;s information.
        </p>
      </header>

      <div className="max-w-xl rounded-lg border border-border bg-card p-6">
        <ClientForm
          action={updateClientAction}
          hiddenId={client.id}
          defaults={{
            name: client.name,
            email: client.email,
            phone: client.phone,
            notes: client.notes,
          }}
          submitLabel="Save changes"
          pendingLabel="Saving..."
        />
      </div>
    </div>
  );
}
