
import { CartItem as BaseCartItem } from '@/types/supabase.types';

export interface CartItemProps {
  item: BaseCartItem;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}
