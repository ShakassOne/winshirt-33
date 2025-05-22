import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CartContextType } from '@/types/cart.types';
import { CartItem } from '@/types/supabase.types';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  addToCart, 
  getCartItems, 
  removeFromCart, 
  updateCartItemQuantity, 
  clearCart,
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
      console.log("Created new cart token:", newCartToken);
    } else {
      setCartToken(storedCartToken);
      console.log("Using existing cart token:", storedCartToken);
    }
  }, []);
  
  // Check for auth state changes
  useEffect(() => {
    // Get current auth status
    const checkCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userFromSession = session?.user || null;
      setCurrentUser(userFromSession);
      console.log("Current user:", userFromSession ? userFromSession.id : "not logged in");
    };
    
    checkCurrentUser();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null;
      console.log("Auth state changed in cart context:", event, user ? user.id : "no user");
      setCurrentUser(user);
      
      // Handle sign in - migrate cart if user just signed in
      if (event === 'SIGNED_IN' && user && cartToken) {
        console.log("User signed in, migrating cart");
        await handleCartMigration(user.id, cartToken);
      }
      
      // Handle sign out - reload cart with anonymous data
      if (event === 'SIGNED_OUT' && cartToken) {
        console.log("User signed out, reloading anonymous cart");
        await loadCartItems();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [cartToken]);
  
  // Load cart items when cartToken is available or user changes
  useEffect(() => {
    if (cartToken) {
      console.log("Loading cart items for token:", cartToken);
      loadCartItems();
    }
  }, [cartToken, currentUser]);
  
  const handleCartMigration = async (userId: string, token: string) => {
    setIsLoading(true);
    try {
      console.log("Starting cart migration for user:", userId);
      await migrateCartToUser(userId, token);
      toast({
        title: "Panier transféré",
        description: "Votre panier a été associé à votre compte",
      });
      await loadCartItems(); // Reload cart after migration
      console.log("Cart migration completed");
    } catch (err: any) {
      console.error("Error migrating cart:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadCartItems = async () => {
    if (!cartToken) return;
    
    console.log("Loading cart items for token:", cartToken);
    setIsLoading(true);
    try {
      const cartItems = await getCartItems(cartToken, currentUser?.id);
      console.log("Loaded cart items:", cartItems);
      setItems(cartItems);
    } catch (err: any) {
      setError(err.message);
      console.error("Error loading cart items:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const addItem = async (item: CartItem) => {
    console.log("Starting addItem function with item:", JSON.stringify(item, null, 2));
    
    if (!cartToken) {
      console.error("Cannot add item to cart - no cart token available");
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter au panier - problème d'identification",
        variant: "destructive",
      });
      return;
    }
    
    // Basic validation to ensure we have at least a productId
    if (!item.productId) {
      console.error("Cannot add item - missing productId");
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter un produit sans identifiant",
        variant: "destructive",
      });
      return;
    }

    // Check if size is required based on available_sizes
    if (item.available_sizes && item.available_sizes.length > 0 && !item.size) {
      console.error("Cannot add item - size required but not selected");
      toast({
        title: "Taille requise",
        description: "Veuillez sélectionner une taille pour ce produit",
        variant: "destructive",
      });
      return;
    }

    // Check if color is required based on available_colors
    if (item.available_colors && item.available_colors.length > 0 && !item.color) {
      console.error("Cannot add item - color required but not selected");
      toast({
        title: "Couleur requise",
        description: "Veuillez sélectionner une couleur pour ce produit",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("About to call addToCart with:", { 
        cartToken, 
        item, 
        currentUser: currentUser ? `User ID: ${currentUser.id}` : 'No user'
      });
      
      await addToCart(cartToken, item, currentUser?.id);
      
      // Explicitly refresh cart items to ensure the UI is updated
      await loadCartItems();
      
      toast({
        title: "Produit ajouté au panier",
        description: `${item.name} a été ajouté à votre panier`,
      });
      
      console.log("Item added successfully, cart now has", items.length + 1, "items");
    } catch (err: any) {
      setError(err.message);
      console.error("Error adding to cart:", err);
      toast({
        title: "Erreur",
        description: `Erreur lors de l'ajout au panier: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeItem = async (productId: string) => {
    if (!cartToken) return;
    
    console.log("Removing item from cart:", productId);
    setIsLoading(true);
    try {
      await removeFromCart(cartToken, productId, currentUser?.id);
      toast({
        title: "Produit retiré du panier",
        description: "Le produit a été retiré de votre panier",
      });
      // Reload cart items after removal
      await loadCartItems();
      console.log("Item removed successfully");
    } catch (err: any) {
      setError(err.message);
      console.error("Error removing from cart:", err);
      toast({
        title: "Erreur",
        description: "Erreur lors du retrait du produit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateItemQuantity = async (productId: string, quantity: number) => {
    if (!cartToken || quantity < 1) return;
    
    console.log("Updating item quantity:", productId, quantity);
    setIsLoading(true);
    try {
      await updateCartItemQuantity(cartToken, productId, quantity, currentUser?.id);
      // Reload cart items after update
      await loadCartItems();
      console.log("Item quantity updated successfully");
    } catch (err: any) {
      setError(err.message);
      console.error("Error updating quantity:", err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de la quantité",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearCartItems = async () => {
    if (!cartToken) return;
    
    console.log("Clearing cart");
    setIsLoading(true);
    try {
      await clearCart(cartToken, currentUser?.id);
      toast({
        title: "Panier vidé",
        description: "Votre panier a été vidé",
      });
      // Reload cart items after clearing
      await loadCartItems();
      console.log("Cart cleared successfully");
    } catch (err: any) {
      setError(err.message);
      console.error("Error clearing cart:", err);
      toast({
        title: "Erreur",
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
        clearCart: clearCartItems,
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
