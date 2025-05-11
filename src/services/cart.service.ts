
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/supabase.types";

// Get or create cart session
export const getOrCreateCartSession = async (sessionId: string, guestEmail?: string) => {
  try {
    // Check if session exists
    const { data: existingSession, error: fetchError } = await supabase
      .from('cart_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();
      
    if (!fetchError && existingSession) {
      return existingSession;
    }
    
    // Create a new session if doesn't exist
    const { data: newSession, error: insertError } = await supabase
      .from('cart_sessions')
      .insert([
        { 
          session_id: sessionId,
          guest_email: guestEmail,
        }
      ])
      .select()
      .single();
      
    if (insertError) {
      throw insertError;
    }
    
    return newSession;
    
  } catch (error) {
    console.error("Error in getOrCreateCartSession:", error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (sessionId: string, item: CartItem) => {
  try {
    // Get or create cart session
    const cartSession = await getOrCreateCartSession(sessionId);
    
    // Check if item already exists in cart
    const { data: existingItem, error: fetchError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_session_id', cartSession.id)
      .eq('product_id', item.productId)
      .single();
    
    if (!fetchError && existingItem) {
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
      // Insert new item
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert([
          {
            cart_session_id: cartSession.id,
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price,
            color: item.color,
            size: item.size,
            customization: item.customization
          }
        ]);
        
      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error("Error in addToCart:", error);
    throw error;
  }
};

// Get cart items
export const getCartItems = async (sessionId: string): Promise<CartItem[]> => {
  try {
    // Get cart session
    const { data: sessionData } = await supabase
      .from('cart_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .single();
      
    if (!sessionData) {
      // Create new session if doesn't exist
      const cartSession = await getOrCreateCartSession(sessionId);
      return [];
    }
    
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
      .eq('cart_session_id', sessionData.id);
      
    if (error) throw error;
    
    // Map to CartItem type
    return cartItems.map(item => ({
      productId: item.products.id,
      name: item.products.name,
      price: parseFloat(item.price),
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      image_url: item.products.image_url,
      customization: item.customization
    }));
    
  } catch (error) {
    console.error("Error in getCartItems:", error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (sessionId: string, productId: string) => {
  try {
    // Get cart session
    const { data: sessionData } = await supabase
      .from('cart_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .single();
      
    if (!sessionData) {
      throw new Error("Cart session not found");
    }
    
    // Find the cart item
    const { data: cartItem } = await supabase
      .from('cart_items')
      .select('id')
      .eq('cart_session_id', sessionData.id)
      .eq('product_id', productId)
      .single();
      
    if (!cartItem) {
      throw new Error("Cart item not found");
    }
    
    // Delete the item
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItem.id);
      
    if (error) throw error;
    
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (sessionId: string, productId: string, quantity: number) => {
  try {
    // Get cart session
    const { data: sessionData } = await supabase
      .from('cart_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .single();
      
    if (!sessionData) {
      throw new Error("Cart session not found");
    }
    
    // Find the cart item
    const { data: cartItem } = await supabase
      .from('cart_items')
      .select('id')
      .eq('cart_session_id', sessionData.id)
      .eq('product_id', productId)
      .single();
      
    if (!cartItem) {
      throw new Error("Cart item not found");
    }
    
    // Update the quantity
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItem.id);
      
    if (error) throw error;
    
  } catch (error) {
    console.error("Error in updateCartItemQuantity:", error);
    throw error;
  }
};

// Clear cart
export const clearCart = async (sessionId: string) => {
  try {
    // Get cart session
    const { data: sessionData } = await supabase
      .from('cart_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .single();
      
    if (!sessionData) {
      return; // No items to clear
    }
    
    // Delete all items
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_session_id', sessionData.id);
      
    if (error) throw error;
    
  } catch (error) {
    console.error("Error in clearCart:", error);
    throw error;
  }
};
