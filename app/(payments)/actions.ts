"use server";

import { stripe } from "@/lib/payments/stripe";
import { headers } from "next/headers";

export async function fetchClientSecret() {
  const origin = (await headers()).get("origin");

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        price: "price_1R2MR9DACRputlXHZM4Fks79",
        quantity: 1,
      },
    ],
    mode: "payment",
    return_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
  });

  return session.client_secret ?? "";
}

export async function getCheckoutSession(sessionId: string) {
  if (!sessionId || sessionId.length === 0) {
    return null;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"],
    });

    return {
      status: session.status,
      customerEmail: session.customer_details?.email || null,
    };
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return null;
  }
}
