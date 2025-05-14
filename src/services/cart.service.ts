
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { CartItem } from '@/types/cart.types';

// Fonction pour générer un ID de session de panier unique
const generateCartSessionId = (): string => {
  // Utiliser l'ID de l'utilisateur authentifié s'il est disponible, sinon générer un ID de session unique
  const user = supabase.auth.getUser();
  if (user) {
    return user.data.user?.id || uuidv4();
  }
  
  // Récupérer l'ID de session de panier depuis le localStorage s'il existe
  const existingCartId = localStorage.getItem('cartSessionId');
  if (existingCartId) {
    return existingCartId;
  }
  
  // Générer un nouvel ID de session de panier
  const newCartId = uuidv4();
  localStorage.setItem('cartSessionId', newCartId);
  return newCartId;
};

// Fonction pour ajouter un produit au panier dans Supabase
export const addToCartSupabase = async (item: CartItem): Promise<boolean> => {
  try {
    const cartSessionId = generateCartSessionId();
    
    // Convertir l'objet CartItem au format attendu par la base de données
    const cartItemForDb = {
      cart_session_id: cartSessionId,
      product_id: item.productId,
      price: item.price,
      quantity: item.quantity,
      color: item.color || null,
      size: item.size || null,
      customization: item.customization || null
    };
    
    const { error } = await supabase
      .from('cart_items')
      .insert(cartItemForDb);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error);
    return false;
  }
};

// Fonction pour supprimer un produit du panier dans Supabase
export const removeFromCartSupabase = async (itemId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression du panier:", error);
    return false;
  }
};

// Fonction pour mettre à jour la quantité d'un produit dans le panier
export const updateCartItemQuantitySupabase = async (itemId: string, quantity: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du panier:", error);
    return false;
  }
};

// Fonction pour récupérer les produits du panier pour l'utilisateur actuel
export const getCartItemsSupabase = async (): Promise<CartItem[]> => {
  try {
    const cartSessionId = generateCartSessionId();
    
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products:product_id(*)')
      .eq('cart_session_id', cartSessionId);
    
    if (error) throw error;
    
    // Transformer les données pour correspondre à l'interface CartItem
    const cartItems: CartItem[] = data.map((item: any) => {
      return {
        id: item.id,
        productId: item.product_id,
        name: item.products?.name || '',
        price: item.price,
        quantity: item.quantity,
        image_url: item.products?.image_url || '',
        color: item.color || undefined,
        size: item.size || undefined,
        customization: item.customization ? JSON.parse(JSON.stringify(item.customization)) : undefined
      };
    });
    
    return cartItems;
  } catch (error) {
    console.error("Erreur lors de la récupération du panier:", error);
    return [];
  }
};

// Fonction pour vider le panier
export const clearCartSupabase = async (): Promise<boolean> => {
  try {
    const cartSessionId = generateCartSessionId();
    
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_session_id', cartSessionId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression du panier:", error);
    return false;
  }
};
