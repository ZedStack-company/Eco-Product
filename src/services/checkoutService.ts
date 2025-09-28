import { supabase } from '@/integrations/supabase/client';

export interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export async function createStripeCheckoutSession(params: {
  items: CheckoutItem[];
  customer_email?: string;
  currency?: string;
  success_url?: string;
  cancel_url?: string;
  metadata?: Record<string, string>;
}): Promise<{ id: string; url?: string }>
{
  const response = await fetch('https://xnpcwtqxcbcpkjadufna.supabase.co/functions/v1/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhucGN3dHF4Y2JjcGtqYWR1Zm5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MDY4MjEsImV4cCI6MjA3NDE4MjgyMX0.eOjgMpXEfwS5Ue9fKbgj0PvipItufeAmtlDucuLs1yY',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data as { id: string; url?: string };
}
