
export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  color?: string | null;
  size?: string | null;
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

// Missing types that need to be added

export type Design = {
  id: string;
  name: string;
  image_url: string;
  category: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Lottery = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  value: number;
  participants?: number;
  goal: number;
  draw_date: string;
  is_active?: boolean;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_active?: boolean;
  is_customizable?: boolean;
  color?: string;
  available_colors?: string[];
  available_sizes?: string[];
  mockup_id?: string;
  use_3d_viewer?: boolean;
  model_3d_url?: string;
  tickets_offered?: number;
  created_at?: string;
  updated_at?: string;
};

export type PrintArea = {
  id: string;
  name: string;
  width: number;
  height: number;
  position_x: number;
  position_y: number;
  side: 'front' | 'back';
};

export type Mockup = {
  id: string;
  name: string;
  category: string;
  svg_front_url: string;
  svg_back_url?: string;
  print_areas: PrintArea[] | string;
  price_a3: number;
  price_a4: number;
  price_a5: number;
  price_a6: number;
  text_price_front: number;
  text_price_back: number;
  colors?: any;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};
