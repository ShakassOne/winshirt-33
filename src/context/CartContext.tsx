
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CartContextType } from '@/types/cart.types';
import { CartItem } from '@/types/supabase.types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { addToCart, getCartItems, removeFromCart, updateCartItemQuantity, clearCart as clearCartService } from '@/services/cart.service';

// Export the CartContext so it can be imported by useCart hook
export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [fetchAttempted, setFetchAttempted] = useState(false);
  
  // Generate a session ID if not exists
  useEffect(() => {
    const storedSessionId = localStorage.getItem('cart_session_id');
    if (!storedSessionId) {
      const newSessionId = uuidv4();
      localStorage.setItem('cart_session_id', newSessionId);
      setSessionId(newSessionId);
    } else {
      setSessionId(storedSessionId);
    }
  }, []);
  
  // Load cart items when session ID is available
  useEffect(() => {
    if (sessionId) {
      loadCartItems();
    }
  }, [sessionId]);
  
  // Listen for auth state changes to link cart with user
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Update existing cart session with user ID
        await linkCartToUser(session.user.id);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadCartItems = async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
    setFetchAttempted(true);
    
    try {
      const cartItems = await getCartItems(sessionId);
      console.log("Loaded cart items:", cartItems);
      setItems(cartItems || []); // Ensure we set an empty array if null is returned
    } catch (err: any) {
      setError(err.message);
      console.error("Error in getCartItems: ", err);
      // Handle the case where Supabase might be down or unavailable
      // Continue with local cart items if any are stored
      const localCartItems = localStorage.getItem('cart_items');
      if (localCartItems) {
        try {
          const parsedItems = JSON.parse(localCartItems);
          setItems(parsedItems);
        } catch (parseErr) {
          console.error("Error parsing local cart items:", parseErr);
        }
      }
    } finally {
      setIsLoading(false);
      console.log("Cart items loaded successfully");
    }
  };
  
  const linkCartToUser = async (userId: string) => {
    if (!sessionId) return;
    
    try {
      // Logic to update cart_sessions with user_id
      const { error } = await supabase
        .from('cart_sessions')
        .update({ user_id: userId })
        .eq('session_id', sessionId);
        
      if (error) throw error;
    } catch (err: any) {
      console.error("Erreur lors de la liaison du panier à l'utilisateur:", err);
      // Don't show error to user as this is a background operation
    }
  };
  
  const addItem = async (item: CartItem) => {
    if (!sessionId) return;
    
    setIsLoading(true);
    try {
      console.log("Adding item to cart:", item, "with sessionId:", sessionId);
      
      // Better UX by updating local state immediately
      setItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(i => i.productId === item.productId);
        if (existingItemIndex >= 0) {
          // Update existing item
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + item.quantity
          };
          return updatedItems;
        } else {
          // Add new item
          return [...prevItems, item];
        }
      });
      
      // Store items in localStorage as backup
      const updatedItems = [...items];
      if (!updatedItems.some(i => i.productId === item.productId)) {
        updatedItems.push(item);
      } else {
        const existingIndex = updatedItems.findIndex(i => i.productId === item.productId);
        updatedItems[existingIndex].quantity += item.quantity;
      }
      localStorage.setItem('cart_items', JSON.stringify(updatedItems));
      
      // Call API to add to cart in database
      try {
        await addToCart(sessionId, item);
      } catch (err) {
        console.error("Failed to save to Supabase, but item is saved locally:", err);
      }
      
      // Success notification
      toast.success("Produit ajouté au panier");
      
      // Reload items to ensure consistency with server
      await loadCartItems();
    } catch (err: any) {
      setError(err.message);
      console.error("Error in addToCart: ", err);
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeItem = async (productId: string) => {
    if (!sessionId) return;
    
    setIsLoading(true);
    try {
      // Update local state immediately
      setItems(prevItems => prevItems.filter(item => item.productId !== productId));
      
      // Update localStorage
      const filteredItems = items.filter(item => item.productId !== productId);
      localStorage.setItem('cart_items', JSON.stringify(filteredItems));
      
      // Try to update remote storage
      try {
        await removeFromCart(sessionId, productId);
      } catch (err) {
        console.error("Failed to remove from Supabase, but item is removed locally:", err);
      }
      
      toast.success("Produit retiré du panier");
    } catch (err: any) {
      setError(err.message);
      console.error("Error in removeFromCart: ", err);
      toast.error("Erreur lors du retrait du produit");
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateItemQuantity = async (productId: string, quantity: number) => {
    if (!sessionId || quantity < 1) return;
    
    setIsLoading(true);
    try {
      // Update local state immediately
      setItems(prevItems => 
        prevItems.map(item => 
          item.productId === productId ? { ...item, quantity } : item
        )
      );
      
      // Update localStorage
      const updatedItems = items.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('cart_items', JSON.stringify(updatedItems));
      
      // Try to update remote storage
      try {
        await updateCartItemQuantity(sessionId, productId, quantity);
      } catch (err) {
        console.error("Failed to update quantity in Supabase, but updated locally:", err);
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error in updateItemQuantity: ", err);
      toast.error("Erreur lors de la mise à jour de la quantité");
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearCart = async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
    try {
      // Update local state immediately
      setItems([]);
      
      // Update localStorage
      localStorage.setItem('cart_items', JSON.stringify([]));
      
      // Try to update remote storage
      try {
        await clearCartService(sessionId);
      } catch (err) {
        console.error("Failed to clear cart in Supabase, but cleared locally:", err);
      }
      
      toast.success("Panier vidé");
    } catch (err: any) {
      setError(err.message);
      console.error("Error in clearCart: ", err);
      toast.error("Erreur lors du vidage du panier");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate total price of items in cart
  const total = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Calculate total number of items in cart
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        loadCartItems,
        isLoading,
        error,
        total,
        itemCount,
        sessionId,
        fetchAttempted
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
