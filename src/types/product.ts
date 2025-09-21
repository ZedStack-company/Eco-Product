export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  hoverImage?: string;
  category: string;
  description?: string;
  inStock: boolean;
  featured?: boolean;
  tags?: string[];
  variants?: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price?: number;
  image?: string;
  inStock: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
}

export interface ProductFilters {
  category?: string | null;
  sortBy?: string;
  searchQuery?: string;
  priceRange?: [number, number];
  inStock?: boolean | null;
  tags?: string[];
}

export interface ProductsResponse {
  products: Product[];
  totalCount: number;
  hasMore: boolean;
}