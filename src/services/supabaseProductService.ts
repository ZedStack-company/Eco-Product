import { supabase } from '@/integrations/supabase/client';
import { Product, ProductFilters as ShopFilters } from '@/types/product';
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

    // Apply admin filters
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
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

    if (category === 'Under $20') {
      query = query.lte('price', 20);
    } else if (category === 'Top Sellers') {
      query = query.eq('is_top_seller', true);
    } else if (category !== 'Shop Everything') {
      query = query.eq('category', category);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }

    return this.transformSupabaseProducts(data || []);
  }

  async addProduct(productData: ProductFormData): Promise<Product | null> {
    let imageUrls: string[] = [];

    if (productData.image && productData.image.length > 0) {
      imageUrls = await this.uploadImages(productData.image);
    }

    const { data, error } = await (supabase as any)
      .from('products')
      .insert([{
        name: productData.name,
        price: productData.price,
        description: productData.description,
        image_url: imageUrls.length > 0 ? imageUrls[0] : null, // keep first as primary
        images: imageUrls,
        category: productData.category,
        sub_category: productData.subCategory,
        tags: productData.tags,
        is_top_seller: productData.isTopSeller,
        in_stock: productData.inStock,
        featured: productData.featured
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      return null;
    }

    return this.transformSupabaseProduct(data);
  }

  async updateProduct(id: string, productData: ProductFormData): Promise<Product | null> {
    let imageUrls: string[] = [];

    if (productData.image && productData.image.length > 0) {
      imageUrls = await this.uploadImages(productData.image);
    }

    const updateData: any = {
      name: productData.name,
      price: productData.price,
      description: productData.description,
      category: productData.category,
      sub_category: productData.subCategory,
      tags: productData.tags,
      is_top_seller: productData.isTopSeller,
      in_stock: productData.inStock,
      featured: productData.featured
    };

    if (imageUrls.length > 0) {
      updateData.image_url = imageUrls[0];
      updateData.images = imageUrls;
    }

    const { data, error } = await (supabase as any)
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return null;
    }

    return this.transformSupabaseProduct(data);
  }

  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await (supabase as any)
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }
    return true;
  }

  // ✅ Updated: Support multiple image uploads
  private async uploadImages(files: File[]): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage.from('product-images').upload(filePath, file);
      if (error) {
        console.error('Error uploading image:', error);
        continue;
      }

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      uploadedUrls.push(data.publicUrl);
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
      is_new_arrival: data.is_new_arrival ?? true,
      is_under_20: data.is_under_20 ?? false,
      created_at: data.created_at,
      updated_at: data.updated_at,
      average_rating: data.average_rating || 0,
      review_count: data.review_count || 0,
    };
  }

  private transformSupabaseProducts(data: any[]): Product[] {
    return data.map(item => this.transformSupabaseProduct(item));
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
