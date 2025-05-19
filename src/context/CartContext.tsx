
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<BaseCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartToken, setCartToken] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Load cart data from localStorage on component mount
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        // Check if the user is authenticated
        if (currentUser) {
          // Fetch cart items from the database based on user_id
          const { data: cartData, error: dbError } = await supabase
            .from('cart_tokens')
            .select('*')
            .eq('user_id', currentUser.id);

          if (dbError) {
            throw new Error(`Failed to load cart from database: ${dbError.message}`);
          }

          if (cartData && cartData.length > 0) {
            // Get the cart token
            const token = cartData[0].token;
            setCartToken(token);
            
            // Get cart items for this token
            const { data: cartItems, error: itemsError } = await supabase
              .from('cart_items')
              .select('*, products(*)')
              .eq('cart_token_id', cartData[0].id);
            
            if (itemsError) {
              throw new Error(`Failed to load cart items: ${itemsError.message}`);
            }
            
            // Transform cart items to match the expected format
            if (cartItems) {
              const transformedItems: BaseCartItem[] = cartItems.map(item => ({
                productId: item.product_id,
                name: item.products?.name || '',
                price: parseFloat(item.price as unknown as string),
                quantity: item.quantity,
                image_url: item.products?.image_url,
                color: item.color || null,
                size: item.size || null,
                customization: item.customization as unknown as BaseCartItem['customization']
              }));
              
              setItems(transformedItems);
            }
          } else {
            // If no cart exists for the user, create a new cart token in the database
            const newCartToken = uuidv4();
            const { error: createError } = await supabase
              .from('cart_tokens')
              .insert([{ user_id: currentUser.id, token: newCartToken }]);

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
  }, [currentUser]);

  // Save cart data to localStorage whenever items change (if guest)
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, currentUser]);

  // Function to update cart in the database
  const updateCartInDatabase = useCallback(
    async (updatedItems: BaseCartItem[]) => {
      if (currentUser && cartToken) {
        try {
          // First, get the cart token ID
          const { data: tokenData, error: tokenError } = await supabase
            .from('cart_tokens')
            .select('id')
            .eq('token', cartToken)
            .single();
            
          if (tokenError) {
            console.error('Failed to get cart token:', tokenError.message);
            setError(`Failed to update cart: ${tokenError.message}`);
            return;
          }
          
          // Remove existing cart items
          const { error: deleteError } = await supabase
            .from('cart_items')
            .delete()
            .eq('cart_token_id', tokenData.id);
            
          if (deleteError) {
            console.error('Failed to clear cart items:', deleteError.message);
            setError(`Failed to update cart: ${deleteError.message}`);
            return;
          }
          
          // Add new cart items if there are any
          if (updatedItems.length > 0) {
            const cartItems = updatedItems.map(item => ({
              cart_token_id: tokenData.id,
              product_id: item.productId,
              quantity: item.quantity,
              price: item.price,
              color: item.color || null,
              size: item.size || null,
              customization: item.customization || null
            }));
            
            const { error: insertError } = await supabase
              .from('cart_items')
              .insert(cartItems);
              
            if (insertError) {
              console.error('Failed to add cart items:', insertError.message);
              setError(`Failed to update cart: ${insertError.message}`);
              return;
            }
          }
        } catch (error: any) {
          console.error('Error updating cart in database:', error);
          setError(`Failed to update cart: ${error.message}`);
        }
      }
    },
    [currentUser, cartToken]
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

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const total = getCartTotal();

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotal,
    total,
    itemCount,
    isLoading,
    error,
    cartToken,
    currentUser: currentUser ? { id: currentUser.id } : null
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
