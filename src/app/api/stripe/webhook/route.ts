import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 503 },
    );
  }

  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe is unavailable.";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const businessId = session.metadata?.business_id;
      if (businessId && session.subscription) {
        await supabase
          .from("businesses")
          .update({
            plan: "pro",
            stripe_subscription_id: String(session.subscription),
          })
          .eq("id", businessId);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      // Find business by stripe_subscription_id and downgrade
      await supabase
        .from("businesses")
        .update({ plan: "free", stripe_subscription_id: null })
        .eq("stripe_subscription_id", sub.id);
      break;
    }

    default:
      // Unhandled event type — ignore silently
      break;
  }

  return NextResponse.json({ received: true });
}
