
// Types personnalisés pour compléter les types auto-générés de Supabase
import { Json } from "@/integrations/supabase/types";

// Type pour l'insertion d'un élément dans le panier
export interface CartItemInsert {
  cart_token_id: string;
  product_id: string;
  quantity: number;
  price: number;
  color?: string | null;
  size?: string | null;
  customization?: Json | null;
  cart_session_id?: string | null; // Rendu optionnel pour la compatibilité
}
