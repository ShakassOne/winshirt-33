import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/supabase.types";

// Create or get cart token from the database
export const getOrCreateCartToken = async (token: string, userId?: string) => {
  try {
    // Check if token exists
    const { data: existingToken, error: fetchError } = await supabase
      .from('cart_tokens')
      .select('*')
      .eq('token', token)
      .single();
      
    if (!fetchError && existingToken) {
      // If token exists but we now have a user ID, update the token
      if (userId && !existingToken.user_id) {
        const { data: updatedToken, error: updateError } = await supabase
          .from('cart_tokens')
          .update({ user_id: userId })
          .eq('id', existingToken.id)
          .select()
          .single();
          
        if (updateError) throw updateError;
        return updatedToken;
      }
      return existingToken;
    }
    
    // Create a new token if doesn't exist
    const { data: newToken, error: insertError } = await supabase
      .from('cart_tokens')
      .insert([
        { 
          token: token,
          user_id: userId || null,
        }
      ])
      .select()
      .single();
      
    if (insertError) throw insertError;
    
    return newToken;
    
  } catch (error) {
    console.error("Error in getOrCreateCartToken:", error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (token: string, item: CartItem, userId?: string) => {
  try {
    // Get or create cart token
    const cartToken = await getOrCreateCartToken(token, userId);
    
    // Check if item already exists in cart
    const { data: existingItems, error: fetchError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_token_id', cartToken.id)
      .eq('product_id', item.productId);
    
    if (fetchError) throw fetchError;
    
    if (existingItems && existingItems.length > 0) {
      const existingItem = existingItems[0];
      // Update quantity if item exists
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ 
          quantity: existingItem.quantity + item.quantity,
          customization: item.customization || existingItem.customization,
          color: item.color || existingItem.color,
          size: item.size || existingItem.size
        })
        .eq('id', existingItem.id);
        
      if (updateError) throw updateError;
    } else {
      // Insert new item - Fix: adding cart_session_id as null since we're using cart_token_id now
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert({
          cart_session_id: null, // This is required by the schema but we're not using it
          cart_token_id: cartToken.id,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
          color: item.color || null,
          size: item.size || null,
          customization: item.customization || null
        });
        
      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error("Error in addToCart:", error);
    throw error;
  }
};

// Get cart items
export const getCartItems = async (token: string, userId?: string): Promise<CartItem[]> => {
  try {
    // Get cart token
    const cartToken = await getOrCreateCartToken(token, userId);
    
    // Get cart items with product details
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        color,
        size,
        price,
        customization,
        products:product_id (id, name, image_url, price, description)
      `)
      .eq('cart_token_id', cartToken.id);
      
    if (error) {
      console.error("Error fetching cart items:", error);
      throw error;
    }
    
    if (!cartItems || cartItems.length === 0) {
      return [];
    }
    
    // Map to CartItem type
    return cartItems.map(item => ({
      productId: item.products?.id,
      name: item.products?.name,
      price: parseFloat(item.price as unknown as string),
      quantity: item.quantity,
      color: item.color || null,
      size: item.size || null,
      image_url: item.products?.image_url,
      customization: item.customization as unknown as CartItem['customization']
    }));
    
  } catch (error) {
    console.error("Error in getCartItems:", error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (token: string, productId: string, userId?: string) => {
  try {
    // Get cart token
    const cartToken = await getOrCreateCartToken(token, userId);
    
    // Find the cart item
    const { data: cartItems, error: fetchError } = await supabase
      .from('cart_items')
      .select('id')
      .eq('cart_token_id', cartToken.id)
      .eq('product_id', productId);
      
    if (fetchError) throw fetchError;
    
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart item not found");
    }
    
    // Delete the item
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItems[0].id);
      
    if (error) throw error;
    
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (token: string, productId: string, quantity: number, userId?: string) => {
  try {
    // Get cart token
    const cartToken = await getOrCreateCartToken(token, userId);
    
    // Find the cart item
    const { data: cartItems, error: fetchError } = await supabase
      .from('cart_items')
      .select('id')
      .eq('cart_token_id', cartToken.id)
      .eq('product_id', productId);
      
    if (fetchError) throw fetchError;
    
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart item not found");
    }
    
    // Update the quantity
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItems[0].id);
      
    if (error) throw error;
    
  } catch (error) {
    console.error("Error in updateCartItemQuantity:", error);
    throw error;
  }
};

// Clear cart
export const clearCart = async (token: string, userId?: string) => {
  try {
    // Get cart token
    const cartToken = await getOrCreateCartToken(token, userId);
    
    // Delete all items
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_token_id', cartToken.id);
      
    if (error) throw error;
    
  } catch (error) {
    console.error("Error in clearCart:", error);
    throw error;
  }
};

// Migrate cart from token to user
export const migrateCartToUser = async (userId: string, token: string) => {
  try {
    // Find token entry
    const { data: tokenData, error: tokenError } = await supabase
      .from('cart_tokens')
      .select('id')
      .eq('token', token)
      .single();
      
    if (tokenError) {
      // If no token exists yet, no need to migrate
      if (tokenError.code === 'PGRST116') return;
      throw tokenError;
    }
    
    // Update token with user_id
    const { error: updateError } = await supabase
      .from('cart_tokens')
      .update({ user_id: userId })
      .eq('id', tokenData.id);
      
    if (updateError throw updateError;
    
    // Check if there are other tokens for this user
    const { data: otherTokens, error: otherError } = await supabase
      .from('cart_tokens')
      .select('id')
      .eq('user_id', userId)
      .neq('id', tokenData.id);
      
    if (otherError) throw otherError;
    
    // If user has other tokens, merge the cart items
    if (otherTokens && otherTokens.length > 0) {
      for (const otherToken of otherTokens) {
        // Get items from other token
        const { data: otherItems, error: itemsError } = await supabase
          .from('cart_items')
          .select('*')
          .eq('cart_token_id', otherToken.id);
          
        if (itemsError) throw itemsError;
        
        if (otherItems && otherItems.length > 0) {
          // For each item in other token, transfer to current token
          for (const item of otherItems) {
            // Check if item already exists in current token
            const { data: existingItems, error: checkError } = await supabase
              .from('cart_items')
              .select('id, quantity')
              .eq('cart_token_id', tokenData.id)
              .eq('product_id', item.product_id);
              
            if (checkError) throw checkError;
            
            if (existingItems && existingItems.length > 0) {
              // Update quantity if item exists
              const { error: updateQuantityError } = await supabase
                .from('cart_items')
                .update({ quantity: existingItems[0].quantity + item.quantity })
                .eq('id', existingItems[0].id);
                
              if (updateQuantityError) throw updateQuantityError;
              
              // Delete item from other token
              await supabase
                .from('cart_items')
                .delete()
                .eq('id', item.id);
            } else {
              // Update item to point to current token
              const { error: moveError } = await supabase
                .from('cart_items')
                .update({ cart_token_id: tokenData.id })
                .eq('id', item.id);
                
              if (moveError) throw moveError;
            }
          }
        }
        
        // Delete the other token
        await supabase
          .from('cart_tokens')
          .delete()
          .eq('id', otherToken.id);
      }
    }
    
  } catch (error) {
    console.error("Error in migrateCartToUser:", error);
    throw error;
  }
};
