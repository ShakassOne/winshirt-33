
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
