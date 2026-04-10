import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  if (webhookSecret && sig) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`Webhook signature verification failed: ${message}`);
      return NextResponse.json({ error: message }, { status: 400 });
    }
  } else {
    // In development without webhook secret, parse the event directly.
    event = JSON.parse(body) as Stripe.Event;
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
