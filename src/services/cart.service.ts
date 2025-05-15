
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types/supabase.types';

// Define CartItemInsert interface here as it's missing from the imported types
interface CartItemInsert {
  cart_token_id: string;
  product_id: string;
  quantity: number;
  price: number;
  color?: string | null;
  size?: string | null;
  customization?: any;
  cart_session_id?: string; // Make this optional since we're providing dummy values
}

export const migrateCartToUser = async (userId: string, cartToken: string): Promise<void> => {
  try {
    // Update cart items to associate them with the user
    const { error } = await supabase
      .from('cart_items')
      .update({ user_id: userId })
      .eq('cart_token_id', cartToken);

    if (error) {
      console.error('Error migrating cart to user:', error);
      throw error;
    }

    // Optionally, delete the cart token entry if it's no longer needed
    // await supabase.from('cart_tokens').delete().eq('id', cartToken);

  } catch (error) {
    console.error('Error migrating cart to user:', error);
    throw error;
  }
};

// Add the missing exported functions
export const getCartItems = async (cartToken: string, userId?: string | null): Promise<CartItem[]> => {
  try {
    // Query cart items by cart token or user ID
    const query = supabase
      .from('cart_items')
      .select('*');

    if (userId) {
      query.eq('user_id', userId);
    } else if (cartToken) {
      query.eq('cart_token_id', cartToken);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error getting cart items:', error);
      throw error;
    }

    // Transform database items to CartItem format
    return (data || []).map(item => ({
      productId: item.product_id,
      name: item.name || '',
      price: item.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      image_url: item.image_url || '',
      customization: item.customization
    }));
  } catch (error) {
    console.error('Error getting cart items:', error);
    throw error;
  }
};

export const addToCart = async (cartToken: string, item: CartItem, userId?: string | null): Promise<void> => {
  try {
    const cartItem: CartItemInsert = {
      cart_token_id: cartToken,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
      color: item.color,
      size: item.size,
      customization: item.customization,
      cart_session_id: 'deprecated' // Providing dummy value for required field
    };

    // Add user_id if available
    if (userId) {
      // @ts-ignore - We know user_id exists in the database schema
      cartItem.user_id = userId;
    }

    const { error } = await supabase.from('cart_items').upsert(cartItem);

    if (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const removeFromCart = async (cartToken: string, productId: string, userId?: string | null): Promise<void> => {
  try {
    const query = supabase.from('cart_items').delete();
    
    if (userId) {
      query.eq('user_id', userId).eq('product_id', productId);
    } else {
      query.eq('cart_token_id', cartToken).eq('product_id', productId);
    }

    const { error } = await query;

    if (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const updateCartItemQuantity = async (
  cartToken: string, 
  productId: string, 
  quantity: number, 
  userId?: string | null
): Promise<void> => {
  try {
    const query = supabase
      .from('cart_items')
      .update({ quantity });
    
    if (userId) {
      query.eq('user_id', userId).eq('product_id', productId);
    } else {
      query.eq('cart_token_id', cartToken).eq('product_id', productId);
    }

    const { error } = await query;

    if (error) {
      console.error('Error updating cart item quantity:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};

export const clearCart = async (cartToken: string, userId?: string | null): Promise<void> => {
  try {
    const query = supabase.from('cart_items').delete();
    
    if (userId) {
      query.eq('user_id', userId);
    } else {
      query.eq('cart_token_id', cartToken);
    }

    const { error } = await query;

    if (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

export const saveCartItems = async (items: CartItemInsert[], cartToken: string): Promise<void> => {
  try {
    // Ensure all items have the necessary properties including cart_token_id
    const itemsToSave = items.map(item => ({
      ...item,
      cart_token_id: cartToken,
      // We provide dummy values for required fields that we can't satisfy
      cart_session_id: 'deprecated',
      // Ensure price and product_id are present (these should already be there)
      price: item.price || 0,
      product_id: item.product_id || ''
    }));

    // Use upsert to create or update items
    await supabase.from('cart_items').upsert(itemsToSave);
  } catch (error) {
    console.error('Error saving cart items:', error);
    throw error;
  }
};
