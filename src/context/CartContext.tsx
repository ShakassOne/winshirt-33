import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CartContextType } from '@/types/cart.types';
import { CartItem } from '@/types/supabase.types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  addToCart, 
  getCartItems, 
  removeFromCart, 
  updateCartItemQuantity, 
  clearCart as clearCartService,
  migrateCartToUser
} from '@/services/cart.service';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartToken, setCartToken] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  
  // Generate a cart token if not exists
  useEffect(() => {
    const storedCartToken = localStorage.getItem('cart_token');
    if (!storedCartToken) {
      const newCartToken = uuidv4();
      localStorage.setItem('cart_token', newCartToken);
      setCartToken(newCartToken);
    } else {
      setCartToken(storedCartToken);
    }
  }, []);
  
  // Check for auth state changes
  useEffect(() => {
    // Get current auth status
    const checkCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);
    };
    
    checkCurrentUser();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null;
      setCurrentUser(user);
      
      // Handle sign in - migrate cart if user just signed in
      if (event === 'SIGNED_IN' && user && cartToken) {
        await handleCartMigration(user.id, cartToken);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [cartToken]);
  
  // Load cart items when cartToken is available or user changes
  useEffect(() => {
    if (cartToken) {
      loadCartItems();
    }
  }, [cartToken, currentUser]);
  
  const handleCartMigration = async (userId: string, token: string) => {
    setIsLoading(true);
    try {
      await migrateCartToUser(userId, token);
      toast("Panier transféré", {
        description: "Votre panier a été associé à votre compte"
      });
      await loadCartItems(); // Reload cart after migration
    } catch (err: any) {
      console.error("Error migrating cart:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadCartItems = async () => {
    if (!cartToken) return;
    
    setIsLoading(true);
    try {
      const cartItems = await getCartItems(cartToken, currentUser?.id);
      setItems(cartItems);
    } catch (err: any) {
      setError(err.message);
      console.error("Error loading cart items:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const addItem = async (item: CartItem) => {
    if (!cartToken) return;
    
    setIsLoading(true);
    try {
      await addToCart(cartToken, item, currentUser?.id);
      toast("Produit ajouté au panier", {
        description: `${item.name} a été ajouté à votre panier`
      });
      // Reload cart items after adding
      await loadCartItems();
    } catch (err: any) {
      setError(err.message);
      console.error("Error adding to cart:", err);
      toast("Erreur", {
        description: "Erreur lors de l'ajout au panier"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeItem = async (productId: string) => {
    if (!cartToken) return;
    
    setIsLoading(true);
    try {
      await removeFromCart(cartToken, productId, currentUser?.id);
      toast("Produit retiré du panier", {
        description: "Le produit a été retiré de votre panier"
      });
      // Reload cart items after removal
      await loadCartItems();
    } catch (err: any) {
      setError(err.message);
      console.error("Error removing from cart:", err);
      toast("Erreur", {
        description: "Erreur lors du retrait du produit"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateItemQuantity = async (productId: string, quantity: number) => {
    if (!cartToken || quantity < 1) return;
    
    setIsLoading(true);
    try {
      await updateCartItemQuantity(cartToken, productId, quantity, currentUser?.id);
      // Reload cart items after update
      await loadCartItems();
    } catch (err: any) {
      setError(err.message);
      console.error("Error updating quantity:", err);
      toast("Erreur", {
        description: "Erreur lors de la mise à jour de la quantité",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearCart = async () => {
    if (!cartToken) return;
    
    setIsLoading(true);
    try {
      await clearCartService(cartToken, currentUser?.id);
      toast("Panier vidé", {
        description: "Votre panier a été vidé",
      });
      // Reload cart items after clearing
      await loadCartItems();
    } catch (err: any) {
      setError(err.message);
      console.error("Error clearing cart:", err);
      toast("Erreur", {
        description: "Erreur lors du vidage du panier",
        variant: "destructive",
      });
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
        cartToken,
        currentUser
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
