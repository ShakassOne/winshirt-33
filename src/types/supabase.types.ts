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
