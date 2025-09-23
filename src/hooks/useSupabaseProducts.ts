import { useState, useEffect } from 'react';
import { supabaseProductService } from '@/services/supabaseProductService';
import { Product } from '@/types/product';
import { ProductFilters } from '@/types/admin';

export const useSupabaseProducts = (filters?: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (currentFilters?: ProductFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseProductService.getAllProducts(currentFilters || filters);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Subscribe to real-time updates
    const subscription = supabaseProductService.subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addProduct = async (productData: any) => {
    const newProduct = await supabaseProductService.addProduct(productData);
    if (newProduct) {
      await fetchProducts();
      return newProduct;
    }
    return null;
  };

  const updateProduct = async (id: string, productData: any) => {
    const updatedProduct = await supabaseProductService.updateProduct(id, productData);
    if (updatedProduct) {
      await fetchProducts();
      return updatedProduct;
    }
    return null;
  };

  const deleteProduct = async (id: string) => {
    const success = await supabaseProductService.deleteProduct(id);
    if (success) {
      await fetchProducts();
    }
    return success;
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: () => fetchProducts()
  };
};