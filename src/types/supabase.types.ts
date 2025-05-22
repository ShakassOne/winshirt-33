
export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  color?: string | null;
  size?: string | null;
  lotteries?: any; // Ajout de la propriété manquante
  available_colors?: string[] | null;
  available_sizes?: string[] | null;
  customization?: {
    designId?: string;
    designUrl?: string;
    designName?: string;
    customText?: string;
    textColor?: string;
    textFont?: string;
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

// Ajout des types manquants
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_active?: boolean;
  is_customizable?: boolean;
  available_colors?: string[] | null;
  available_sizes?: string[] | null;
  color?: string | null;
  mockup_id?: string | null;
  model_3d_url?: string | null;
  use_3d_viewer?: boolean;
  tickets_offered?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Design = {
  id: string;
  name: string;
  image_url: string;
  category: string;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Lottery = {
  id: string;
  title: string;
  description: string;
  value: number;
  goal: number;
  participants?: number | null;
  draw_date: string;
  image_url: string;
  is_active?: boolean | null;
  is_featured?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Mockup = {
  id: string;
  name: string;
  category: string;
  svg_front_url: string;
  svg_back_url?: string | null;
  price_a3: number;
  price_a4: number;
  price_a5: number;
  price_a6: number;
  text_price_front: number;
  text_price_back: number;
  print_areas: any;
  colors?: any | null;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SocialNetwork = {
  id: string;
  name: string;
  url: string | null;
  icon: string;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
};
