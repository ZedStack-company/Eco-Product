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
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    if (filters?.category && filters.category !== 'All') {
      query = query.eq('category', filters.category);
    }
    if (filters?.priceMin) query = query.gte('price', filters.priceMin);
    if (filters?.priceMax) query = query.lte('price', filters.priceMax);
    if (filters?.isTopSeller !== null && filters?.isTopSeller !== undefined) {
      query = query.eq('is_top_seller', filters.isTopSeller);
    }
    if (filters?.tags) query = query.contains('tags', [filters.tags]);

    const { data, error } = await query;
    if (error) {
      console.error('❌ Error fetching products:', error);
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
        case 'Seasonal Sale':
          query = query.eq('seasonal_sale', true);
          break;
        case 'Shop Everything':
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

  async addProduct(product: ProductFormData): Promise<Product | null> {
    console.log("🟢 addProduct raw payload:", product);

    const uploadedUrls = product.image?.length ? await this.uploadImages(product.image) : [];

    const payload = {
      name: product.name,
      price: product.price,
      description: product.description,
      image_url: uploadedUrls[0] || null,
      images: uploadedUrls,
      category: product.category,
      sub_category: product.subCategory,
      tags: product.tags,
      is_top_seller: product.isTopSeller,
      in_stock: product.inStock,
      featured: product.featured,
    };

    console.log("🟢 addProduct final payload:", payload);

    const { data, error, status } = await supabase
      .from("products")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.error("❌ addProduct failed:", { message: error.message, details: error.details, hint: error.hint, code: error.code, status });
      return null;
    }

    console.log("✅ addProduct success:", data);
    return this.transformSupabaseProduct(data);
  }

  async updateProduct(id: string, updates: Partial<ProductFormData>): Promise<Product | null> {
    console.log(`🟢 updateProduct id=${id} raw updates:`, updates);

    const uploadedUrls = updates.image?.length ? await this.uploadImages(updates.image) : [];

    const payload: any = {
      name: updates.name,
      price: updates.price,
      description: updates.description,
      category: updates.category,
      sub_category: updates.subCategory,
      tags: updates.tags,
      is_top_seller: updates.isTopSeller,
      in_stock: updates.inStock,
      featured: updates.featured,
    };

    if (uploadedUrls.length) {
      payload.image_url = uploadedUrls[0];
      payload.images = uploadedUrls;
    }

    console.log(`🟢 updateProduct final payload:`, payload);

    const { data, error, status } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("❌ updateProduct failed:", { message: error.message, details: error.details, hint: error.hint, code: error.code, status });
      return null;
    }

    console.log("✅ updateProduct success:", data);
    return this.transformSupabaseProduct(data);
  }

  async deleteProduct(id: string): Promise<boolean> {
    console.log(`🟢 deleteProduct id=${id}`);

    const { error, status } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("❌ deleteProduct failed:", { message: error.message, details: error.details, hint: error.hint, code: error.code, status });
      return false;
    }

    console.log(`✅ deleteProduct success: id=${id}`);
    return true;
  }

  async uploadImages(files: File[]): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const filePath = `products/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('product-images').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (error) {
        console.error('❌ Error uploading image:', error);
        continue;
      }

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      if (data?.publicUrl) uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  }

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

  private transformSupabaseProducts(data: any[]): Product[] {
    return data.map((item) => this.transformSupabaseProduct(item));
  }

  subscribeToProducts(callback: (products: Product[]) => void, category?: string, limit?: number) {
    return supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async () => {
        const products = category
          ? await this.getProductsByCategory(category, limit)
          : await this.getAllProducts();
        callback(products);
      })
      .subscribe();
  }
}

export const supabaseProductService = new SupabaseProductService();