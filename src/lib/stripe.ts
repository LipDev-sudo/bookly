import Stripe from "stripe";

/**
 * Server-side Stripe client. NEVER import in Client Components.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Pin to a stable API version. Update intentionally, not by accident.
  apiVersion: "2025-09-30.clover",
  typescript: true,
});
