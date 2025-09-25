import { Product, ProductFilters } from '@/types/product';

export const filterProducts = (products: Product[], filters: ProductFilters): Product[] => {
  let filtered = [...products];

  // Category filter
  if (filters.category && filters.category !== 'All') {
    filtered = filtered.filter(product => product.category === filters.category);
  }

  // Search filter
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }

  // Stock filter
  if (filters.inStock !== null && filters.inStock !== undefined) {
    filtered = filtered.filter(product => product.in_stock === filters.inStock);
  }

  // Price range filter
  if (filters.priceRange) {
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange![0] && product.price <= filters.priceRange![1]
    );
  }

  return filtered;
};

export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  const sorted = [...products];

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'price':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.sort((a, b) =>
        new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      );
    case 'oldest':
      return sorted.sort((a, b) =>
        new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
      );
    default:
      return sorted;
  }
};

export const getProductsByCategory = (products: Product[], category: string): Product[] => {
  if (category === 'All') return products;
  return products.filter(product => product.category === category);
};

export const getRelatedProducts = (
  products: Product[], 
  currentProduct: Product, 
  limit = 4
): Product[] => {
  return products
    .filter(product => 
      product.id !== currentProduct.id && 
      product.category === currentProduct.category
    )
    .slice(0, limit);
};

export const formatPrice = (price: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};

export const getProductImageUrl = (product: Product): string => {
  return product.image_url || '/placeholder.svg';
};

export const isProductInStock = (product: Product): boolean => {
  return product.in_stock;
};

export const getProductAvailabilityText = (product: Product): string => {
  return product.in_stock ? 'In Stock' : 'Out of Stock';
};

export const calculateDiscountedPrice = (
  originalPrice: number, 
  discountPercentage: number
): number => {
  return originalPrice * (1 - discountPercentage / 100);
};

export const generateProductSlug = (productName: string): string => {
  return productName
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};