
import { CartItem } from './supabase.types';

export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
  error: string | null;
  total: number;
  itemCount: number;
  cartToken: string;
  currentUser: { id: string } | null;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  deliveryNotes: string;
  createAccount: boolean;
  password?: string;
}

// Add the CartItemInsert interface
export interface CartItemInsert {
  cart_token_id: string;
  product_id: string;
  quantity: number;
  price: number;
  color?: string | null;
  size?: string | null;
  customization?: any;
  cart_session_id?: string; // Make this optional since we're providing dummy values
}
