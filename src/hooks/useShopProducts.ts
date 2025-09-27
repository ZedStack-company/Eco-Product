// hooks/useShopProducts.ts
import { useState, useEffect, useCallback } from 'react';
import { supabaseProductService } from '@/services/supabaseProductService';
import { Product } from '@/types/product';

export const useShopProducts = (category?: string, limit?: number) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ fetch directly from Supabase
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data: Product[];
      if (category) {
        data = await supabaseProductService.getProductsByCategory(category.trim(), limit);
      } else {
        data = await supabaseProductService.getAllProducts();
      }

      setProducts(data ?? []);
      console.log(`✅ Loaded ${data?.length ?? 0} products for category "${category || 'All'}"`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [category, limit]);

  useEffect(() => {
    fetchProducts();

    const subscription = supabaseProductService.subscribeToProducts((updatedProducts) => {
      console.log("📡 Realtime update received:", updatedProducts.length);

      let filteredProducts = updatedProducts;

      if (category) {
        const cat = category.trim().toLowerCase();

        // ✅ Normalize both sides
        filteredProducts = updatedProducts.filter(
          (p) => p.category?.trim().toLowerCase() === cat
        );
      }

      if (limit) {
        filteredProducts = filteredProducts.slice(0, limit);
      }

      setProducts(filteredProducts);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProducts, category, limit]);

  return { products, loading, error, refetch: fetchProducts };
};
