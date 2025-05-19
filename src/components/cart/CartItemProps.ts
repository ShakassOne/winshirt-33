
import { CartItem } from "@/types/supabase.types";

export interface CartItemProps {
  item: CartItem;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}
