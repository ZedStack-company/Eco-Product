// deno-lint-ignore-file no-explicit-any
// Create Stripe Checkout session from cart items
// Requires env vars: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import Stripe from "npm:stripe@14";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

type CartItem = {
  id: string;
  name: string;
  price: number; // in major currency unit (e.g., dollars)
  quantity: number;
};

type CreateSessionRequest = {
  items: CartItem[];
  customer_email?: string;
  customer_name?: string;
  currency?: string; // default USD
  success_url?: string;
  cancel_url?: string;
  metadata?: Record<string, string>;
};

async function handler(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      status: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }

  let body: CreateSessionRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { 
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }

  const items = body.items || [];
  if (!items.length) {
    return new Response(JSON.stringify({ error: "No items provided" }), { 
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }

  const currency = (body.currency || "usd").toLowerCase();

  // Build Stripe line_items
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency,
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100),
    },
  }));

  // Default success and cancel URLs (fallback to request origin if available)
  const origin = req.headers.get("origin") || req.headers.get("referer") || "";
  const success_url = body.success_url || `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
  const cancel_url = body.cancel_url || `${origin}/payment-failed?session_id={CHECKOUT_SESSION_ID}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      customer_email: body.customer_email,
      success_url,
      cancel_url,
      metadata: body.metadata,
    });

    // Create a pending order row with customer details and items
    if (supabase) {
      try {
        const orderData = {
          status: "pending",
          stripe_session_id: session.id,
          currency,
          subtotal: items.reduce((s, i) => s + i.price * i.quantity, 0),
          customer_email: body.customer_email,
          customer_name: body.customer_name,
          metadata: {
            ...body.metadata,
            customer_name: body.customer_name,
            customer_email: body.customer_email,
          }
        };

        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert(orderData)
          .select()
          .single();

        if (!orderError && order) {
          // Insert order items
          const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.id,
            name: item.name,
            quantity: item.quantity,
            unit_amount: item.price,
          }));

          await supabase.from("order_items").insert(orderItems);
        }
      } catch (error) {
        console.error("Error creating order:", error);
        // Non-fatal if table missing; webhook will upsert later
      }
    }

    return new Response(JSON.stringify({ id: session.id, url: session.url }), {
      headers: { 
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Stripe error" }), { 
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }
}

Deno.serve(handler);
