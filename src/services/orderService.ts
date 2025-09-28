import { supabase } from '@/integrations/supabase/client';

export interface OrderDetails {
  id: string;
  customer_name: string;
  customer_email: string;
  items: Array<{
    name: string;
    quantity: number;
    unit_amount: number;
  }>;
  total: number;
  currency: string;
  created_at: string;
  status: string;
  error_message?: string;
}

export async function getOrderBySessionId(sessionId: string): Promise<OrderDetails | null> {
  try {
    console.log('Fetching order for session ID:', sessionId);
    
    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single();

    if (orderError) {
      console.error('Order not found:', orderError);
      // Try to find by partial session ID match (in case of URL encoding issues)
      const { data: partialOrder, error: partialError } = await supabase
        .from('orders')
        .select('*')
        .ilike('stripe_session_id', `%${sessionId}%`)
        .single();
      
      if (partialError || !partialOrder) {
        console.error('Partial match also failed:', partialError);
        return null;
      }
      
      // Use the partial match
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', partialOrder.id);

      if (itemsError) {
        console.error('Items not found:', itemsError);
        return null;
      }

      return {
        id: partialOrder.id,
        customer_name: partialOrder.customer_name || 'Unknown',
        customer_email: partialOrder.customer_email || 'Unknown',
        items: items || [],
        total: partialOrder.total || partialOrder.subtotal || 0,
        currency: partialOrder.currency || 'usd',
        created_at: partialOrder.created_at,
        status: partialOrder.status,
        error_message: partialOrder.status === 'failed' ? 'Payment was declined' : undefined,
      };
    }

    if (!order) {
      console.error('No order found');
      return null;
    }

    console.log('Order found:', order);

    // Get order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    if (itemsError) {
      console.error('Items not found:', itemsError);
      return null;
    }

    console.log('Items found:', items);

    return {
      id: order.id,
      customer_name: order.customer_name || 'Unknown',
      customer_email: order.customer_email || 'Unknown',
      items: items || [],
      total: order.total || order.subtotal || 0,
      currency: order.currency || 'usd',
      created_at: order.created_at,
      status: order.status,
      error_message: order.status === 'failed' ? 'Payment was declined' : undefined,
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}
