
import React, { createContext, useState, useEffect, useContext } from "react";
import { CartContextType, CartItem } from "@/types/cart.types";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

// Default values for the context
const defaultContext: CartContextType = {
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateItemQuantity: () => {},
  clearCart: () => {},
  loadCartItems: async () => {},
  isLoading: false,
  error: null,
  total: 0,
  itemCount: 0,
  sessionId: "",
};

export const CartContext = createContext<CartContextType>(defaultContext);

const CART_STORAGE_KEY = "winshirt_cart";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState(() => {
    const storedSessionId = localStorage.getItem("cart_session_id");
    return storedSessionId || uuidv4();
  });
  const { toast } = useToast();
  const { user } = useAuth();

  // Calculate total and item count
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  // Load cart items from localStorage
  const loadCartItems = async () => {
    console.log("Loading cart items...");
    setIsLoading(true);
    setError(null);

    try {
      const storedCart = localStorage.getItem(
        `${CART_STORAGE_KEY}_${user?.id || sessionId}`
      );
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        console.log("Loaded cart items:", parsedCart);
        setItems(parsedCart);
      } else {
        console.log("No stored cart found");
        setItems([]);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setError("Failed to load cart items");
    } finally {
      setIsLoading(false);
    }
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (items.length > 0 || sessionId) {
      localStorage.setItem("cart_session_id", sessionId);
      localStorage.setItem(
        `${CART_STORAGE_KEY}_${user?.id || sessionId}`,
        JSON.stringify(items)
      );
      console.log("Cart saved:", items);
    }
  }, [items, sessionId, user?.id]);

  // Load cart when user changes or component mounts
  useEffect(() => {
    loadCartItems();
  }, [user?.id]);

  // Add item to cart
  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      // Ensure the item has a cartItemId
      const newItem = {
        ...item,
        cartItemId: item.cartItemId || uuidv4()
      };

      // Check if the item already exists with the same customization options
      const existingItemIndex = prevItems.findIndex(
        (i) =>
          i.productId === newItem.productId &&
          JSON.stringify(i.customization) === JSON.stringify(newItem.customization)
      );

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, newItem];
      }
    });

    toast({
      title: "Produit ajouté",
      description: "Le produit a été ajouté à votre panier",
    });
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.cartItemId !== id));
  };

  // Update item quantity
  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === id ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  const contextValue: CartContextType = {
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
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
