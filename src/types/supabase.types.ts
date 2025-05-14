
// Design
export interface Design {
  id: string;
  name: string;
  image_url: string;
  category: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// PrintArea
export interface PrintArea {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  side: 'front' | 'back';
  // Add position_x and position_y as aliases for x and y
  position_x?: number;
  position_y?: number;
}

// Import the MockupColor type from mockup.types to resolve circular dependency
import { MockupColor } from '@/types/mockup.types';

// Mockup
export interface Mockup {
  id: string;
  name: string;
  category: string;
  svg_front_url: string;
  svg_back_url?: string;
  price_a3: number;
  price_a4: number;
  price_a5: number;
  price_a6: number;
  text_price_front: number;
  text_price_back: number;
  print_areas: PrintArea[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  colors?: MockupColor[]; // Add colors property for mockup color variants
}

// Product
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_customizable: boolean;
  available_colors: string[];
  available_sizes: string[];
  color?: string;
  tickets_offered?: number;
  is_active?: boolean;
  mockup_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Lottery
export interface Lottery {
  id: string;
  title: string;
  description: string;
  image_url: string;
  value: number;
  goal: number;
  participants: number;
  draw_date: string;
  is_active?: boolean;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Cart Item
export interface CartItem {
  cartItemId?: string; // Add this field
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color?: string | null;
  size?: string | null;
  image_url: string;
  customization?: {
    designId: string;
    designName?: string;
    designUrl: string;
    printPosition: 'front' | 'back';
    printSize: string;
    transform?: {
      position: { x: number; y: number };
      scale: number;
      rotation: number;
    };
    text?: {
      content: string;
      font: string;
      color: string;
      printPosition: 'front' | 'back';
      transform?: {
        position: { x: number; y: number };
        scale: number;
        rotation: number;
      };
    };
  };
  lotteries?: string[];
}

// Order
export interface Order {
  id: string;
  user_id?: string;
  guest_email?: string;
  session_id?: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status?: 'pending' | 'paid' | 'failed';
  payment_intent_id?: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  delivery_notes?: string;
  created_at?: string;
  updated_at?: string;
}

// OrderItem
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  customization?: {
    designId: string;
    designUrl: string;
    printPosition: 'front' | 'back';
    printSize: string;
    text?: {
      content: string;
      font: string;
      color: string;
    };
  };
  created_at?: string;
}

// UserProfile
export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

// CartSession
export interface CartSession {
  id: string;
  user_id?: string;
  guest_email?: string;
  session_id: string;
  created_at?: string;
  updated_at?: string;
}
