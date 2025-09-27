import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { ProductFormData, ProductFilters as AdminFilters } from '@/types/admin';

class SupabaseProductService {
  getRealtimeClient() {
    return supabase;
  }

  // ✅ Admin-side: fetch with filters
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
      console.error('❌ Error fetching products:', error);
      return [];
    }

    return this.transformSupabaseProducts(data || []);
  }

  // ✅ Shop-side: fetch products by category
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
        // case 'Under $20':
        //   query = query.lte('price', 20);
        //   break;
        case 'Seasonal Sale':
          query = query.eq('seasonal_sale', true);
          break;
        case 'Shop Everything':
          // fetch all → no filter
          break;
        default:
          query = query.ilike('category', `%${category.trim()}%`);
      }
    }

    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) {
      console.error(`❌ Error fetching products for category "${category}":`, error);
      return [];
    }

    console.log(`✅ DB returned ${data?.length || 0} products for "${category}"`);
    
    return this.transformSupabaseProducts(data || []);
  }

  // ✅ Add product
  async addProduct(product: ProductFormData): Promise<Product | null> {
    const { data, error } = await supabase.from('products').insert(product).select('*').single();

    if (error) {
      console.error('❌ Error adding product:', error);
      return null;
    }

    return this.transformSupabaseProduct(data);
  }

  // ✅ Update product
  async updateProduct(id: string, updates: Partial<ProductFormData>): Promise<Product | null> {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select('*').single();

    if (error) {
      console.error(`❌ Error updating product ${id}:`, error);
      return null;
    }

    return this.transformSupabaseProduct(data);
  }

  // ✅ Delete product
  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error(`❌ Error deleting product ${id}:`, error);
      return false;
    }
    return true;
  }

  // ✅ Upload multiple images (returns public URLs)
  async uploadImages(files: File[]): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const filePath = `products/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('product-images').upload(filePath, file);

      if (error) {
        console.error('❌ Error uploading image:', error);
        continue;
      }

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      if (data?.publicUrl) uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  }

  // ✅ Transform single record
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
      is_top_seller: data.is_top_seller ?? false,
      featured: data.featured ?? false,
      tags: data.tags || [],
      created_at: data.created_at,
      updated_at: data.updated_at,
      average_rating: data.average_rating || 0,
      review_count: data.review_count || 0,
    };
  }

  // ✅ Transform list
  private transformSupabaseProducts(data: any[]): Product[] {
    return data.map((item) => this.transformSupabaseProduct(item));
  }

  // ✅ Realtime subscription
  // inside SupabaseProductService class
subscribeToProducts(
  callback: (products: Product[]) => void,
  category?: string,
  limit?: number
) {
  return supabase
    .channel('products-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      async () => {
        let products: Product[];

        if (category) {
          products = await this.getProductsByCategory(category, limit);
        } else {
          products = await this.getAllProducts();
        }

        callback(products);
      }
    )
    .subscribe();
}

}

export const supabaseProductService = new SupabaseProductService();
