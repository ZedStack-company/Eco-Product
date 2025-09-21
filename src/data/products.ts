import { Product } from '@/types/product';
import productCandles from '../assets/product-candles.jpg';
import productUtensils from '../assets/product-utensils.jpg';
import productOils from '../assets/product-oils.jpg';
import productBlanket from '../assets/product-blanket.jpg';
import ecoHome from '../assets/eco-home.jpg';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Natural Beeswax Candles',
    price: 24.99,
    image: productCandles,
    hoverImage: productOils,
    category: 'Candles',
    description: 'Hand-poured beeswax candles with organic cotton wicks',
    inStock: true,
  },
  {
    id: '2',
    name: 'Bamboo Kitchen Set',
    price: 39.99,
    image: productUtensils,
    hoverImage: productCandles,
    category: 'Kitchen',
    description: 'Sustainable bamboo utensils and cutting boards',
    inStock: true,
  },
  {
    id: '3',
    name: 'Essential Oil Collection',
    price: 49.99,
    image: productOils,
    hoverImage: productBlanket,
    category: 'Body Care',
    description: 'Organic essential oils in glass bottles',
    inStock: true,
  },
  {
    id: '4',
    name: 'Handwoven Blanket',
    price: 89.99,
    image: productBlanket,
    hoverImage: ecoHome,
    category: 'Textiles',
    description: 'Natural fiber blanket with earth tones',
    inStock: true,
  },
  {
    id: '5',
    name: 'Eco Home Starter Kit',
    price: 129.99,
    image: ecoHome,
    hoverImage: productUtensils,
    category: 'Home',
    description: 'Complete sustainable living essentials',
    inStock: true,
  },
  {
    id: '6',
    name: 'Lavender Soap Bar',
    price: 12.99,
    image: productOils,
    hoverImage: productCandles,
    category: 'Body Care',
    description: 'Handmade soap with organic lavender',
    inStock: true,
  },
  {
    id: '7',
    name: 'Ceramic Plant Pots',
    price: 34.99,
    image: ecoHome,
    hoverImage: productBlanket,
    category: 'Home',
    description: 'Handcrafted ceramic planters',
    inStock: true,
  },
  {
    id: '8',
    name: 'Organic Tea Collection',
    price: 28.99,
    image: productUtensils,
    hoverImage: productOils,
    category: 'Kitchen',
    description: 'Premium organic tea blends',
    inStock: true,
  },
];