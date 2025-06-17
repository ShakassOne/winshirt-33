
export interface Database {
  public: {
    Tables: {
      cart_items: {
        Row: {
          cart_token: string
          color: string | null
          created_at: string
          id: string
          image_url: string | null
          name: string | null
          price: number | null
          product_id: string | null
          quantity: number | null
          size: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cart_token: string
          color?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string | null
          price?: number | null
          product_id?: string | null
          quantity?: number | null
          size?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cart_token?: string
          color?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string | null
          price?: number | null
          product_id?: string | null
          quantity?: number | null
          size?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      carts: {
        Row: {
          cart_token: string
          created_at: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cart_token: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cart_token?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & { row: any })
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        { row: any })
      ? keyof Database["public"]["Tables"]
      : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName]["Row"]
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][TableName]["Row"]
    : never

export type TableInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
      ? keyof Database["public"]["Tables"]
      : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName]["Insert"]
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][TableName]["Insert"]
    : never

// ==============================
// INTERFACES PERSONNALISÉES
// ==============================

export interface Design {
  id: string;
  name: string;
  image_url: string;
  category: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Mockup {
  id: string;
  name: string;
  category: string;
  svg_front_url: string;
  svg_back_url?: string;
  print_areas: any[];
  colors?: string[];
  price_a4: number;
  price_a3: number;
  price_a5: number;
  price_a6: number;
  text_price_front: number;
  text_price_back: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  available_sizes: string[];
  available_colors: string[];
  is_customizable: boolean;
  is_active: boolean;
  tickets_offered: number;
  mockup_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Lottery {
  id: string;
  title: string;
  description: string;
  image_url: string;
  value: number;
  goal: number;
  participants: number;
  draw_date: string;
  is_active: boolean;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SocialNetwork {
  id: string;
  name: string;
  url?: string;
  icon: string;
  is_active: boolean;
  priority: number;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  user_id?: string;
  guest_email?: string;
  total_amount: number;
  subtotal?: number;
  shipping_cost?: number;
  status: string;
  payment_status?: string;
  payment_intent_id?: string;
  shipping_first_name?: string;
  shipping_last_name?: string;
  shipping_email?: string;
  shipping_phone?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  delivery_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  selected_size?: string;
  selected_color?: string;
  customization?: any;
  lottery_name?: string;
  mockup_recto_url?: string;
  mockup_verso_url?: string;
  visual_front_url?: string;
  visual_back_url?: string;
  created_at?: string;
}

export interface ExtendedOrder extends Order {
  items: ExtendedOrderItem[];
}

export interface ExtendedOrderItem extends OrderItem {
  product: Product;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  size?: string;
  color?: string;
  available_sizes?: string[];
  available_colors?: string[];
  lotteries?: Lottery[];
  customization?: {
    // Structure ancienne (rétrocompatibilité)
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
    
    // Nouvelle structure
    frontDesign?: {
      designUrl: string;
      designName: string;
      transform: {
        scale: number;
        position: { x: number; y: number };
        rotation: number;
      };
    };
    backDesign?: {
      designUrl: string;
      designName: string;
      transform: {
        scale: number;
        position: { x: number; y: number };
        rotation: number;
      };
    };
    frontText?: {
      content: string;
      font: string;
      color: string;
      styles: { bold: boolean; italic: boolean; underline: boolean };
      transform: {
        scale: number;
        position: { x: number; y: number };
        rotation: number;
      };
    };
    backText?: {
      content: string;
      font: string;
      color: string;
      styles: { bold: boolean; italic: boolean; underline: boolean };
      transform: {
        scale: number;
        position: { x: number; y: number };
        rotation: number;
      };
    };
    
    // URLs de capture générées
    hdRectoUrl?: string;
    hdVersoUrl?: string;
    visual_front_url?: string;
    visual_back_url?: string;
  };
}
