import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CartItem as BaseCartItem } from '@/types/supabase.types';
import { CartContextType } from '@/types/cart.types';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<BaseCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartToken, setCartToken] = useState<string | null>(null);
  const { user } = useUser();

  // Load cart data from localStorage on component mount
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        // Check if the user is authenticated
        if (user) {
          // Fetch cart items from the database based on user_id
          const { data: cartData, error: dbError } = await supabase
            .from('carts')
            .select('*')
            .eq('user_id', user.id);

          if (dbError) {
            throw new Error(`Failed to load cart from database: ${dbError.message}`);
          }

          if (cartData && cartData.length > 0) {
            // Assuming each user has only one cart, get the items from the first cart
            const cartItems = cartData[0].items || [];
            setItems(cartItems);
            setCartToken(cartData[0].cart_token || uuidv4());
          } else {
            // If no cart exists for the user, create a new cart in the database
            const newCartToken = uuidv4();
            const { error: createError } = await supabase
              .from('carts')
              .insert([{ user_id: user.id, items: [], cart_token: newCartToken }]);

            if (createError) {
              throw new Error(`Failed to create cart in database: ${createError.message}`);
            }

            setCartToken(newCartToken);
          }
        } else {
          // If the user is not authenticated, load cart items from localStorage
          const storedCart = localStorage.getItem('cart');
          const storedCartToken = localStorage.getItem('cartToken');

          if (storedCart) {
            setItems(JSON.parse(storedCart));
          }

          if (storedCartToken) {
            setCartToken(storedCartToken);
          } else {
            const newCartToken = uuidv4();
            setCartToken(newCartToken);
            localStorage.setItem('cartToken', newCartToken);
          }
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // Save cart data to localStorage whenever items change (if guest)
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, user]);

  // Function to update cart in the database
  const updateCartInDatabase = useCallback(
    async (updatedItems: BaseCartItem[]) => {
      if (user) {
        const { error: updateError } = await supabase
          .from('carts')
          .update({ items: updatedItems })
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Failed to update cart in database:', updateError.message);
          setError(`Failed to update cart: ${updateError.message}`);
        }
      }
    },
    [user]
  );

  // Add item to cart
  const addItem = useCallback(
    (item: BaseCartItem) => {
      const existingItemIndex = items.findIndex(
        (i) => i.productId === item.productId
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...items];
        updatedItems[existingItemIndex].quantity += item.quantity;
        setItems(updatedItems);
        updateCartInDatabase(updatedItems);
      } else {
        const updatedItems = [...items, item];
        setItems(updatedItems);
        updateCartInDatabase(updatedItems);
      }
    },
    [items, updateCartInDatabase]
  );

  // Remove item from cart
  const removeItem = useCallback(
    (productId: string) => {
      const updatedItems = items.filter((item) => item.productId !== productId);
      setItems(updatedItems);
      updateCartInDatabase(updatedItems);
    },
    [items, updateCartInDatabase]
  );

  // Update item quantity in cart
  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const updatedItems = items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      setItems(updatedItems);
      updateCartInDatabase(updatedItems);
    },
    [items, updateCartInDatabase]
  );

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
    updateCartInDatabase([]);
  }, [updateCartInDatabase]);

  // Get cart total
  const getCartTotal = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    updateItemQuantity: updateQuantity, // Add this alias
    clearCart,
    getCartTotal,
    total: getCartTotal(),
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
    isLoading,
    error,
    cartToken,
    currentUser: user
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
