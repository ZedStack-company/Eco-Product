import { Product } from './product';

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}