
// Cart related types
import { CartItem as BaseCartItem } from './supabase.types';

export interface ExtendedCartItem extends BaseCartItem {
  lotteries?: any[]; // Add the lotteries property that appears to be used in ProductDetail.tsx
}

export interface CartContextType {
  items: BaseCartItem[];
  addItem: (item: BaseCartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateItemQuantity?: (productId: string, quantity: number) => void; // Add alias for compatibility
  clearCart: () => void;
  getCartTotal: () => number;
  
  // Add missing properties from CartContext
  total?: number;
  itemCount?: number;
  isLoading?: boolean;
  error?: string | null;
  cartToken?: string;
  currentUser?: { id: string } | null;
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
  
  // Add these fields for compatibility with existing code
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  deliveryNotes?: string;
  createAccount?: boolean;
  password?: string;
}
