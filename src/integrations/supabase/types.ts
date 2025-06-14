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
      ai_generations: {
        Row: {
          cost: number | null
          created_at: string
          id: string
          image_url: string
          prompt: string
          session_token: string | null
          user_id: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string
          id?: string
          image_url: string
          prompt: string
          session_token?: string | null
          user_id?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string
          id?: string
          image_url?: string
          prompt?: string
          session_token?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_used: boolean | null
          prompt: string
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_used?: boolean | null
          prompt: string
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_used?: boolean | null
          prompt?: string
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          cart_session_id: string | null
          cart_token_id: string | null
          color: string | null
          created_at: string
          customization: Json | null
          id: string
          migrated: boolean | null
          price: number
          product_id: string
          quantity: number
          size: string | null
          updated_at: string
        }
        Insert: {
          cart_session_id?: string | null
          cart_token_id?: string | null
          color?: string | null
          created_at?: string
          customization?: Json | null
          id?: string
          migrated?: boolean | null
          price: number
          product_id: string
          quantity?: number
          size?: string | null
          updated_at?: string
        }
        Update: {
          cart_session_id?: string | null
          cart_token_id?: string | null
          color?: string | null
          created_at?: string
          customization?: Json | null
          id?: string
          migrated?: boolean | null
          price?: number
          product_id?: string
          quantity?: number
          size?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_token_id_fkey"
            columns: ["cart_token_id"]
            isOneToOne: false
            referencedRelation: "cart_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_sessions: {
        Row: {
          created_at: string
          guest_email: string | null
          id: string
          session_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          guest_email?: string | null
          id?: string
          session_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          guest_email?: string | null
          id?: string
          session_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      cart_tokens: {
        Row: {
          created_at: string
          id: string
          token: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          token: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          token?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
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
      dtf_production_status: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          notes: string | null
          order_id: string
          production_status: string
          started_at: string | null
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          order_id: string
          production_status?: string
          started_at?: string | null
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string
          production_status?: string
          started_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dtf_production_status_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          lottery_id: string | null
          order_id: string | null
          recipient_email: string
          recipient_name: string | null
          sent_at: string | null
          status: string
          subject: string
          template_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          lottery_id?: string | null
          order_id?: string | null
          recipient_email: string
          recipient_name?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          template_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          lottery_id?: string | null
          order_id?: string | null
          recipient_email?: string
          recipient_name?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_lottery_id_fkey"
            columns: ["lottery_id"]
            isOneToOne: false
            referencedRelation: "lotteries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_settings: {
        Row: {
          created_at: string
          from_email: string
          from_name: string
          id: string
          is_active: boolean
          smtp_host: string
          smtp_password: string
          smtp_port: number
          smtp_secure: boolean
          smtp_user: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_email?: string
          from_name?: string
          id?: string
          is_active?: boolean
          smtp_host?: string
          smtp_password: string
          smtp_port?: number
          smtp_secure?: boolean
          smtp_user: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_email?: string
          from_name?: string
          id?: string
          is_active?: boolean
          smtp_host?: string
          smtp_password?: string
          smtp_port?: number
          smtp_secure?: boolean
          smtp_user?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string
          html_content: string
          id: string
          is_active: boolean
          name: string
          subject: string
          type: string
          updated_at: string
          variables: Json
        }
        Insert: {
          created_at?: string
          html_content: string
          id?: string
          is_active?: boolean
          name: string
          subject: string
          type: string
          updated_at?: string
          variables?: Json
        }
        Update: {
          created_at?: string
          html_content?: string
          id?: string
          is_active?: boolean
          name?: string
          subject?: string
          type?: string
          updated_at?: string
          variables?: Json
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
      mockups: {
        Row: {
          category: string
          colors: Json | null
          created_at: string | null
          id: string
          is_active: boolean
          name: string
          price_a3: number
          price_a4: number
          price_a5: number
          price_a6: number
          print_areas: Json
          svg_back_url: string | null
          svg_front_url: string
          text_price_back: number
          text_price_front: number
          updated_at: string | null
        }
        Insert: {
          category: string
          colors?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean
          name: string
          price_a3?: number
          price_a4?: number
          price_a5?: number
          price_a6?: number
          print_areas?: Json
          svg_back_url?: string | null
          svg_front_url: string
          text_price_back?: number
          text_price_front?: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          colors?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price_a3?: number
          price_a4?: number
          price_a5?: number
          price_a6?: number
          print_areas?: Json
          svg_back_url?: string | null
          svg_front_url?: string
          text_price_back?: number
          text_price_front?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          customization: Json | null
          id: string
          lottery_name: string | null
          mockup_recto_url: string | null
          mockup_verso_url: string | null
          order_id: string
          price: number
          product_id: string
          quantity: number
          selected_color: string | null
          selected_size: string | null
          visual_back_url: string | null
          visual_front_url: string | null
        }
        Insert: {
          created_at?: string | null
          customization?: Json | null
          id?: string
          lottery_name?: string | null
          mockup_recto_url?: string | null
          mockup_verso_url?: string | null
          order_id: string
          price: number
          product_id: string
          quantity: number
          selected_color?: string | null
          selected_size?: string | null
          visual_back_url?: string | null
          visual_front_url?: string | null
        }
        Update: {
          created_at?: string | null
          customization?: Json | null
          id?: string
          lottery_name?: string | null
          mockup_recto_url?: string | null
          mockup_verso_url?: string | null
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
          selected_color?: string | null
          selected_size?: string | null
          visual_back_url?: string | null
          visual_front_url?: string | null
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
          delivery_notes: string | null
          guest_email: string | null
          hd_url: string | null
          id: string
          payment_intent_id: string | null
          payment_status: string | null
          preview_url: string | null
          session_id: string | null
          shipping_address: string | null
          shipping_city: string | null
          shipping_cost: number | null
          shipping_country: string | null
          shipping_email: string | null
          shipping_first_name: string | null
          shipping_last_name: string | null
          shipping_option_id: string | null
          shipping_phone: string | null
          shipping_postal_code: string | null
          status: string
          subtotal: number | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_notes?: string | null
          guest_email?: string | null
          hd_url?: string | null
          id?: string
          payment_intent_id?: string | null
          payment_status?: string | null
          preview_url?: string | null
          session_id?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_cost?: number | null
          shipping_country?: string | null
          shipping_email?: string | null
          shipping_first_name?: string | null
          shipping_last_name?: string | null
          shipping_option_id?: string | null
          shipping_phone?: string | null
          shipping_postal_code?: string | null
          status?: string
          subtotal?: number | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_notes?: string | null
          guest_email?: string | null
          hd_url?: string | null
          id?: string
          payment_intent_id?: string | null
          payment_status?: string | null
          preview_url?: string | null
          session_id?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_cost?: number | null
          shipping_country?: string | null
          shipping_email?: string | null
          shipping_first_name?: string | null
          shipping_last_name?: string | null
          shipping_option_id?: string | null
          shipping_phone?: string | null
          shipping_postal_code?: string | null
          status?: string
          subtotal?: number | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_shipping_option_id_fkey"
            columns: ["shipping_option_id"]
            isOneToOne: false
            referencedRelation: "shipping_options"
            referencedColumns: ["id"]
          },
        ]
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
          mockup_id: string | null
          model_3d_url: string | null
          name: string
          price: number
          tickets_offered: number | null
          updated_at: string | null
          use_3d_viewer: boolean | null
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
          mockup_id?: string | null
          model_3d_url?: string | null
          name: string
          price: number
          tickets_offered?: number | null
          updated_at?: string | null
          use_3d_viewer?: boolean | null
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
          mockup_id?: string | null
          model_3d_url?: string | null
          name?: string
          price?: number
          tickets_offered?: number | null
          updated_at?: string | null
          use_3d_viewer?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "products_mockup_id_fkey"
            columns: ["mockup_id"]
            isOneToOne: false
            referencedRelation: "mockups"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string | null
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
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
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
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shipping_options: {
        Row: {
          created_at: string
          description: string | null
          estimated_days_max: number
          estimated_days_min: number
          id: string
          is_active: boolean
          name: string
          price: number
          priority: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_days_max?: number
          estimated_days_min?: number
          id?: string
          is_active?: boolean
          name: string
          price?: number
          priority?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_days_max?: number
          estimated_days_min?: number
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          priority?: number
          updated_at?: string
        }
        Relationships: []
      }
      social_networks: {
        Row: {
          created_at: string
          icon: string
          id: string
          is_active: boolean
          name: string
          priority: number
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          icon: string
          id?: string
          is_active?: boolean
          name: string
          priority?: number
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          priority?: number
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      theme_settings: {
        Row: {
          accent_color: string
          background_image: string | null
          border_radius: number
          button_style: string
          created_at: string
          glassmorphism_intensity: number
          id: string
          primary_color: string
          star_density: number
          updated_at: string
        }
        Insert: {
          accent_color?: string
          background_image?: string | null
          border_radius?: number
          button_style?: string
          created_at?: string
          glassmorphism_intensity?: number
          id?: string
          primary_color?: string
          star_density?: number
          updated_at?: string
        }
        Update: {
          accent_color?: string
          background_image?: string | null
          border_radius?: number
          button_style?: string
          created_at?: string
          glassmorphism_intensity?: number
          id?: string
          primary_color?: string
          star_density?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
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
      generate_lottery_entries_for_order: {
        Args: { order_id_param: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          check_user_id: string
          required_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      migrate_cart_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      process_existing_orders_for_lottery: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user" | "dtf_supplier"
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
    Enums: {
      app_role: ["admin", "user", "dtf_supplier"],
    },
  },
} as const
