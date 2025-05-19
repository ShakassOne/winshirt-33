
// If this file doesn't exist, we'll create it
import { CartItem as BaseCartItem } from './supabase.types';

export interface ExtendedCartItem extends BaseCartItem {
  lotteries?: any[]; // Add the lotteries property that appears to be used in ProductDetail.tsx
}

export interface CartContextType {
  items: BaseCartItem[];
  addItem: (item: BaseCartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export interface CheckoutFormData {
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  delivery_notes?: string;
}
