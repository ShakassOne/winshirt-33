export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      designs: {
        Row: {
          category: string
          created_at: string | null
          id: string
          image_url: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lotteries: {
        Row: {
          created_at: string | null
          description: string
          draw_date: string
          goal: number
          id: string
          image_url: string
          is_active: boolean | null
          is_featured: boolean | null
          participants: number | null
          title: string
          updated_at: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          description: string
          draw_date: string
          goal: number
          id?: string
          image_url: string
          is_active?: boolean | null
          is_featured?: boolean | null
          participants?: number | null
          title: string
          updated_at?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          description?: string
          draw_date?: string
          goal?: number
          id?: string
          image_url?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          participants?: number | null
          title?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: []
      }
      lottery_entries: {
        Row: {
          created_at: string | null
          id: string
          lottery_id: string
          order_item_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lottery_id: string
          order_item_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lottery_id?: string
          order_item_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lottery_entries_lottery_id_fkey"
            columns: ["lottery_id"]
            isOneToOne: false
            referencedRelation: "lotteries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lottery_entries_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          customization: Json | null
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          customization?: Json | null
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string | null
          customization?: Json | null
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: string
          shipping_address: Json | null
          status: string
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          shipping_address?: Json | null
          status?: string
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          shipping_address?: Json | null
          status?: string
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          available_colors: string[] | null
          available_sizes: string[] | null
          category: string
          color: string | null
          created_at: string | null
          description: string
          id: string
          image_url: string
          is_active: boolean | null
          is_customizable: boolean | null
          name: string
          price: number
          tickets_offered: number | null
          updated_at: string | null
        }
        Insert: {
          available_colors?: string[] | null
          available_sizes?: string[] | null
          category: string
          color?: string | null
          created_at?: string | null
          description: string
          id?: string
          image_url: string
          is_active?: boolean | null
          is_customizable?: boolean | null
          name: string
          price: number
          tickets_offered?: number | null
          updated_at?: string | null
        }
        Update: {
          available_colors?: string[] | null
          available_sizes?: string[] | null
          category?: string
          color?: string | null
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string
          is_active?: boolean | null
          is_customizable?: boolean | null
          name?: string
          price?: number
          tickets_offered?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      winners: {
        Row: {
          claimed: boolean | null
          created_at: string | null
          id: string
          lottery_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          claimed?: boolean | null
          created_at?: string | null
          id?: string
          lottery_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          claimed?: boolean | null
          created_at?: string | null
          id?: string
          lottery_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "winners_lottery_id_fkey"
            columns: ["lottery_id"]
            isOneToOne: false
            referencedRelation: "lotteries"
            referencedColumns: ["id"]
          },
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
