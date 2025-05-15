
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
  cart_session_id?: string | null; // Made optional for compatibility
}
