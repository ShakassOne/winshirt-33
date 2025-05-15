
import React, { useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

const CartIcon = () => {
  const { itemCount, loadCartItems, fetchAttempted } = useCart();
  
  // Only attempt to load cart items when component mounts and a load hasn't been attempted yet
  useEffect(() => {
    console.log("CartIcon mounted, loading cart items");
    if(typeof loadCartItems === 'function' && !fetchAttempted) {
      loadCartItems().then(() => {
        console.log("Cart items loaded successfully");
      }).catch(error => {
        console.error("Error loading cart items:", error);
        // Error is already handled in CartContext
      });
    }
  }, [loadCartItems, fetchAttempted]);

  return (
    <Button variant="ghost" size="icon" className="text-white/80 hover:text-white relative" asChild>
      <Link to="/cart">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-winshirt-purple text-[10px]">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </Link>
    </Button>
  );
};

export default CartIcon;
