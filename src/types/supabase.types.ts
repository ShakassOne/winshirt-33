
export interface User {
  id: string;
  email: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  role?: string;
  avatar_url?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  mockup_id?: string;
  tickets_offered: number;
  available_sizes: string[];
  available_colors: string[];
  is_active: boolean;
  is_customizable: boolean;
  created_at: string;
  updated_at: string;
  color: string;
}

export interface Design {
  id: string;
  name: string;
  image_url: string;
  category: string;
  is_active: boolean;
}

export interface PrintArea {
  id: string;
  side: 'front' | 'back';
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  name: string;
}

export interface Mockup {
  id: string;
  name: string;
  category: string;
  svg_front_url: string;
  svg_back_url?: string;
  print_areas: PrintArea[];
  colors: MockupColor[];
  price_a3: number;
  price_a4: number;
  price_a5: number;
  price_a6: number;
  text_price_front: number;
  text_price_back: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MockupColor {
  id: string;
  name: string;
  color_code: string;
  front_image_url: string;
  back_image_url?: string;
}

export interface Lottery {
  id: string;
  title: string;
  description: string;
  value: number;
  image_url: string;
  prize: string;
  category: string;
  draw_date: string;
  is_active: boolean;
  winner_user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image_url: string;
  lotteries?: string[];
  customization?: {
    frontDesign?: {
      designId: string;
      designName: string;
      designUrl: string;
      printSize: string;
      transform: {
        position: { x: number; y: number };
        scale: number;
        rotation: number;
      };
    };
    backDesign?: {
      designId: string;
      designName: string;
      designUrl: string;
      printSize: string;
      transform: {
        position: { x: number; y: number };
        scale: number;
        rotation: number;
      };
    };
    frontText?: {
      content: string;
      font: string;
      color: string;
      transform: {
        position: { x: number; y: number };
        scale: number;
        rotation: number;
      };
      styles: {
        bold: boolean;
        italic: boolean;
        underline: boolean;
      };
    };
    backText?: {
      content: string;
      font: string;
      color: string;
      transform: {
        position: { x: number; y: number };
        scale: number;
        rotation: number;
      };
      styles: {
        bold: boolean;
        italic: boolean;
        underline: boolean;
      };
    };
  };
}

export interface Order {
  id: string;
  user_id: string;
  session_id?: string;
  shipping_address: string;
  billing_address: string;
  shipping_method: string;
  shipping_price: number;
  payment_method: string;
  payment_status: string;
  delivery_notes?: string;
  total_price: number;
  items: CartItem[];
  created_at: string;
  updated_at: string;
  guest_email?: string;
  payment_intent_id?: string;
  tracking_number?: string;
  shipping_status?: string;
}

export interface OrderWithItems extends Order {
  items: CartItem[];
}
