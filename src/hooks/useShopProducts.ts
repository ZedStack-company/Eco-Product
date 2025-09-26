import { useState, useEffect } from 'react';
import { supabaseProductService } from '@/services/supabaseProductService';
import { Product, ProductFilters } from '@/types/product';

export const useShopProducts = (category?: string, limit?: number) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      let data: Product[];
      
      if (category) {
        data = await supabaseProductService.getProductsByCategory(category, limit);
      } else {
        data = await supabaseProductService.getAllProducts();
      }
      
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
      if (category) {
        // Filter products for specific category
        const filteredProducts = updatedProducts.filter(product => {
          if (category === 'Under $20') return product.is_under_20;
          if (category === 'New Arrivals') return product.is_new_arrival = true;
          if (category === 'Top Sellers') return (product.average_rating || 0) >= 4;
          if (category === 'Shop Everything') return true;
          return product.category === category;
        });
        setProducts(limit ? filteredProducts.slice(0, limit) : filteredProducts);
      } else {
        setProducts(updatedProducts);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [category, limit]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  };
};