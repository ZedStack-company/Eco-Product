export const SHOP_CATEGORIES = {
  "Shop Everything": {
    subcategories: ["New Arrivals", "Under $20", "Seasonal Sale"]
  },
  "Featured": {
    subcategories: ["Blankets", "Spring Feeling", "Plant Lovers", "Home Decor", "Cruelty-Free Beauty"]
  },
  "Collections": {
    subcategories: ["Arts & Prints", "Books & Magazines", "Candles & Incense", "Food & Drink", "Garden"]
  }
} as const;

export const ALL_CATEGORIES = [
  "Blankets",
  "Spring Feeling", 
  "Plant Lovers",
  "Home Decor",
  "Cruelty-Free Beauty",
  "Arts & Prints",
  "Books & Magazines",
  "Candles & Incense",
  "Food & Drink",
  "Garden"
] as const;

export type Category = typeof ALL_CATEGORIES[number];
export type ShopSection = keyof typeof SHOP_CATEGORIES;