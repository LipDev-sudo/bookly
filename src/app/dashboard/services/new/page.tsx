import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ServiceForm } from "../_components/service-form";
import { createServiceAction } from "../actions";

export default function NewServicePage() {
  return (
    <div className="p-6 sm:p-10">
      <Link
        href="/dashboard/services"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para serviços
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold">Novo serviço</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Defina o atendimento, sua duração e o preço.
        </p>
      </header>

      <div className="max-w-xl rounded-lg border border-border bg-card p-6">
        <ServiceForm
          action={createServiceAction}
          submitLabel="Criar serviço"
          pendingLabel="Criando..."
        />
      </div>
    </div>
  );
}
