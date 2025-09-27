import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { ProductFormData, ProductFilters as AdminFilters } from '@/types/admin';

class SupabaseProductService {
  getRealtimeClient() {
    return supabase;
  }

  async getAllProducts(filters?: AdminFilters): Promise<Product[]> {
    let query = (supabase as any)
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }
    if (filters?.category && filters.category !== 'All') {
      query = query.eq('category', filters.category);
    }
    if (filters?.priceMin) {
      query = query.gte('price', filters.priceMin);
    }
    if (filters?.priceMax) {
      query = query.lte('price', filters.priceMax);
    }
    if (filters?.isTopSeller !== null && filters?.isTopSeller !== undefined) {
      query = query.eq('is_top_seller', filters.isTopSeller);
    }
    if (filters?.tags) {
      query = query.contains('tags', [filters.tags]);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return this.transformSupabaseProducts(data || []);
  }

  async getProductsByCategory(category: string, limit?: number): Promise<Product[]> {
    let query = (supabase as any)
      .from('products')
      .select('*')
      .eq('in_stock', true);

    if (category) {
      switch (category) {
        case 'Top Sellers':
          query = query.eq('is_top_seller', true);
          break;
        case 'New Arrivals':
          query = query.eq('is_new_arrival', true);
          break;
        case 'Under $20':
          query = query.lte('price', 20);
          break;
        case 'Seasonal Sale':
          query = query.eq('seasonal_sale', true); // ⚠️ ensure this column exists
          break;
        case 'Shop Everything':
          // no filter → fetch all
          break;
        default:
          // Normal categories (case-insensitive match)
          query = query.ilike('category', category.trim());
      }
    }

    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) {
      console.error('❌ Error fetching products by category:', error);
      return [];
    }

    console.log(
      `✅ DB returned ${data?.length || 0} products for category "${category}"`,
      data
    );

    return this.transformSupabaseProducts(data || []);
  }

  // ... keep addProduct, updateProduct, deleteProduct, uploadImages as is

private transformSupabaseProduct(data: any): Product {
  return {
    id: data.id,
    name: data.name,
    price: parseFloat(data.price),
    image_url: data.image_url || '',
    images: data.images || [],
    category: data.category || '',
    sub_category: data.sub_category || '',
    description: data.description || '',
    in_stock: data.in_stock ?? true,
    is_new_arrival: data.is_new_arrival ?? false,
    is_under_20: data.is_under_20 ?? false,
    is_top_seller: data.is_top_seller ?? false,  // ✅ added
    featured: data.featured ?? false,            // ✅ added
    tags: data.tags || [],                       // ✅ added
    created_at: data.created_at,
    updated_at: data.updated_at,
    average_rating: data.average_rating || 0,
    review_count: data.review_count || 0,
  };
}


  private transformSupabaseProducts(data: any[]): Product[] {
    return data.map((item) => this.transformSupabaseProduct(item));
  }

  subscribeToProducts(callback: (products: Product[]) => void) {
    return supabase
      .channel('products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        this.getAllProducts().then(callback);
      })
      .subscribe();
  }
}

export const supabaseProductService = new SupabaseProductService();
