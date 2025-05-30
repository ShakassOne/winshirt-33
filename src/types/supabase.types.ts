
export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  color?: string | null;
  size?: string | null;
  available_colors?: string[] | null;
  available_sizes?: string[] | null;
  customization?: {
    designId?: string;
    designUrl?: string;
    designName?: string;
    customText?: string;
    textColor?: string;
    textFont?: string;
    mockupRectoUrl?: string;
    mockupVersoUrl?: string;
    selectedSize?: string;
    selectedColor?: string;
    lotteryName?: string;
  } | null;
};

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type Order = {
  id: string;
  user_id: string | null;
  guest_email: string | null;
  session_id: string | null;
  total_amount: number;
  subtotal: number | null;
  shipping_cost: number | null;
  shipping_option_id: string | null;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  delivery_notes: string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string | null;
  payment_intent_id: string | null;
  payment_status: PaymentStatus;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  customization: CartItem['customization'] | null;
  mockup_recto_url?: string | null;
  mockup_verso_url?: string | null;
  selected_size?: string | null;
  selected_color?: string | null;
  lottery_name?: string | null;
};

export type ExtendedOrderItem = OrderItem & {
  products: {
    id: string;
    name: string;
    image_url: string;
    description: string;
    price: number;
    [key: string]: any;
  };
};

export type ExtendedOrder = Order & {
  items: ExtendedOrderItem[];
};

// Use Supabase types directly for core entities
import { Database } from '@/integrations/supabase/types';

export type Product = Database['public']['Tables']['products']['Row'];
export type Design = Database['public']['Tables']['designs']['Row'];
export type Lottery = Database['public']['Tables']['lotteries']['Row'];
export type Mockup = Database['public']['Tables']['mockups']['Row'];
export type SocialNetwork = Database['public']['Tables']['social_networks']['Row'];

// Define PrintArea type for mockups
export type PrintArea = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
};
