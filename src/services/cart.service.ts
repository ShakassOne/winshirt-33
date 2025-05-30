import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/supabase.types";

// Create a unique identifier for cart items based on product and customization
const createCartItemKey = (productId: string, customization?: any, color?: string, size?: string) => {
  const customizationString = customization ? JSON.stringify(customization) : '';
  const colorString = color || '';
  const sizeString = size || '';
  
  // Create a simple hash of the combination
  const combinedString = `${productId}-${customizationString}-${colorString}-${sizeString}`;
  return btoa(combinedString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
};

// Create or get cart token from the database
export const getOrCreateCartToken = async (token: string, userId?: string) => {
  try {
    console.log("Getting or creating cart token:", token, userId ? `for user: ${userId}` : "anonymous");
    
    // Check if token exists
    const { data: existingToken, error: fetchError } = await supabase
      .from('cart_tokens')
      .select('*')
      .eq('token', token)
      .single();
      
    // If token exists, handle it
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
        return updatedToken;
      }
      return existingToken;
    }
    
    // If error is something other than "not found", throw it
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Unexpected error fetching token:", fetchError);
      throw fetchError;
    }
    
    console.log("Creating new token:", token, userId ? `for user: ${userId}` : "anonymous");
    
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
        console.log("Token already exists due to race condition, fetching existing token");
        const { data: existingToken, error: refetchError } = await supabase
          .from('cart_tokens')
          .select('*')
          .eq('token', token)
          .single();
          
        if (refetchError) {
          console.error("Error refetching existing token:", refetchError);
          throw refetchError;
        }
        
        console.log("Successfully retrieved existing token after race condition:", existingToken);
        return existingToken;
      }
      
      console.error("Error inserting token:", insertError);
      throw insertError;
    }
    
    console.log("New token created:", newToken);
    return newToken;
    
  } catch (error) {
    console.error("Error in getOrCreateCartToken:", error);
    throw error;
  }
};

// Create or get cart session from the database
export const getOrCreateCartSession = async (token: string, userId?: string) => {
  try {
    console.log("Getting or creating cart session for token:", token);
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
    
    console.log("Creating new session with token:", token);
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
    
    console.log("New session created:", newSession);
    return newSession;
    
  } catch (error) {
    console.error("Error in getOrCreateCartSession:", error);
    throw error;
  }
};

// Add item to cart - modified to handle personalized products separately
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
    console.log("Adding item to cart with details:", {
      product_id: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      color: item.color || "N/A",
      size: item.size || "N/A",
      customization: item.customization
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

    console.log("Cart token:", cartToken);
    console.log("Cart session:", cartSession);
    
    // Create unique item key for personalized products
    const itemKey = createCartItemKey(item.productId, item.customization, item.color, item.size);
    console.log("Generated item key:", itemKey);
    
    // For personalized products, always check if exact same customization exists
    let whereClause = {
      cart_token_id: cartToken.id,
      product_id: item.productId
    };
    
    // If the product has customization, color, or size, we need to check for exact matches
    if (item.customization || item.color || item.size) {
      // Check for items with exact same customization, color, and size
      const { data: existingItems, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_token_id', cartToken.id)
        .eq('product_id', item.productId);
      
      if (fetchError) {
        console.error("Error fetching existing items:", fetchError);
        throw fetchError;
      }
      
      console.log("Existing items found:", existingItems);
      
      // Find exact match based on customization, color, and size
      const exactMatch = existingItems?.find(existingItem => {
        const customizationMatch = JSON.stringify(existingItem.customization) === JSON.stringify(item.customization);
        const colorMatch = existingItem.color === item.color;
        const sizeMatch = existingItem.size === item.size;
        
        return customizationMatch && colorMatch && sizeMatch;
      });
      
      if (exactMatch) {
        console.log("Found exact match, updating quantity:", exactMatch);
        
        // Update quantity if exact match exists
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ 
            quantity: exactMatch.quantity + item.quantity
          })
          .eq('id', exactMatch.id);
          
        if (updateError) {
          console.error("Error updating cart item:", updateError);
          throw updateError;
        }
        
        console.log("Item quantity updated successfully");
        return true;
      }
    } else {
      // For non-personalized products, use the original logic
      const { data: existingItems, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_token_id', cartToken.id)
        .eq('product_id', item.productId);
      
      if (fetchError) {
        console.error("Error fetching existing items:", fetchError);
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
        
        console.log("Item quantity updated successfully");
        return true;
      }
    }
    
    console.log("Inserting new item");
    
    // Prepare customization data
    let customizationData = item.customization;
    if (customizationData) {
      console.log("Item has customization:", customizationData);
    }

    // Log insertion attempt
    console.log("Attempting to insert cart item with:", {
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
    
    console.log("New item added to cart successfully:", insertedItem);
    
    console.log("Item added to cart successfully");
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
        products:product_id (id, name, image_url, price, description, available_colors, available_sizes)
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
      available_colors: item.products?.available_colors,
      available_sizes: item.products?.available_sizes,
      customization: item.customization as unknown as CartItem['customization'],
      cartItemId: item.id // Add cart item ID for easier removal
    }));
    
  } catch (error) {
    console.error("Error in getCartItems:", error);
    throw error;
  }
};

// Remove item from cart - updated to handle personalized products
export const removeFromCart = async (token: string, productIdOrKey: string, userId?: string) => {
  try {
    // Get cart token
    const cartToken = await getOrCreateCartToken(token, userId);
    
    console.log("Removing item from cart for token:", token);
    console.log("Cart token:", cartToken);
    console.log("Product ID or key to remove:", productIdOrKey);
    
    // Try to find by product ID first (backward compatibility)
    let { data: cartItems, error: fetchError } = await supabase
      .from('cart_items')
      .select('id')
      .eq('cart_token_id', cartToken.id)
      .eq('product_id', productIdOrKey);
      
    if (fetchError) throw fetchError;
    
    // If not found by product ID, it might be a removal key for personalized items
    if (!cartItems || cartItems.length === 0) {
      // For personalized items, we need to get all items and find the match
      const { data: allItems, error: allItemsError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_token_id', cartToken.id);
        
      if (allItemsError) throw allItemsError;
      
      console.log("All cart items for matching:", allItems);
      
      // Find item that matches the removal key
      const matchingItem = allItems?.find(item => {
        const itemKey = createCartItemKey(item.product_id, item.customization, item.color, item.size);
        return itemKey === productIdOrKey;
      });
      
      if (matchingItem) {
        cartItems = [{ id: matchingItem.id }];
      }
    }
    
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

// Update cart item quantity - updated to handle personalized products
export const updateCartItemQuantity = async (token: string, productIdOrKey: string, quantity: number, userId?: string) => {
  try {
    // Get cart token
    const cartToken = await getOrCreateCartToken(token, userId);
    
    console.log("Updating cart item quantity for token:", token);
    console.log("Cart token:", cartToken);
    console.log("Product ID or key:", productIdOrKey);
    console.log("New quantity:", quantity);
    
    // Try to find by product ID first (backward compatibility)
    let { data: cartItems, error: fetchError } = await supabase
      .from('cart_items')
      .select('id')
      .eq('cart_token_id', cartToken.id)
      .eq('product_id', productIdOrKey);
      
    if (fetchError) throw fetchError;
    
    // If not found by product ID, it might be a key for personalized items
    if (!cartItems || cartItems.length === 0) {
      // For personalized items, we need to get all items and find the match
      const { data: allItems, error: allItemsError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_token_id', cartToken.id);
        
      if (allItemsError) throw allItemsError;
      
      console.log("All cart items for matching:", allItems);
      
      // Find item that matches the key
      const matchingItem = allItems?.find(item => {
        const itemKey = createCartItemKey(item.product_id, item.customization, item.color, item.size);
        return itemKey === productIdOrKey;
      });
      
      if (matchingItem) {
        cartItems = [{ id: matchingItem.id }];
      }
    }
    
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
