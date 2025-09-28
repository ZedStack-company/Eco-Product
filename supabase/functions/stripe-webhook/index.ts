// deno-lint-ignore-file no-explicit-any
// Stripe Webhook to record orders in Supabase

import Stripe from "npm:stripe@14";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!stripeSecretKey) throw new Error("Missing STRIPE_SECRET_KEY");
if (!supabaseUrl || !supabaseServiceRoleKey) throw new Error("Missing Supabase service envs");

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia",
});

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function handler(req: Request): Promise<Response> {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    if (!stripeWebhookSecret || !sig) throw new Error("Missing webhook secret or signature");
    event = stripe.webhooks.constructEvent(rawBody, sig, stripeWebhookSecret);
  } catch (err: any) {
    return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const paymentIntentId = session.payment_intent as string | null;

        // Retrieve line items and totals (best-effort)
        let amountTotal = session.amount_total ?? undefined;
        let currency = session.currency ?? undefined;

        // Get customer details from metadata
        const customerName = session.metadata?.customer_name;
        const customerEmail = session.customer_details?.email ?? session.customer_email ?? session.metadata?.customer_email;

        // Upsert order
        await supabase.from("orders").upsert({
          stripe_session_id: session.id,
          stripe_payment_intent_id: paymentIntentId,
          status: "paid",
          currency,
          total: amountTotal ? amountTotal / 100 : null,
          customer_name: customerName,
          customer_email: customerEmail,
        }, { onConflict: "stripe_session_id" });

        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await supabase.from("orders").update({ status: "failed" }).eq("stripe_payment_intent_id", pi.id);
        break;
      }
      default:
        // no-op for other event types
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Unhandled error" }), { status: 500 });
  }
}

Deno.serve(handler);
