
import React, { memo } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

const CartIcon = memo(() => {
  const { itemCount } = useCart();

  return (
    <Button variant="ghost" size="icon" className="text-white/80 hover:text-white relative" asChild>
      <Link to="/cart">
        <ShoppingCart className="h-5 w-5" aria-hidden="true" />
        {itemCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-winshirt-purple text-[10px]">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </Link>
    </Button>
  );
});

CartIcon.displayName = 'CartIcon';

export default CartIcon;
