import logger from '@/utils/logger';
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/supabase.types";

// Create or get cart token from the database
export const getOrCreateCartToken = async (token: string, userId?: string) => {
  try {
    logger.log("Getting or creating cart token:", token, userId ? `for user: ${userId}` : "anonymous");
    
    // Check if token exists
    const { data: existingToken, error: fetchError } = await supabase
      .from('cart_tokens')
      .select('*')
      .eq('token', token)
      .single();
      
    // If token exists, handle it
    if (!fetchError && existingToken) {
      logger.log("Found existing token:", existingToken);
      // If token exists but we now have a user ID, update the token
      if (userId && !existingToken.user_id) {
        logger.log("Updating token with user ID:", userId);
        const { data: updatedToken, error: updateError } = await supabase
          .from('cart_tokens')
          .update({ user_id: userId })
          .eq('id', existingToken.id)
          .select()
          .single();
          
        if (updateError) {
          console.error("Error updating token with user ID:", updateError);
          throw updateError;
        }
        return updatedToken;
      }
      return existingToken;
    }
    
    // If error is something other than "not found", throw it
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Unexpected error fetching token:", fetchError);
      throw fetchError;
    }
    
    logger.log("Creating new token:", token, userId ? `for user: ${userId}` : "anonymous");
    
    // Try to create a new token
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
      
    if (insertError) {
      // If it's a duplicate key error, try to fetch the existing token again
      if (insertError.code === '23505') {
        logger.log("Token already exists due to race condition, fetching existing token");
        const { data: existingToken, error: refetchError } = await supabase
          .from('cart_tokens')
          .select('*')
          .eq('token', token)
          .single();
          
        if (refetchError) {
          console.error("Error refetching existing token:", refetchError);
          throw refetchError;
        }
        
        logger.log("Successfully retrieved existing token after race condition:", existingToken);
        return existingToken;
      }
      
      console.error("Error inserting token:", insertError);
      throw insertError;
    }
    
    logger.log("New token created:", newToken);
    return newToken;
    
  } catch (error) {
    console.error("Error in getOrCreateCartToken:", error);
    throw error;
  }
};

// Create or get cart session from the database
export const getOrCreateCartSession = async (token: string, userId?: string) => {
  try {
    logger.log("Getting or creating cart session for token:", token);
    // Check if session exists
    const { data: existingSession, error: fetchError } = await supabase
      .from('cart_sessions')
      .select('*')
      .eq('session_id', token)
      .single();
      
    if (!fetchError && existingSession) {
      logger.log("Found existing session:", existingSession);
      // If session exists but we now have a user ID, update the session
      if (userId && !existingSession.user_id) {
        logger.log("Updating session with user ID:", userId);
        const { data: updatedSession, error: updateError } = await supabase
          .from('cart_sessions')
          .update({ user_id: userId })
          .eq('id', existingSession.id);
          
        if (updateError) {
          console.error("Error updating session with user ID:", updateError);
          throw updateError;
        }
      }
      return existingSession;
    }
    
    logger.log("Creating new session with token:", token);
    // Create a new session if doesn't exist
    const { data: newSession, error: insertError } = await supabase
      .from('cart_sessions')
      .insert([
        { 
          session_id: token,
          user_id: userId || null,
        }
      ])
      .select()
      .single();
      
    if (insertError) {
      console.error("Error inserting session:", insertError);
      throw insertError;
    }
    
    logger.log("New session created:", newSession);
    return newSession;
    
  } catch (error) {
    console.error("Error in getOrCreateCartSession:", error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (token: string, item: CartItem, userId?: string) => {
  try {
    if (!token) {
      console.error("Cannot add to cart: No token provided");
      throw new Error("No cart token provided");
    }
    
    if (!item.productId) {
      console.error("Cannot add to cart: No product ID provided");
      throw new Error("No product ID provided");
    }

    // Log item details for debugging
    logger.log("Adding item to cart with details:", {
      product_id: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      color: item.color || "N/A",
      size: item.size || "N/A"
    });
    
    // Get or create cart token
    const cartToken = await getOrCreateCartToken(token, userId);
    if (!cartToken || !cartToken.id) {
      console.error("Failed to get or create cart token");
      throw new Error("Failed to create cart session");
    }
    
    // Get or create cart session for backward compatibility
    const cartSession = await getOrCreateCartSession(token, userId);
    if (!cartSession || !cartSession.id) {
      console.error("Failed to get or create cart session");
      throw new Error("Failed to create cart session");
    }

    logger.log("Cart token:", cartToken);
    logger.log("Cart session:", cartSession);
    
    // Check if item already exists in cart
    const { data: existingItems, error: fetchError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_token_id', cartToken.id)
      .eq('product_id', item.productId);
    
    if (fetchError) {
      console.error("Error fetching existing items:", fetchError);
      throw fetchError;
    }
    
    logger.log("Existing items:", existingItems);
    
    if (existingItems && existingItems.length > 0) {
      const existingItem = existingItems[0];
      logger.log("Updating existing item:", existingItem);
      
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
        
      if (updateError) {
        console.error("Error updating cart item:", updateError);
        throw updateError;
      }
      
      logger.log("Item quantity updated successfully");
    } else {
      logger.log("Inserting new item");
      
      // Prepare customization data
      let customizationData = item.customization;
      if (customizationData) {
        logger.log("Item has customization:", customizationData);
      }

      // Log insertion attempt
      logger.log("Attempting to insert cart item with:", {
        cart_token_id: cartToken.id,
        cart_session_id: cartSession.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        color: item.color || null,
        size: item.size || null,
        customization: customizationData || null
      });
      
      // Insert new item
      const { data: insertedItem, error: insertError } = await supabase
        .from('cart_items')
        .insert([
          {
            cart_token_id: cartToken.id,
            cart_session_id: cartSession.id,
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price,
            color: item.color || null,
            size: item.size || null,
            customization: customizationData || null
          }
        ])
        .select();
        
      if (insertError) {
        console.error("Error inserting cart item:", insertError);
        throw insertError;
      }
      
      logger.log("New item added to cart successfully:", insertedItem);
    }
    
    logger.log("Item added to cart successfully");
    return true;
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
    
    logger.log("Getting cart items for token:", token);
    logger.log("Cart token:", cartToken);
    
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
        products:product_id (id, name, image_url, price, description, available_colors, available_sizes)
      `)
      .eq('cart_token_id', cartToken.id);
      
    if (error) {
      console.error("Error fetching cart items:", error);
      throw error;
    }
    
    logger.log("Cart items retrieved:", cartItems);
    
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
      available_colors: item.products?.available_colors,
      available_sizes: item.products?.available_sizes,
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
    
    logger.log("Removing item from cart for token:", token);
    logger.log("Cart token:", cartToken);
    logger.log("Product ID to remove:", productId);
    
    // Find the cart item
    const { data: cartItems, error: fetchError } = await supabase
      .from('cart_items')
      .select('id')
      .eq('cart_token_id', cartToken.id)
      .eq('product_id', productId);
      
    if (fetchError) throw fetchError;
    
    logger.log("Found cart items to remove:", cartItems);
    
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart item not found");
    }
    
    // Delete the item
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItems[0].id);
      
    if (error) throw error;
    
    logger.log("Item removed successfully");
    
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
    
    logger.log("Updating cart item quantity for token:", token);
    logger.log("Cart token:", cartToken);
    logger.log("Product ID:", productId);
    logger.log("New quantity:", quantity);
    
    // Find the cart item
    const { data: cartItems, error: fetchError } = await supabase
      .from('cart_items')
      .select('id')
      .eq('cart_token_id', cartToken.id)
      .eq('product_id', productId);
      
    if (fetchError) throw fetchError;
    
    logger.log("Found cart items to update:", cartItems);
    
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart item not found");
    }
    
    // Update the quantity
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItems[0].id);
      
    if (error) throw error;
    
    logger.log("Item quantity updated successfully");
    
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
    
    logger.log("Clearing cart for token:", token);
    logger.log("Cart token:", cartToken);
    
    // Delete all items
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_token_id', cartToken.id);
      
    if (error) throw error;
    
    logger.log("Cart cleared successfully");
    
  } catch (error) {
    console.error("Error in clearCart:", error);
    throw error;
  }
};

// Migrate cart from token to user
export const migrateCartToUser = async (userId: string, token: string) => {
  try {
    logger.log("Migrating cart for token:", token, "to user:", userId);
    
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
    
    logger.log("Found token data:", tokenData);
    
    // Update token with user_id
    const { error: updateError } = await supabase
      .from('cart_tokens')
      .update({ user_id: userId })
      .eq('id', tokenData.id);
      
    if (updateError) throw updateError;
    
    logger.log("Updated token with user ID");
    
    // Check if there are other tokens for this user
    const { data: otherTokens, error: otherError } = await supabase
      .from('cart_tokens')
      .select('id')
      .eq('user_id', userId)
      .neq('id', tokenData.id);
      
    if (otherError) throw otherError;
    
    logger.log("Found other tokens for user:", otherTokens);
    
    // If user has other tokens, merge the cart items
    if (otherTokens && otherTokens.length > 0) {
      for (const otherToken of otherTokens) {
        logger.log("Processing other token:", otherToken);
        
        // Get items from other token
        const { data: otherItems, error: itemsError } = await supabase
          .from('cart_items')
          .select('*')
          .eq('cart_token_id', otherToken.id);
          
        if (itemsError) throw itemsError;
        
        logger.log("Found items in other token:", otherItems);
        
        if (otherItems && otherItems.length > 0) {
          // For each item in other token, transfer to current token
          for (const item of otherItems) {
            logger.log("Processing item from other token:", item);
            
            // Check if item already exists in current token
            const { data: existingItems, error: checkError } = await supabase
              .from('cart_items')
              .select('id, quantity')
              .eq('cart_token_id', tokenData.id)
              .eq('product_id', item.product_id);
              
            if (checkError) throw checkError;
            
            logger.log("Existing items in current token:", existingItems);
            
            if (existingItems && existingItems.length > 0) {
              logger.log("Updating quantity of existing item");
              
              // Update quantity if item exists
              const { error: updateQuantityError } = await supabase
                .from('cart_items')
                .update({ quantity: existingItems[0].quantity + item.quantity })
                .eq('id', existingItems[0].id);
                
              if (updateQuantityError) throw updateQuantityError;
              
              logger.log("Updated quantity of existing item");
              
              // Delete item from other token
              await supabase
                .from('cart_items')
                .delete()
                .eq('id', item.id);
                
              logger.log("Deleted item from other token");
            } else {
              logger.log("Moving item to current token");
              
              // Update item to point to current token
              const { error: moveError } = await supabase
                .from('cart_items')
                .update({ cart_token_id: tokenData.id })
                .eq('id', item.id);
                
              if (moveError) throw moveError;
              
              logger.log("Moved item to current token");
            }
          }
        }
        
        logger.log("Deleting other token:", otherToken.id);
        
        // Delete the other token
        await supabase
          .from('cart_tokens')
          .delete()
          .eq('id', otherToken.id);
          
        logger.log("Deleted other token");
      }
    }
    
    logger.log("Cart migration completed successfully");
    
  } catch (error) {
    console.error("Error in migrateCartToUser:", error);
    throw error;
  }
};
