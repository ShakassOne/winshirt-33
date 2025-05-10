
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color?: string | null;
  size?: string | null;
  image_url?: string;
  lotteries?: string[];
  customization?: any;
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger les articles du panier depuis localStorage lors de l'initialisation
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        // Réinitialiser le panier en cas d'erreur
        localStorage.setItem('cart', JSON.stringify([]));
      }
    }
    setIsInitialized(true);
  }, []);

  // Sauvegarder les articles du panier dans localStorage quand ils changent
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      // Vérifier si l'article existe déjà avec les mêmes options
      const existingItemIndex = prevItems.findIndex(
        i => i.productId === item.productId && 
             i.color === item.color && 
             i.size === item.size &&
             JSON.stringify(i.customization || {}) === JSON.stringify(item.customization || {}) &&
             JSON.stringify(i.lotteries || []) === JSON.stringify(item.lotteries || [])
      );

      if (existingItemIndex !== -1) {
        // Mettre à jour la quantité de l'article existant
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return updatedItems;
      } else {
        // Ajouter comme nouvel article
        return [...prevItems, item];
      }
    });

    toast.success('Produit ajouté au panier!');
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index].quantity = quantity;
      return updatedItems;
    });
  };

  const removeItem = (index: number) => {
    setItems(prevItems => prevItems.filter((_, i) => i !== index));
    toast.info('Produit retiré du panier');
  };

  const clearCart = () => {
    setItems([]);
    toast.info('Panier vidé');
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return {
    items,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };
};
