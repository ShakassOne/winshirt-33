
import React, { createContext, useContext } from 'react';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/types/supabase.types';

// Interface for the shopping cart context
interface ShoppingCartContextType {
  addItemToCart: (item: CartItem) => Promise<void>;
  removeItemFromCart: (productId: string) => Promise<void>;
  updateCartItemQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartItems: CartItem[];
  isLoading: boolean;
  total: number;
  itemCount: number;
}

// Create the context
const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

// Provider component that wraps app and provides context
export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // We'll use the existing cart context to implement shopping cart functionality
  const { 
    items, 
    addItem, 
    removeItem, 
    updateItemQuantity, 
    clearCart: clearCartFromContext, 
    isLoading, 
    total, 
    itemCount 
  } = useCart();

  // Wrapper functions to match the shopping cart context interface
  const addItemToCart = async (item: CartItem) => {
    await addItem(item);
  };

  const removeItemFromCart = async (productId: string) => {
    await removeItem(productId);
  };

  const updateCartItemQuantity = async (productId: string, quantity: number) => {
    await updateItemQuantity(productId, quantity);
  };

  const clearCart = async () => {
    await clearCartFromContext();
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        addItemToCart,
        removeItemFromCart,
        updateCartItemQuantity,
        clearCart,
        cartItems: items,
        isLoading,
        total,
        itemCount
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

// Hook for using the shopping cart context
export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);
  if (context === undefined) {
    throw new Error('useShoppingCart must be used within a ShoppingCartProvider');
  }
  return context;
};
