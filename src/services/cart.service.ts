import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/supabase.types";

// Get or create cart token from the database (corrigé anti-duplicate)
export const getOrCreateCartToken = async (token: string, userId?: string) => {
  try {
    console.log("🟡 [getOrCreateCartToken] try token:", token, userId ? `for user: ${userId}` : "anonymous");
    const { data: existingToken, error: fetchError } = await supabase
      .from('cart_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (existingToken) {
      console.log("🟢 [getOrCreateCartToken] Found existing token:", existingToken);
      if (userId && !existingToken.user_id) {
        console.log("🟢 [getOrCreateCartToken] Updating token with user ID:", userId);
        const { data: updatedToken, error: updateError } = await supabase
          .from('cart_tokens')
          .update({ user_id: userId })
          .eq('id', existingToken.id)
          .select()
          .single();

        if (updateError) {
          console.error("🔴 [getOrCreateCartToken] Error updating token with user ID:", updateError);
          throw updateError;
        }
        return updatedToken;
      }
      return existingToken;
    }

    console.log("🔵 [getOrCreateCartToken] Creating new token:", token, userId ? `for user: ${userId}` : "anonymous");
    const { data: newToken, error: insertError } = await supabase
      .from('cart_tokens')
      .insert([{ token: token, user_id: userId || null }])
      .select()
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        const { data: retryToken, error: retryError } = await supabase
          .from('cart_tokens')
          .select('*')
          .eq('token', token)
          .single();
        if (retryError) throw retryError;
        return retryToken;
      }
      console.error("🔴 [getOrCreateCartToken] Error inserting token:", insertError);
      throw insertError;
    }

    console.log("🟢 [getOrCreateCartToken] New token created:", newToken);
    return newToken;

  } catch (error) {
    console.error("🔴 [getOrCreateCartToken] Error:", error);
    throw error;
  }
};

export const getOrCreateCartSession = async (token: string, userId?: string) => {
  try {
    console.log("🟡 [getOrCreateCartSession] try session for token:", token);
    const { data: existingSession, error: fetchError } = await supabase
      .from('cart_sessions')
      .select('*')
      .eq('session_id', token)
      .single();

    if (!fetchError && existingSession) {
      if (userId && !existingSession.user_id) {
        const { data: updatedSession, error: updateError } = await supabase
          .from('cart_sessions')
          .update({ user_id: userId })
          .eq('id', existingSession.id);
        if (updateError) throw updateError;
      }
      return existingSession;
    }

    const { data: newSession, error: insertError } = await supabase
      .from('cart_sessions')
      .insert([{ session_id: token, user_id: userId || null }])
      .select()
      .single();
    if (insertError) throw insertError;
    return newSession;

  } catch (error) {
    console.error("🔴 [getOrCreateCartSession] Error:", error);
    throw error;
  }
};

// Add item to cart - LOG ULTRA DETAILLE
export const addToCart = async (token: string, item: CartItem, userId?: string) => {
  try {
    if (!token) throw new Error("No cart token provided");
    if (!item.productId) throw new Error("No product ID provided");

    console.log("🟡 [addToCart] Step 1 - getOrCreateCartToken...");
    const cartToken = await getOrCreateCartToken(token, userId);
    console.log("🟢 [addToCart] cartToken:", cartToken);

    if (!cartToken || !cartToken.id) throw new Error("Failed to create cart session");

    console.log("🟡 [addToCart] Step 2 - getOrCreateCartSession...");
    const cartSession = await getOrCreateCartSession(token, userId);
    console.log("🟢 [addToCart] cartSession:", cartSession);

    if (!cartSession || !cartSession.id) throw new Error("Failed to create cart session");

    console.log("🟡 [addToCart] Step 3 - Check existing items...");
    const { data: existingItems, error: fetchError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_token_id', cartToken.id)
      .eq('product_id', item.productId);

    if (fetchError) throw fetchError;
    console.log("🟢 [addToCart] Existing items:", existingItems);

    if (existingItems && existingItems.length > 0) {
      const existingItem = existingItems[0];
      console.log("🟡 [addToCart] Updating existing item:", existingItem);

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
      console.log("🟢 [addToCart] Item quantity updated successfully");
    } else {
      console.log("🟡 [addToCart] Inserting new item...");
      let customizationData = item.customization || null;
      const insertPayload = {
        cart_token_id: cartToken.id,
        cart_session_id: cartSession.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        color: item.color || null,
        size: item.size || null,
        customization: customizationData
      };
      console.log("🟦 [addToCart] PREPARE INSERT:", insertPayload);

      const { data: insertedItem, error: insertError } = await supabase
        .from('cart_items')
        .insert([insertPayload])
        .select();

      console.log("🟥 [addToCart] INSERT RESULT:", { insertedItem, insertError });

      if (insertError) throw insertError;
      console.log("🟢 [addToCart] New item added to cart successfully:", insertedItem);
    }

    return true;
  } catch (error) {
    console.error("🔴 [addToCart] Error:", error);
    throw error;
  }
};

// Get cart items
export const getCartItems = async (token: string, userId?: string): Promise<CartItem[]> => {
  try {
    const cartToken = await getOrCreateCartToken(token, userId);
    console.log("🟡 [getCartItems] Getting cart items for token:", token);
    console.log("🟢 [getCartItems] Cart token:", cartToken);

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
      console.error("🔴 [getCartItems] Error fetching cart items:", error);
      throw error;
    }

    console.log("🟢 [getCartItems] Cart items retrieved:", cartItems);

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
    console.error("🔴 [getCartItems] Error:", error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (token: string, productId: string, userId?: string) => {
  try {
    const cartToken = await getOrCreateCartToken(token, userId);

    const { data: cartItems, error: fetchError } = await supabase
      .from('cart_items')
      .select('id')
      .eq('cart_token_id', cartToken.id)
      .eq('product_id', productId);

    if (fetchError) throw fetchError;

    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart item not found");
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItems[0].id);

    if (error) throw error;

  } catch (error) {
    console.error("🔴 [removeFromCart] Error:", error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (token: string, productId: string, quantity: number, userId?: string) => {
  try {
    const cartToken = await getOrCreateCartToken(token, userId);

    const { data: cartItems, error: fetchError } = await supabase
      .from('cart_items')
      .select('id')
      .eq('cart_token_id', cartToken.id)
      .eq('product_id', productId);

    if (fetchError) throw fetchError;

    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart item not found");
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItems[0].id);

    if (error) throw error;

  } catch (error) {
    console.error("🔴 [updateCartItemQuantity] Error:", error);
    throw error;
  }
};

// Clear cart
export const clearCart = async (token: string, userId?: string) => {
  try {
    const cartToken = await getOrCreateCartToken(token, userId);

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_token_id', cartToken.id);

    if (error) throw error;

  } catch (error) {
    console.error("🔴 [clearCart] Error:", error);
    throw error;
  }
};

// Migrate cart from token to user
export const migrateCartToUser = async (userId: string, token: string) => {
  try {
    const { data: tokenData, error: tokenError } = await supabase
      .from('cart_tokens')
      .select('id')
      .eq('token', token)
      .single();

    if (tokenError) {
      if (tokenError.code === 'PGRST116') return;
      throw tokenError;
    }

    const { error: updateError } = await supabase
      .from('cart_tokens')
      .update({ user_id: userId })
      .eq('id', tokenData.id);

    if (updateError) throw updateError;

    const { data: otherTokens, error: otherError } = await supabase
      .from('cart_tokens')
      .select('id')
      .eq('user_id', userId)
      .neq('id', tokenData.id);

    if (otherError) throw otherError;

    if (otherTokens && otherTokens.length > 0) {
      for (const otherToken of otherTokens) {
        const { data: otherItems, error: itemsError } = await supabase
          .from('cart_items')
          .select('*')
          .eq('cart_token_id', otherToken.id);

        if (itemsError) throw itemsError;

        if (otherItems && otherItems.length > 0) {
          for (const item of otherItems) {
            const { data: existingItems, error: checkError } = await supabase
              .from('cart_items')
              .select('id, quantity')
              .eq('cart_token_id', tokenData.id)
              .eq('product_id', item.product_id);

            if (checkError) throw checkError;

            if (existingItems && existingItems.length > 0) {
              const { error: updateQuantityError } = await supabase
                .from('cart_items')
                .update({ quantity: existingItems[0].quantity + item.quantity })
                .eq('id', existingItems[0].id);

              if (updateQuantityError) throw updateQuantityError;

              await supabase
                .from('cart_items')
                .delete()
                .eq('id', item.id);
            } else {
              const { error: moveError } = await supabase
                .from('cart_items')
                .update({ cart_token_id: tokenData.id })
                .eq('id', item.id);

              if (moveError) throw moveError;
            }
          }
        }
        await supabase
          .from('cart_tokens')
          .delete()
          .eq('id', otherToken.id);
      }
    }

  } catch (error) {
    console.error("🔴 [migrateCartToUser] Error:", error);
    throw error;
  }
};

// IMPORTANT : export de TOUTES les fonctions
export {
  getOrCreateCartToken,
  getOrCreateCartSession,
  addToCart,
  getCartItems,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  migrateCartToUser,
};
