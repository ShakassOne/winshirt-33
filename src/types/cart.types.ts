
import { CartItem } from './supabase.types';

export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateItemQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
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
  deliveryNotes?: string;
  createAccount?: boolean;
  password?: string;
  selectedShippingOption: string;
}
