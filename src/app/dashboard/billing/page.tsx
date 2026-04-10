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
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your subscription plan.
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
          <h2 className="text-xl font-bold">Free</h2>
          <p className="mt-1 text-3xl font-bold">
            $0<span className="text-base font-normal text-muted-foreground">/mo</span>
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <Li>Up to 50 clients</Li>
            <Li>Unlimited appointments</Li>
            <Li>Basic dashboard</Li>
          </ul>
          {!isPro && (
            <p className="mt-6 rounded-md bg-primary/10 px-3 py-2 text-center text-sm font-medium text-primary">
              Current plan
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
            $19<span className="text-base font-normal text-muted-foreground">/mo</span>
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <Li>Unlimited clients</Li>
            <Li>Unlimited appointments</Li>
            <Li>Revenue reports & charts</Li>
            <Li>Priority support</Li>
            <Li>Custom branding (soon)</Li>
          </ul>
          {isPro ? (
            <p className="mt-6 rounded-md bg-primary/10 px-3 py-2 text-center text-sm font-medium text-primary">
              Current plan
            </p>
          ) : (
            <div className="mt-6">
              <UpgradeButton />
            </div>
          )}
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Payments are processed securely via Stripe. You can cancel anytime.
        {!isPro && " This is running in test mode — no real charges."}
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
