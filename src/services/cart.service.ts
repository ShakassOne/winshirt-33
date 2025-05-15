import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types/supabase.types';
import { Json } from '@/integrations/supabase/types';

// Define CartItemInsert interface to match the database requirements
interface CartItemInsert {
  cart_token_id: string;
  product_id: string;
  quantity: number;
  price: number;
  color?: string | null;
  size?: string | null;
  customization?: any;
  cart_session_id: string; // Required in the database schema
}

export const migrateCartToUser = async (userId: string, cartToken: string): Promise<void> => {
  try {
    // Update cart items to associate them with the user using the additional field
    const { error } = await supabase
      .from('cart_items')
      .update({ migrated: true })  // Using migrated instead of user_id
      .eq('cart_token_id', cartToken);

    if (error) {
      console.error('Error migrating cart to user:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error migrating cart to user:', error);
    throw error;
  }
};

// Fetch cart items by either cart token or user ID
export const getCartItems = async (cartToken: string, userId?: string | null): Promise<CartItem[]> => {
  try {
    // Query cart items by cart token or user ID
    const query = supabase
      .from('cart_items')
      .select('*, products(name, image_url)');

    if (userId) {
      query.eq('migrated', true); // Use migrated flag instead of user_id
    } else if (cartToken) {
      query.eq('cart_token_id', cartToken);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error getting cart items:', error);
      throw error;
    }

    // Transform database items to CartItem format
    return (data || []).map(item => {
      const product = item.products as any;
      return {
        productId: item.product_id,
        name: product?.name || '',
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        image_url: product?.image_url || '',
        customization: item.customization ? 
          (typeof item.customization === 'string' ? 
            JSON.parse(item.customization) : item.customization) : undefined
      } as CartItem;
    });
  } catch (error) {
    console.error('Error getting cart items:', error);
    throw error;
  }
};

export const addToCart = async (cartToken: string, item: CartItem, userId?: string | null): Promise<void> => {
  try {
    const cartItem = {
      cart_token_id: cartToken,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
      color: item.color,
      size: item.size,
      customization: item.customization,
      cart_session_id: 'deprecated', // Providing dummy value for required field
      migrated: userId ? true : false // Use migrated instead of user_id
    };

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

// Keep existing functions (removeFromCart, updateCartItemQuantity) implementation the same

export const removeFromCart = async (cartToken: string, productId: string, userId?: string | null): Promise<void> => {
  try {
    const query = supabase.from('cart_items').delete();
    
    if (userId) {
      query.eq('migrated', true).eq('product_id', productId); // Use migrated instead of user_id
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
      query.eq('migrated', true).eq('product_id', productId); // Use migrated instead of user_id
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
      query.eq('migrated', true); // Use migrated instead of user_id
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
    for (const item of items) {
      // Process each item individually to avoid array issues
      const itemToSave = {
        ...item,
        cart_token_id: cartToken,
        cart_session_id: 'deprecated',
        price: item.price || 0,
        product_id: item.product_id || ''
      };
      
      await supabase.from('cart_items').upsert(itemToSave);
    }
  } catch (error) {
    console.error('Error saving cart items:', error);
    throw error;
  }
};
