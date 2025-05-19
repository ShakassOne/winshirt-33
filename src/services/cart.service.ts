
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/supabase.types";

// Create or get cart token from the database
export const getOrCreateCartToken = async (token: string, userId?: string) => {
  try {
    console.log("Getting or creating cart token:", { token, userId });
    
    // Check if token exists
    const { data: existingToken, error: fetchError } = await supabase
      .from('cart_tokens')
      .select('*')
      .eq('token', token)
      .single();
      
    if (!fetchError && existingToken) {
      console.log("Found existing token:", existingToken);
      
      // If token exists but we now have a user ID, update the token
      if (userId && !existingToken.user_id) {
        console.log("Updating token with user ID:", userId);
        
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
        
        console.log("Token updated successfully:", updatedToken);
        return updatedToken;
      }
      return existingToken;
    }
    
    // Create a new token if doesn't exist
    console.log("Creating new token:", { token, userId });
    
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
      console.error("Error creating new token:", insertError);
      throw insertError;
    }
    
    console.log("New token created successfully:", newToken);
    return newToken;
    
  } catch (error) {
    console.error("Error in getOrCreateCartToken:", error);
    throw error;
  }
};

// Create or get cart session from the database - legacy support
export const getOrCreateCartSession = async (token: string, userId?: string) => {
  try {
    console.log("Getting or creating cart session:", { token, userId });
    
    // Check if session exists
    const { data: existingSession, error: fetchError } = await supabase
      .from('cart_sessions')
      .select('*')
      .eq('session_id', token)
      .single();
      
    if (!fetchError && existingSession) {
      console.log("Found existing session:", existingSession);
      
      // If session exists but we now have a user ID, update the session
      if (userId && !existingSession.user_id) {
        console.log("Updating session with user ID:", userId);
        
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
    
    // Create a new session if doesn't exist
    console.log("Creating new session:", { token, userId });
    
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
      console.error("Error creating new session:", insertError);
      throw insertError;
    }
    
    console.log("New session created successfully:", newSession);
    return newSession;
    
  } catch (error) {
    console.error("Error in getOrCreateCartSession:", error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (token: string, item: CartItem, userId?: string) => {
  try {
    // Get or create cart token
    const cartToken = await getOrCreateCartToken(token, userId);
    
    // Get or create cart session for backward compatibility
    const cartSession = await getOrCreateCartSession(token, userId);

    console.log("Adding to cart with token:", token);
    console.log("Cart token:", cartToken);
    console.log("Cart session:", cartSession);
    console.log("Item to add:", item);
    
    // Check if item already exists in cart
    const { data: existingItems, error: fetchError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_token_id', cartToken.id)
      .eq('product_id', item.productId);
    
    if (fetchError) {
      console.error("Error checking for existing items:", fetchError);
      throw fetchError;
    }
    
    console.log("Existing items:", existingItems);
    
    if (existingItems && existingItems.length > 0) {
      const existingItem = existingItems[0];
      console.log("Updating existing item:", existingItem);
      
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
    } else {
      console.log("Inserting new item");
      // Insert new item - now cart_session_id is nullable so we can provide only cart_token_id
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert([
          {
            cart_token_id: cartToken.id,
            cart_session_id: cartSession.id, // Provide cart_session_id for backward compatibility
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price,
            color: item.color || null,
            size: item.size || null,
            customization: item.customization || null
          }
        ]);
        
      if (insertError) {
        console.error("Error inserting cart item:", insertError);
        throw insertError;
      }
    }
    
    console.log("Item added to cart successfully");
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
    
    console.log("Getting cart items for token:", token);
    console.log("Cart token:", cartToken);
    
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
    
    console.log("Cart items retrieved:", cartItems);
    
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
    
    console.log("Removing item from cart for token:", token);
    console.log("Cart token:", cartToken);
    console.log("Product ID to remove:", productId);
    
    // Find the cart item
    const { data: cartItems, error: fetchError } = await supabase
      .from('cart_items')
      .select('id')
      .eq('cart_token_id', cartToken.id)
      .eq('product_id', productId);
      
    if (fetchError) throw fetchError;
    
    console.log("Found cart items to remove:", cartItems);
    
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart item not found");
    }
    
    // Delete the item
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItems[0].id);
      
    if (error) throw error;
    
    console.log("Item removed successfully");
    
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
    
    console.log("Updating cart item quantity for token:", token);
    console.log("Cart token:", cartToken);
    console.log("Product ID:", productId);
    console.log("New quantity:", quantity);
    
    // Find the cart item
    const { data: cartItems, error: fetchError } = await supabase
      .from('cart_items')
      .select('id')
      .eq('cart_token_id', cartToken.id)
      .eq('product_id', productId);
      
    if (fetchError) throw fetchError;
    
    console.log("Found cart items to update:", cartItems);
    
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart item not found");
    }
    
    // Update the quantity
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItems[0].id);
      
    if (error) throw error;
    
    console.log("Item quantity updated successfully");
    
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
    
    console.log("Clearing cart for token:", token);
    console.log("Cart token:", cartToken);
    
    // Delete all items
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_token_id', cartToken.id);
      
    if (error) throw error;
    
    console.log("Cart cleared successfully");
    
  } catch (error) {
    console.error("Error in clearCart:", error);
    throw error;
  }
};

// Migrate cart from token to user
export const migrateCartToUser = async (userId: string, token: string) => {
  try {
    console.log("Migrating cart for token:", token, "to user:", userId);
    
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
    
    console.log("Found token data:", tokenData);
    
    // Update token with user_id
    const { error: updateError } = await supabase
      .from('cart_tokens')
      .update({ user_id: userId })
      .eq('id', tokenData.id);
      
    if (updateError) throw updateError;
    
    console.log("Updated token with user ID");
    
    // Check if there are other tokens for this user
    const { data: otherTokens, error: otherError } = await supabase
      .from('cart_tokens')
      .select('id')
      .eq('user_id', userId)
      .neq('id', tokenData.id);
      
    if (otherError) throw otherError;
    
    console.log("Found other tokens for user:", otherTokens);
    
    // If user has other tokens, merge the cart items
    if (otherTokens && otherTokens.length > 0) {
      for (const otherToken of otherTokens) {
        console.log("Processing other token:", otherToken);
        
        // Get items from other token
        const { data: otherItems, error: itemsError } = await supabase
          .from('cart_items')
          .select('*')
          .eq('cart_token_id', otherToken.id);
          
        if (itemsError) throw itemsError;
        
        console.log("Found items in other token:", otherItems);
        
        if (otherItems && otherItems.length > 0) {
          // For each item in other token, transfer to current token
          for (const item of otherItems) {
            console.log("Processing item from other token:", item);
            
            // Check if item already exists in current token
            const { data: existingItems, error: checkError } = await supabase
              .from('cart_items')
              .select('id, quantity')
              .eq('cart_token_id', tokenData.id)
              .eq('product_id', item.product_id);
              
            if (checkError) throw checkError;
            
            console.log("Existing items in current token:", existingItems);
            
            if (existingItems && existingItems.length > 0) {
              console.log("Updating quantity of existing item");
              
              // Update quantity if item exists
              const { error: updateQuantityError } = await supabase
                .from('cart_items')
                .update({ quantity: existingItems[0].quantity + item.quantity })
                .eq('id', existingItems[0].id);
                
              if (updateQuantityError) throw updateQuantityError;
              
              console.log("Updated quantity of existing item");
              
              // Delete item from other token
              await supabase
                .from('cart_items')
                .delete()
                .eq('id', item.id);
                
              console.log("Deleted item from other token");
            } else {
              console.log("Moving item to current token");
              
              // Update item to point to current token
              const { error: moveError } = await supabase
                .from('cart_items')
                .update({ cart_token_id: tokenData.id })
                .eq('id', item.id);
                
              if (moveError) throw moveError;
              
              console.log("Moved item to current token");
            }
          }
        }
        
        console.log("Deleting other token:", otherToken.id);
        
        // Delete the other token
        await supabase
          .from('cart_tokens')
          .delete()
          .eq('id', otherToken.id);
          
        console.log("Deleted other token");
      }
    }
    
    console.log("Cart migration completed successfully");
    
  } catch (error) {
    console.error("Error in migrateCartToUser:", error);
    throw error;
  }
};
