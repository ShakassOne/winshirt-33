import { supabase } from '@/integrations/supabase/client';
import { CartItemInsert } from '@/types/cart.types';

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
