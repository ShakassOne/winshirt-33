
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CartContextType } from '@/types/cart.types';
import { CartItem } from '@/types/supabase.types';
import { toast } from 'sonner';
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
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Generate a cart token if not exists
  useEffect(() => {
    const storedCartToken = localStorage.getItem('cart_token');
    if (!storedCartToken) {
      const newCartToken = uuidv4();
      localStorage.setItem('cart_token', newCartToken);
      setCartToken(newCartToken);
      console.log("Created new cart token:", newCartToken);
    } else {
      setCartToken(storedCartToken);
      console.log("Using existing cart token:", storedCartToken);
    }
  }, []);
  
  // Check for auth state changes
  useEffect(() => {
    let mounted = true;
    
    // Get current auth status
    const checkCurrentUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userFromSession = session?.user || null;
        if (mounted) {
          setCurrentUser(userFromSession);
          setIsInitialized(true);
          console.log("Current user:", userFromSession ? userFromSession.id : "not logged in");
        }
      } catch (error) {
        console.error("Error checking current user:", error);
        if (mounted) {
          setIsInitialized(true);
        }
      }
    };
    
    checkCurrentUser();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      const user = session?.user || null;
      console.log("Auth state changed in cart context:", event, user ? user.id : "no user");
      setCurrentUser(user);
      
      // Handle sign in - migrate cart if user just signed in
      if (event === 'SIGNED_IN' && user && cartToken) {
        console.log("User signed in, migrating cart");
        try {
          await migrateCartToUser(user.id, cartToken);
          toast.success("Panier transféré à votre compte");
        } catch (err: any) {
          console.error("Error migrating cart:", err);
        }
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [cartToken]);
  
  // Load cart items when cartToken is available and initialized
  const loadCartItems = useCallback(async () => {
    if (!cartToken || !isInitialized) return;
    
    console.log("Loading cart items for token:", cartToken);
    setIsLoading(true);
    try {
      const cartItems = await getCartItems(cartToken, currentUser?.id);
      console.log("Loaded cart items:", cartItems);
      setItems(cartItems);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Error loading cart items:", err);
    } finally {
      setIsLoading(false);
    }
  }, [cartToken, currentUser?.id, isInitialized]);

  useEffect(() => {
    loadCartItems();
  }, [loadCartItems]);
  
  const addItem = useCallback(async (item: CartItem) => {
    console.log("Starting addItem function with item:", JSON.stringify(item, null, 2));
    
    if (!cartToken) {
      console.error("Cannot add item to cart - no cart token available");
      toast.error("Impossible d'ajouter au panier - problème d'identification");
      return false;
    }
    
    // Basic validation
    if (!item.productId) {
      console.error("Cannot add item - missing productId");
      toast.error("Impossible d'ajouter un produit sans identifiant");
      return false;
    }

    // Check if size is required
    if (item.available_sizes && item.available_sizes.length > 0 && !item.size) {
      console.error("Cannot add item - size required but not selected");
      toast.error("Veuillez sélectionner une taille pour ce produit");
      return false;
    }

    // Check if color is required
    if (item.available_colors && item.available_colors.length > 0 && !item.color) {
      console.error("Cannot add item - color required but not selected");
      toast.error("Veuillez sélectionner une couleur pour ce produit");
      return false;
    }
    
    setIsLoading(true);
    try {
      console.log("About to call addToCart with:", { 
        cartToken, 
        item, 
        currentUser: currentUser ? `User ID: ${currentUser.id}` : 'No user'
      });
      
      await addToCart(cartToken, item, currentUser?.id);
      await loadCartItems();
      
      console.log("Item added successfully");
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error("Error adding to cart:", err);
      toast.error(`Erreur lors de l'ajout au panier: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [cartToken, currentUser?.id, loadCartItems]);
  
  const removeItem = useCallback(async (productId: string) => {
    if (!cartToken) return;
    
    console.log("Removing item from cart:", productId);
    setIsLoading(true);
    try {
      await removeFromCart(cartToken, productId, currentUser?.id);
      toast.success("Produit retiré du panier");
      await loadCartItems();
      console.log("Item removed successfully");
    } catch (err: any) {
      setError(err.message);
      console.error("Error removing from cart:", err);
      toast.error("Erreur lors du retrait du produit");
    } finally {
      setIsLoading(false);
    }
  }, [cartToken, currentUser?.id, loadCartItems]);
  
  const updateItemQuantity = useCallback(async (productId: string, quantity: number) => {
    if (!cartToken || quantity < 1) return;
    
    console.log("Updating item quantity:", productId, quantity);
    setIsLoading(true);
    try {
      await updateCartItemQuantity(cartToken, productId, quantity, currentUser?.id);
      await loadCartItems();
      console.log("Item quantity updated successfully");
    } catch (err: any) {
      setError(err.message);
      console.error("Error updating quantity:", err);
      toast.error("Erreur lors de la mise à jour de la quantité");
    } finally {
      setIsLoading(false);
    }
  }, [cartToken, currentUser?.id, loadCartItems]);
  
  const clearCart = useCallback(async () => {
    if (!cartToken) return;
    
    console.log("Clearing cart");
    setIsLoading(true);
    try {
      await clearCartService(cartToken, currentUser?.id);
      toast.success("Panier vidé");
      await loadCartItems();
      console.log("Cart cleared successfully");
    } catch (err: any) {
      setError(err.message);
      console.error("Error clearing cart:", err);
      toast.error("Erreur lors du vidage du panier");
    } finally {
      setIsLoading(false);
    }
  }, [cartToken, currentUser?.id, loadCartItems]);
  
  // Memoize calculated values
  const total = useMemo(() => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [items]);
  
  const itemCount = useMemo(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);
  
  const contextValue = useMemo(() => ({
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
  }), [
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
  ]);
  
  return (
    <CartContext.Provider value={contextValue}>
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
