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
  "Blankets": [],
  "Spring Feeling": [],
  "Plant Lovers": [],
  "Home Decor": [],
  "Cruelty-Free Beauty": [],
  "Arts & Prints": [],
  "Books & Magazines": [],
  "Candles & Incense": [],
  "Food & Drink": [],
  "Garden": [],
  "Seasonal Sale": []
} as const;