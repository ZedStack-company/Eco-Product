export const SHOP_CATEGORIES = {
  "Shop Everything": {
    subcategories: []
  },
  "New Arrivals": {
    subcategories: []
  },
  "Under $20": {
    subcategories: []
  },
  "Top Sellers": {
    subcategories: []
  },
  "Blankets": {
    subcategories: []
  },
  "Spring Feeling": {
    subcategories: []
  },
  "Plant Lovers": {
    subcategories: []
  },
  "Home Decor": {
    subcategories: []
  },
  "Cruelty-Free Beauty": {
    subcategories: []
  },
  "Arts & Prints": {
    subcategories: []
  },
  "Books & Magazines": {
    subcategories: []
  },
  "Candles & Incense": {
    subcategories: []
  },
  "Food & Drink": {
    subcategories: []
  },
  "Garden": {
    subcategories: []
  },
  "Seasonal Sale": {
    subcategories: []
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
  "Garden",
  "Seasonal Sale"
] as const;

export type Category = typeof ALL_CATEGORIES[number];
export type ShopSection = keyof typeof SHOP_CATEGORIES;