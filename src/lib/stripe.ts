import Stripe from "stripe";

/**
 * Server-side Stripe client. NEVER import in Client Components.
 */
export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY.");
  }

  return new Stripe(secretKey, {
    apiVersion: "2025-09-30.clover",
    typescript: true,
  });
}
