export interface AdminCredentials {
  username: string;
  password: string;
}

export interface AdminUser {
  id: string;
  username: string;
  isAuthenticated: boolean;
}

export interface ProductFormData {
  name: string;
  price: number;
  description: string;
  image?: File;
  category: string;
  subCategory: string;
  tags: string[];
  isTopSeller: boolean;
  inStock: boolean;
  featured: boolean;
}

export interface ProductFilters {
  search: string;
  category: string;
  priceMin: number;
  priceMax: number;
  tags: string;
  isTopSeller: boolean | null;
}

export const CATEGORIES = {
  'Shop Everything': [],
  'New Arrivals': [],
  'Under $20': [],
  'Seasonal Sale': [],
  'Featured': ['Blankets', 'Spring Feeling', 'Plant Lovers', 'Home Décor', 'Cruelty-Free Beauty'],
  'Collections': ['Art & Prints', 'Books & Magazines', 'Candles & Incense', 'Food & Drink', 'Garden'],
  'Top Sellers': []
};