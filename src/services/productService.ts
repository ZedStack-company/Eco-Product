import { Product, ProductFilters, ProductsResponse } from '@/types/product';
import { mockProducts } from '@/data/products';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ProductService {
  private products: Product[] = mockProducts;

  async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    await delay(300); // Simulate API call

    let filteredProducts = [...this.products];

    // Apply filters
    if (filters?.category && filters.category !== 'All') {
      filteredProducts = filteredProducts.filter(
        product => product.category === filters.category
      );
    }

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        product => 
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    if (filters?.inStock !== null && filters?.inStock !== undefined) {
      filteredProducts = filteredProducts.filter(
        product => product.inStock === filters.inStock
      );
    }

    if (filters?.priceRange) {
      filteredProducts = filteredProducts.filter(
        product => 
          product.price >= filters.priceRange![0] && 
          product.price <= filters.priceRange![1]
      );
    }

    if (filters?.tags && filters.tags.length > 0) {
      filteredProducts = filteredProducts.filter(
        product => 
          product.tags?.some(tag => filters.tags!.includes(tag))
      );
    }

    // Apply sorting
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'name':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'price':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filteredProducts.sort((a, b) => 
            new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
          );
          break;
      }
    }

    return {
      products: filteredProducts,
      totalCount: filteredProducts.length,
      hasMore: false, // For pagination implementation
    };
  }

  async getProductById(id: string): Promise<Product | null> {
    await delay(200);
    return this.products.find(product => product.id === id) || null;
  }

  async getFeaturedProducts(limit = 4): Promise<Product[]> {
    await delay(200);
    return this.products
      .filter(product => product.featured || product.inStock)
      .slice(0, limit);
  }

  async getProductsByCategory(category: string, limit?: number): Promise<Product[]> {
    await delay(200);
    let products = this.products.filter(product => product.category === category);
    if (limit) {
      products = products.slice(0, limit);
    }
    return products;
  }

  async getCategories(): Promise<string[]> {
    await delay(100);
    const categories = [...new Set(this.products.map(product => product.category))];
    return ['All', ...categories];
  }

  async searchProducts(query: string): Promise<Product[]> {
    await delay(300);
    const lowercaseQuery = query.toLowerCase();
    return this.products.filter(
      product =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description?.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export const productService = new ProductService();