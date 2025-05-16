
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
          migrated: boolean | null
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
          migrated?: boolean | null
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
          migrated?: boolean | null
          price?: number | null
          product_id?: string | null
          quantity?: number | null
          size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      lotteries: {
        Row: {
          created_at: string
          description: string | null
          draw_date: string | null
          goal: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          participants: number | null
          title: string | null
          value: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          draw_date?: string | null
          goal?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          participants?: number | null
          title?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          draw_date?: string | null
          goal?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          participants?: number | null
          title?: string | null
          value?: number | null
        }
        Relationships: []
      }
      products: {
        Row: {
          available_colors: string[] | null
          available_sizes: string[] | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_customizable: boolean | null
          name: string | null
          price: number | null
          rating: number | null
          tickets_offered: number | null
        }
        Insert: {
          available_colors?: string[] | null
          available_sizes?: string[] | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_customizable?: boolean | null
          name?: string | null
          price?: number | null
          rating?: number | null
          tickets_offered?: number | null
        }
        Update: {
          available_colors?: string[] | null
          available_sizes?: string[] | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_customizable?: boolean | null
          name?: string | null
          price?: number | null
          rating?: number | null
          tickets_offered?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_fkey"
            columns: ["category"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
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
    | keyof (Database["public"]["Tables"] & { Row: any })
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName]["Row"]
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] & { Row: any })
    ? (Database["public"]["Tables"] & { Row: any })[PublicTableNameOrOptions]["Row"]
    : never

// Types additionnels pour l'application

// Type pour les loteries
export interface LotteryItem {
  id: string;
  title: string;
  value: number;
  image_url: string;
  description?: string;
  draw_date?: string;
  participants?: number;
  goal?: number;
  is_active?: boolean;
  is_featured?: boolean;
}

// Type complet pour Lottery
export interface Lottery extends LotteryItem {
  created_at?: string;
  updated_at?: string;
}

// Type pour les produits
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  rating?: number;
  available_colors?: string[];
  available_sizes?: string[];
  is_customizable?: boolean;
  tickets_offered?: number;
  created_at?: string;
  color?: string;
  mockup_id?: string;
  is_active?: boolean;
}

// Type pour les designs
export interface Design {
  id: string;
  name: string;
  category: string;
  image_url: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Type pour les mockups
export interface Mockup {
  id: string;
  name: string;
  category: string;
  svg_front_url: string;
  svg_back_url?: string;
  print_areas: PrintArea[];
  colors?: any[];
  price_a3: number;
  price_a4: number;
  price_a5: number;
  price_a6: number;
  text_price_front: number;
  text_price_back: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Type pour les zones d'impression
export interface PrintArea {
  id: string;
  name: string;
  width: number;
  height: number;
  position_x: number;
  position_y: number;
  side: 'front' | 'back';
  x?: number; // Alias pour position_x
  y?: number; // Alias pour position_y
}

// Type pour les éléments du panier
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image_url: string;
  customization?: {
    selectedLotteries?: string[];
    text_front?: string;
    text_back?: string;
    design_id?: string;
    design_url?: string;
  };
}
