export const siteConfig = {
  name: "Eco Store",
  description: "Sustainable living made simple. Discover eco-friendly products for your home and lifestyle.",
  url: "https://your-eco-store.com",
  ogImage: "https://your-eco-store.com/og.jpg",
  keywords: ["eco-friendly", "sustainable", "organic", "natural", "green living"],
  author: "Eco Store Team",
  
  // Contact Information
  contact: {
    email: "hello@eco-store.com",
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 Green Street",
      city: "Portland",
      state: "OR",
      zip: "97201",
      country: "USA",
    },
  },

  // Social Media
  social: {
    twitter: "https://twitter.com/ecostore",
    facebook: "https://facebook.com/ecostore",
    instagram: "https://instagram.com/ecostore",
    youtube: "https://youtube.com/ecostore",
  },

  // Navigation
  navigation: {
    main: [
      { name: "Home", href: "/" },
      { name: "Shop", href: "/shop" },
      { name: "Top Sellers", href: "/top-sellers" },
      { name: "About", href: "/about" },
      { name: "Journal", href: "/journal" },
    ],
    footer: {
      info: [
        { name: "Search", href: "/search" },
        { name: "Journal", href: "/journal" },
        { name: "About", href: "/about" },
        { name: "Returns", href: "/returns" },
        { name: "Theme Features", href: "/theme-features" },
      ],
      support: [
        { name: "Shipping Info", href: "/shipping" },
        { name: "Contact Us", href: "/contact" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
      ],
    },
  },

  // E-commerce Settings
  store: {
    currency: "USD",
    locale: "en-US",
    taxRate: 0.08, // 8% tax rate
    shippingRate: 9.99,
    freeShippingThreshold: 75,
    maxCartItems: 50,
  },

  // SEO
  seo: {
    titleTemplate: "%s | Eco Store",
    defaultTitle: "Eco Store - Sustainable Living Made Simple",
    defaultDescription: "Discover eco-friendly products for your home and lifestyle. Shop sustainable, organic, and natural products that are good for you and the planet.",
  },

  // Features
  features: {
    newsletter: true,
    wishlist: false,
    reviews: false,
    comparison: false,
    quickView: true,
    relatedProducts: true,
    recentlyViewed: true,
  },
} as const;

export type SiteConfig = typeof siteConfig;