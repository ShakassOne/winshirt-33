
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CartContextType } from '@/types/cart.types';
import { CartItem } from '@/types/supabase.types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { addToCart, getCartItems, removeFromCart, updateCartItemQuantity, clearCart as clearCartService } from '@/services/cart.service';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  
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
    try {
      const cartItems = await getCartItems(sessionId);
      setItems(cartItems);
    } catch (err: any) {
      setError(err.message);
      toast.error("Erreur lors du chargement du panier");
    } finally {
      setIsLoading(false);
    }
  };
  
  const linkCartToUser = async (userId: string) => {
    try {
      // Logic to update cart_sessions with user_id
      const { data, error } = await supabase
        .from('cart_sessions')
        .update({ user_id: userId })
        .eq('session_id', sessionId);
        
      if (error) throw error;
    } catch (err: any) {
      console.error("Erreur lors de la liaison du panier à l'utilisateur:", err);
    }
  };
  
  const addItem = async (item: CartItem) => {
    if (!sessionId) return;
    
    setIsLoading(true);
    try {
      await addToCart(sessionId, item);
      await loadCartItems(); // Reload items
      toast.success("Produit ajouté au panier");
    } catch (err: any) {
      setError(err.message);
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeItem = async (productId: string) => {
    if (!sessionId) return;
    
    setIsLoading(true);
    try {
      await removeFromCart(sessionId, productId);
      await loadCartItems(); // Reload items
      toast.success("Produit retiré du panier");
    } catch (err: any) {
      setError(err.message);
      toast.error("Erreur lors du retrait du produit");
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateItemQuantity = async (productId: string, quantity: number) => {
    if (!sessionId || quantity < 1) return;
    
    setIsLoading(true);
    try {
      await updateCartItemQuantity(sessionId, productId, quantity);
      await loadCartItems(); // Reload items
    } catch (err: any) {
      setError(err.message);
      toast.error("Erreur lors de la mise à jour de la quantité");
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearCart = async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
    try {
      await clearCartService(sessionId);
      await loadCartItems(); // Reload items
      toast.success("Panier vidé");
    } catch (err: any) {
      setError(err.message);
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
        isLoading,
        error,
        total,
        itemCount,
        sessionId
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
