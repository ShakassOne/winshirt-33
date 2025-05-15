
// Define the Json type to match the Supabase generated type
type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Types personnalisés pour compléter les types auto-générés de Supabase
export interface CartItemInsert {
  cart_token_id: string;
  product_id: string;
  quantity: number;
  price: number;
  color?: string | null;
  size?: string | null;
  customization?: Json | null;
  // Making cart_session_id required but we'll pass a dummy value
  cart_session_id: string;
}

// ThemeSetting interface for the theme_settings table
export interface ThemeSetting {
  id: string;
  name: string;
  value: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
