import { supabase } from '@/integrations/supabase/client';

export class EmailService {
  /**
   * Add a new subscriber email
   */
  static async addSubscriber(email: string): Promise<{ id: string } | null> {
    const { data, error } = await supabase
      .from('subscribers') // <-- make sure this table exists in Supabase
      .insert([{ email }])
      .select()
      .single();

    if (error) {
      console.error('Error adding subscriber:', error);
      return null;
    }

    return data;
  }

  /**
   * Alias for addSubscriber (for easier usage in UI)
   */
  static async subscribe(email: string): Promise<boolean> {
    const result = await this.addSubscriber(email);
    return !!result;
  }

  /**
   * Get all subscribers (optional, admin-only)
   */
  static async getSubscribers(): Promise<{ id: string; email: string }[]> {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscribers:', error);
      return [];
    }

    return data || [];
  }
}
