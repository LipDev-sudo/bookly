import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ServiceForm } from "../../_components/service-form";
import { updateServiceAction } from "../../actions";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: service } = await supabase
    .from("services")
    .select("id, name, description, duration_min, price_cents, active")
    .eq("id", id)
    .maybeSingle();

  if (!service) notFound();

  return (
    <div className="p-6 sm:p-10">
      <Link
        href="/dashboard/services"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para serviços
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold">Editar serviço</h1>
        <p className="mt-1 text-sm text-muted-foreground">{service.name}</p>
      </header>

      <div className="max-w-xl rounded-lg border border-border bg-card p-6">
        <ServiceForm
          action={updateServiceAction}
          hiddenId={service.id}
          defaults={{
            name: service.name,
            description: service.description,
            duration_min: service.duration_min,
            price: service.price_cents / 100,
            active: service.active,
          }}
          submitLabel="Salvar alterações"
          pendingLabel="Salvando..."
        />
      </div>
    </div>
  );
}
