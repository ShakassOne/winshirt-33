
import { CartItem as SupabaseCartItem } from './supabase.types';

// Export the CartItem from supabase.types
export type CartItem = SupabaseCartItem & {
  cartItemId?: string;
};

export type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  loadCartItems?: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  total: number;
  itemCount: number;
  sessionId: string;
};

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  deliveryNotes?: string;
  createAccount?: boolean;
  password?: string;
}
