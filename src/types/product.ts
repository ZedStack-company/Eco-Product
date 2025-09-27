export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  images?: string[];
  category: string;
  sub_category?: string;
  description?: string;
  in_stock: boolean;
  is_new_arrival: boolean;
  is_under_20: boolean;
  created_at?: string;
  updated_at?: string;
  average_rating?: number;
  review_count?: number;
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

export interface Review {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface ProductFilters {
  category?: string | null;
  sortBy?: string;
  searchQuery?: string;
  priceRange?: [number, number];
  inStock?: boolean | null;
}

export interface ProductsResponse {
  products: Product[];
  totalCount: number;
  hasMore: boolean;
}