
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { CartItem } from '@/types/supabase.types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage when component mounts
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const findItemIndex = (productId: string, color?: string, size?: string) => {
    return cartItems.findIndex(item => 
      item.productId === productId && 
      item.color === color && 
      item.size === size
    );
  };

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      const existingItemIndex = findItemIndex(item.productId, item.color, item.size);
      
      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        toast.success('Quantité mise à jour dans le panier');
        return updatedItems;
      } else {
        // Add new item
        toast.success('Produit ajouté au panier');
        return [...prevItems, item];
      }
    });
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => 
        !(item.productId === productId && item.color === color && item.size === size)
      );
      
      if (newItems.length < prevItems.length) {
        toast.info('Produit retiré du panier');
      }
      
      return newItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }

    setCartItems(prevItems => {
      const existingItemIndex = findItemIndex(productId, color, size);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity = quantity;
        return updatedItems;
      }
      
      return prevItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
