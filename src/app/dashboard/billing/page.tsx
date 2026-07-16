import { Check, Sparkles } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UpgradeButton } from "./_components/upgrade-button";

export default async function BillingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("plan")
    .eq("owner_id", user!.id)
    .maybeSingle();

  const isPro = business?.plan === "pro";

  return (
    <div className="p-6 sm:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Plano e cobrança</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consulte o plano e teste a integração protegida com o Stripe.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 max-w-3xl">
        {/* Free plan */}
        <div
          className={`rounded-lg border p-6 ${
            !isPro
              ? "border-primary bg-primary/5"
              : "border-border bg-card"
          }`}
        >
          <h2 className="text-xl font-bold">Gratuito</h2>
          <p className="mt-1 text-3xl font-bold">
            R$ 0<span className="text-base font-normal text-muted-foreground">/mês</span>
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <Li>Agenda, clientes e serviços</Li>
            <Li>Visão geral do negócio</Li>
            <Li>Dados isolados por conta</Li>
          </ul>
          {!isPro && (
            <p className="mt-6 rounded-md bg-primary/10 px-3 py-2 text-center text-sm font-medium text-primary">
              Plano atual
            </p>
          )}
        </div>

        {/* Pro plan */}
        <div
          className={`rounded-lg border p-6 ${
            isPro
              ? "border-primary bg-primary/5"
              : "border-border bg-card"
          }`}
        >
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Pro</h2>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-1 text-3xl font-bold">
            US$ 19<span className="text-base font-normal text-muted-foreground">/mês</span>
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <Li>Checkout Stripe em modo de teste</Li>
            <Li>Webhook assinado para atualização do plano</Li>
            <Li>Relatório de receita por atendimentos concluídos</Li>
          </ul>
          {isPro ? (
            <p className="mt-6 rounded-md bg-primary/10 px-3 py-2 text-center text-sm font-medium text-primary">
              Plano atual
            </p>
          ) : (
            <div className="mt-6">
              <UpgradeButton />
            </div>
          )}
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Demonstração técnica: o checkout utiliza o modo de teste do Stripe e não realiza cobranças reais.
      </p>
    </div>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <Check className="h-4 w-4 text-primary" />
      {children}
    </li>
  );
}
