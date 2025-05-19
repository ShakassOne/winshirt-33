
// If this file doesn't exist, we'll create it
import { CartItem as BaseCartItem } from './supabase.types';

export interface ExtendedCartItem extends BaseCartItem {
  lotteries?: any[]; // Add the lotteries property that appears to be used in ProductDetail.tsx
}
