// Mise à jour des imports pour le service de panier
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { CartItem } from '@/types/supabase.types';

export const createCartSession = async (): Promise<string> => {
  const sessionId = uuidv4();
  return sessionId;
};

export const addCartItem = async (
  cartSessionId: string,
  productId: string,
  name: string,
  price: number,
  quantity: number,
  image_url: string,
  color?: string,
  size?: string,
  customization?: {
    text?: {
      content: string;
      font?: string;
      color?: string;
      size?: number;
    };
    designId?: string;
    designUrl?: string;
    position?: string;
    scale?: number;
  }
): Promise<CartItem | null> => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .insert([
        {
          cart_session_id: cartSessionId,
          product_id: productId,
          price: price,
          quantity: quantity,
          color: color || null,
          size: size || null,
          image_url: image_url,
          name: name,
          customization: customization
            ? {
                text: customization.text
                  ? {
                      content: customization.text.content,
                      font: customization.text.font || null,
                      color: customization.text.color || null,
                      size: customization.text.size || null,
                    }
                  : null,
                designId: customization.designId || null,
                designUrl: customization.designUrl || null,
                position: customization.position || null,
                scale: customization.scale || null,
              }
            : null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding cart item:', error);
      return null;
    }

    return data as CartItem;
  } catch (error) {
    console.error('Unexpected error adding cart item:', error);
    return null;
  }
};

export const getCartItems = async (cartSessionId: string): Promise<CartItem[]> => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_session_id', cartSessionId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }

    return data as CartItem[];
  } catch (error) {
    console.error('Unexpected error fetching cart items:', error);
    return [];
  }
};

export const removeCartItem = async (itemId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('cart_items').delete().eq('id', itemId);

    if (error) {
      console.error('Error removing cart item:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error removing cart item:', error);
    return false;
  }
};

export const updateCartItemQuantity = async (itemId: string, quantity: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (error) {
      console.error('Error updating cart item quantity:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error updating cart item quantity:', error);
    return false;
  }
};

export const clearCart = async (cartSessionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('cart_items').delete().eq('cart_session_id', cartSessionId);

    if (error) {
      console.error('Error clearing cart:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error clearing cart:', error);
    return false;
  }
};
