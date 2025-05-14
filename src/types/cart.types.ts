
import { CartItem } from './supabase.types';

export { CartItem };

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  cartId?: string;
}

export interface CartContextType {
  cart: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}
