import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types/product';

export class ReviewService {
  static async getProductReviews(productId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    return data || [];
  }

  static async addReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review | null> {
    const { data, error } = await supabase
      .from('reviews')
      .insert([review])
      .select()
      .single();

    if (error) {
      console.error('Error adding review:', error);
      return null;
    }

    return data;
  }

  static async getProductAverageRating(productId: string): Promise<{ average: number; count: number }> {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId);

    if (error) {
      console.error('Error fetching ratings:', error);
      return { average: 0, count: 0 };
    }

    if (!data || data.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = data.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / data.length;

    return { average: Math.round(average * 10) / 10, count: data.length };
  }
}