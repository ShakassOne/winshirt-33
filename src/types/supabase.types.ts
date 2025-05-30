export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cart_items: {
        Row: {
          cart_session_id: string | null
          cart_token_id: string | null
          color: string | null
          created_at: string
          customization: Json | null
          id: string
          price: number | null
          product_id: string | null
          quantity: number | null
          size: string | null
        }
        Insert: {
          cart_session_id?: string | null
          cart_token_id?: string | null
          color?: string | null
          created_at?: string
          customization?: Json | null
          id?: string
          price?: number | null
          product_id?: string | null
          quantity?: number | null
          size?: string | null
        }
        Update: {
          cart_session_id?: string | null
          cart_token_id?: string | null
          color?: string | null
          created_at?: string
          customization?: Json | null
          id?: string
          price?: number | null
          product_id?: string | null
          quantity?: number | null
          size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_session_id_fkey"
            columns: ["cart_session_id"]
            referencedRelation: "cart_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_cart_token_id_fkey"
            columns: ["cart_token_id"]
            referencedRelation: "cart_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      cart_sessions: {
        Row: {
          created_at: string
          id: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_sessions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cart_tokens: {
        Row: {
          created_at: string
          id: string
          token: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          token?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          token?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_tokens_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      lottery_entries: {
        Row: {
          created_at: string
          entry_number: number
          id: string
          lottery_id: string | null
          order_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          entry_number: number
          id?: string
          lottery_id?: string | null
          order_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          entry_number: number
          id?: string
          lottery_id?: string | null
          order_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lottery_entries_lottery_id_fkey"
            columns: ["lottery_id"]
            referencedRelation: "lotteries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lottery_entries_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lottery_entries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      lotteries: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          name: string | null
          number_of_entries: number | null
          product_id: string | null
          start_date: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          number_of_entries?: number | null
          product_id?: string | null
          start_date?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          number_of_entries?: number | null
          product_id?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lotteries_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          created_at: string
          customization: Json | null
          id: string
          lottery_name: string | null
          mockup_recto_url: string | null
          mockup_verso_url: string | null
          order_id: string | null
          price: number | null
          product_id: string | null
          quantity: number | null
          selected_color: string | null
          selected_size: string | null
        }
        Insert: {
          created_at?: string
          customization?: Json | null
          id?: string
          lottery_name?: string | null
          mockup_recto_url?: string | null
          mockup_verso_url?: string | null
          order_id?: string | null
          price?: number | null
          product_id?: string | null
          quantity?: number | null
          selected_color?: string | null
          selected_size?: string | null
        }
        Update: {
          created_at?: string
          customization?: Json | null
          id?: string
          lottery_name?: string | null
          mockup_recto_url?: string | null
          mockup_verso_url?: string | null
          order_id?: string | null
          price?: number | null
          product_id?: string | null
          quantity?: number | null
          selected_color?: string | null
          selected_size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          created_at: string
          delivery_notes: string | null
          guest_email: string | null
          id: string
          payment_intent_id: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          session_id: string | null
          shipping_address: string | null
          shipping_city: string | null
          shipping_country: string | null
          shipping_email: string | null
          shipping_first_name: string | null
          shipping_last_name: string | null
          shipping_option_id: string | null
          shipping_phone: string | null
          shipping_postal_code: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number | null
          total_amount: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          delivery_notes?: string | null
          guest_email?: string | null
          id?: string
          payment_intent_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          session_id?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_email?: string | null
          shipping_first_name?: string | null
          shipping_last_name?: string | null
          shipping_option_id?: string | null
          shipping_phone?: string | null
          shipping_postal_code?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number | null
          total_amount?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          delivery_notes?: string | null
          guest_email?: string | null
          id?: string
          payment_intent_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          session_id?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_email?: string | null
          shipping_first_name?: string | null
          shipping_last_name?: string | null
          shipping_option_id?: string | null
          shipping_phone?: string | null
          shipping_postal_code?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number | null
          total_amount?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_shipping_option_id_fkey"
            columns: ["shipping_option_id"]
            referencedRelation: "shipping_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          available_colors: string[] | null
          available_sizes: string[] | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string | null
          price: number | null
        }
        Insert: {
          available_colors?: string[] | null
          available_sizes?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          price?: number | null
        }
        Update: {
          available_colors?: string[] | null
          available_sizes?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          price?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          postal_code: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      shipping_options: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string | null
          price: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          price?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          price?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_lottery_entries_for_order: {
        Args: {
          order_id_param: string
        }
        Returns: undefined
      }
      get_lottery_numbers: {
        Args: {
          lottery_id_input: string
        }
        Returns: number[]
      }
      process_existing_orders_for_lottery: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      order_status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
      payment_status: "pending" | "paid" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & { [_ in never]: never })
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
      ? keyof Database["public"]["Tables"]
      : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName]["Row"]
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][TableName]["Row"]
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & { [_ in never]: never })
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

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & { [_ in never]: never })
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
      ? keyof Database["public"]["Tables"]
      : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName]["Update"]
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][TableName]["Update"]
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof (Database["public"]["Enums"] & { [_ in never]: never })
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
      ? keyof Database["public"]["Enums"]
      : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][EnumName]
    : never

export interface Product extends Tables<'products'> {}
export interface Profile extends Tables<'profiles'> {}
export interface ShippingOption extends Tables<'shipping_options'> {}
export interface Order extends Tables<'orders'> {}
export interface OrderItem extends Tables<'order_items'> {}
export interface Lottery extends Tables<'lotteries'> {}
export interface LotteryEntry extends Tables<'lottery_entries'> {}

export type OrderStatus = Enums<'order_status'>;
export type PaymentStatus = Enums<'payment_status'>;

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color?: string | null;
  size?: string | null;
  image_url?: string;
  available_colors?: string[];
  available_sizes?: string[];
  customization?: {
    designId?: string;
    customText?: string;
    mockupRectoUrl?: string;
    mockupVersoUrl?: string;
    selectedColor?: string;
    selectedSize?: string;
    lotteryName?: string;
  } | null;
  cartItemId?: string; // Add this for easier identification
}
