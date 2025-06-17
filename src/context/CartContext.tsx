import logger from '@/utils/logger';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, memo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CartContextType } from '@/types/cart.types';
import { CartItem } from '@/types/supabase.types';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProductionGeneration } from '@/hooks/useProductionGeneration';
import { enrichCustomizationWithProductionFiles } from '@/services/unifiedCapture.service';
import {
  addToCart,
  getCartItems,
  removeFromCart,
  updateCartItemQuantity,
  clearCart as clearCartService,
  migrateCartToUser,
  getOrCreateCartToken
} from '@/services/cart.service';

const CartContext = createContext<CartContextType | undefined>(undefined);

const MemoizedCartProvider = memo(({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartToken, setCartToken] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { generateProductionFiles, isGenerating } = useProductionGeneration();
  
  // Generate a cart token if not exists
  useEffect(() => {
    const initToken = async () => {
      if (!cartToken) {
        const newCartToken = uuidv4();
        try {
          await getOrCreateCartToken(newCartToken);
        } catch (err) {
          console.error('Error creating cart token:', err);
        }
        setCartToken(newCartToken);
        logger.log('Created new cart token:', newCartToken);
      }
    };
    initToken();
  }, [cartToken]);
  
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
          logger.log("Current user:", userFromSession ? userFromSession.id : "not logged in");
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
      logger.log("Auth state changed in cart context:", event, user ? user.id : "no user");
      setCurrentUser(user);
      
      // Handle sign in - migrate cart if user just signed in
      if (event === 'SIGNED_IN' && user && cartToken) {
        logger.log("User signed in, migrating cart");
        try {
          await migrateCartToUser(user.id, cartToken);
          toast({
            title: "Panier transféré",
            description: "Votre panier a été associé à votre compte",
          });
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
    
    logger.log("Loading cart items for token:", cartToken);
    setIsLoading(true);
    try {
      const cartItems = await getCartItems(cartToken, currentUser?.id);
      logger.log("Loaded cart items:", cartItems);
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
  
  // Memoized handlers to prevent unnecessary re-renders
  const addItem = useCallback(async (item: CartItem) => {
    logger.log("Starting addItem function with item:", JSON.stringify(item, null, 2));
    
    if (!cartToken) {
      console.error("Cannot add item to cart - no cart token available");
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter au panier - problème d'identification",
        variant: "destructive",
      });
      return;
    }
    
    // Basic validation
    if (!item.productId) {
      console.error("Cannot add item - missing productId");
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter un produit sans identifiant",
        variant: "destructive",
      });
      return;
    }

    // Check if size is required
    if (item.available_sizes && item.available_sizes.length > 0 && !item.size) {
      console.error("Cannot add item - size required but not selected");
      toast({
        title: "Taille requise",
        description: "Veuillez sélectionner une taille pour ce produit",
        variant: "destructive",
      });
      return;
    }

    // Check if color is required
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
      logger.log("About to call addToCart with:", { 
        cartToken, 
        item, 
        currentUser: currentUser ? `User ID: ${currentUser.id}` : 'No user'
      });
      
      // Si l'item a une customization, générer les fichiers de production
      let enrichedCustomization = item.customization;
      
      if (item.customization && (item.customization.frontDesign || item.customization.backDesign || 
                                item.customization.frontText || item.customization.backText)) {
        
        logger.log("🎨 [Cart Context] Génération des fichiers de production pour customization");
        
        try {
          // Préparer les URLs de mockup
          const mockupUrls = {
            front: item.image_url, // URL du produit comme base
            back: item.image_url   // Même URL pour les deux côtés par défaut
          };
          
          const productionFiles = await generateProductionFiles(
            item.customization,
            mockupUrls,
            { name: item.name, id: item.productId }
          );
          
          // Enrichir la customization avec les URLs générées
          enrichedCustomization = enrichCustomizationWithProductionFiles(
            item.customization,
            productionFiles
          );
          
          logger.log("✅ [Cart Context] Fichiers de production générés et customization enrichie");
        } catch (productionError) {
          console.error("❌ [Cart Context] Erreur génération fichiers production:", productionError);
          // Continuer sans les fichiers de production mais afficher un warning
          toast({
            title: "Avertissement",
            description: "Les fichiers de production seront générés plus tard",
            variant: "default",
          });
        }
      }
      
      // Créer l'item avec la customization enrichie
      const itemWithProductionFiles = {
        ...item,
        customization: enrichedCustomization
      };
      
      await addToCart(cartToken, itemWithProductionFiles, currentUser?.id);
      await loadCartItems();
      
      toast({
        title: "Produit ajouté au panier",
        description: `${item.name} a été ajouté à votre panier`,
      });
      
      logger.log("Item added successfully with production files");
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
  }, [cartToken, currentUser?.id, loadCartItems, generateProductionFiles]);
  
  const removeItem = useCallback(async (productId: string) => {
    if (!cartToken) return;
    
    logger.log("Removing item from cart:", productId);
    setIsLoading(true);
    try {
      await removeFromCart(cartToken, productId, currentUser?.id);
      toast({
        title: "Produit retiré du panier",
        description: "Le produit a été retiré de votre panier",
      });
      await loadCartItems();
      logger.log("Item removed successfully");
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
  }, [cartToken, currentUser?.id, loadCartItems]);
  
  const updateItemQuantity = useCallback(async (productId: string, quantity: number) => {
    if (!cartToken || quantity < 1) return;
    
    logger.log("Updating item quantity:", productId, quantity);
    setIsLoading(true);
    try {
      await updateCartItemQuantity(cartToken, productId, quantity, currentUser?.id);
      await loadCartItems();
      logger.log("Item quantity updated successfully");
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
  }, [cartToken, currentUser?.id, loadCartItems]);
  
  const clearCart = useCallback(async () => {
    if (!cartToken) return;
    
    logger.log("Clearing cart");
    setIsLoading(true);
    try {
      await clearCartService(cartToken, currentUser?.id);
      toast({
        title: "Panier vidé",
        description: "Votre panier a été vidé",
      });
      await loadCartItems();
      logger.log("Cart cleared successfully");
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
  }, [cartToken, currentUser?.id, loadCartItems]);
  
  // Memoize calculated values with deep comparison
  const total = useMemo(() => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [items]);
  
  const itemCount = useMemo(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);
  
  // Stable context value to prevent unnecessary provider re-renders
  const contextValue = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    isLoading: isLoading || isGenerating, // Include generation loading state
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
    isGenerating,
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
});

MemoizedCartProvider.displayName = 'MemoizedCartProvider';

export const CartProvider = MemoizedCartProvider;

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
