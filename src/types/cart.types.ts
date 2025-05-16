
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
  sessionId: string;
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
