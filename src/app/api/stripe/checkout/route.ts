import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const PRICE_ID = "price_1TKTj9AWFFFF8w2gRhlVno3E";

export async function POST() {
  let stripe;
  try {
    stripe = getStripe();
  } catch (error) {
    const message = error instanceof Error ? error.message : "A Stripe está indisponível.";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Conta não autenticada" }, { status: 401 });
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id, stripe_customer_id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!business) {
    return NextResponse.json({ error: "Negócio não encontrado" }, { status: 404 });
  }

  // Reuse or create Stripe customer
  let customerId = business.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { business_id: business.id, supabase_user_id: user.id },
    });
    customerId = customer.id;

    await supabase
      .from("businesses")
      .update({ stripe_customer_id: customerId })
      .eq("id", business.id);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: PRICE_ID, quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgraded=1`,
    cancel_url: `${appUrl}/dashboard/billing`,
    metadata: { business_id: business.id },
  });

  return NextResponse.json({ url: session.url });
}
