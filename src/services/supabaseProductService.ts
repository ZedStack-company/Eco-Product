import { supabase } from '@/integrations/supabase/client';
import { Product, ProductFilters as ShopFilters } from '@/types/product';
import { ProductFormData, ProductFilters as AdminFilters } from '@/types/admin';

class SupabaseProductService {
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
    let imageUrl = '';

    // Upload image if provided
    if (productData.image) {
      imageUrl = await this.uploadImage(productData.image);
    }

    const { data, error } = await (supabase as any)
      .from('products')
      .insert([{
        name: productData.name,
        price: productData.price,
        description: productData.description,
        image_url: imageUrl,
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
    let imageUrl = '';

    if (productData.image) {
      imageUrl = await this.uploadImage(productData.image);
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

    if (imageUrl) {
      updateData.image_url = imageUrl;
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

  private async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading image:', error);
      return '';
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  private transformSupabaseProduct(data: any): Product {
    return {
      id: data.id,
      name: data.name,
      price: data.price,
      image: data.image_url || '',
      category: data.category,
      description: data.description,
      inStock: data.in_stock,
      featured: data.featured,
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private transformSupabaseProducts(data: any[]): Product[] {
    return data.map(item => this.transformSupabaseProduct(item));
  }

  // Subscribe to real-time changes
  subscribeToProducts(callback: (products: Product[]) => void) {
    return supabase
      .channel('products')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        () => {
          // Refetch all products when changes occur
          this.getAllProducts().then(callback);
        }
      )
      .subscribe();
  }
}

export const supabaseProductService = new SupabaseProductService();