
import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/types/cart.types';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartItem = ({ item, onRemove, onUpdateQuantity }: CartItemProps) => {
  const handleIncreaseQuantity = () => {
    onUpdateQuantity(item.cartItemId || item.productId, item.quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.cartItemId || item.productId, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    onRemove(item.cartItemId || item.productId);
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  return (
    <div className="p-4 flex gap-4">
      <div className="w-24 h-24 relative">
        <AspectRatio ratio={1/1} className="overflow-hidden rounded-md">
          <img
            src={item.image_url || '/placeholder.svg'}
            alt={item.name}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
      </div>
      
      <div className="flex flex-col justify-between flex-grow">
        <div>
          <h3 className="font-medium text-lg">{item.name}</h3>
          <div className="flex flex-wrap gap-2 text-sm text-gray-400 mt-1">
            {item.size && <span>Taille: {item.size}</span>}
            {item.color && <span>Couleur: {item.color}</span>}
          </div>
          {item.customization && Object.keys(item.customization).length > 0 && (
            <div className="text-sm text-gray-400 mt-1">
              Personnalisé
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-gray-100/10 rounded">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-none",
                item.quantity <= 1 && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleDecreaseQuantity}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <span className="w-8 text-center">{item.quantity}</span>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={handleIncreaseQuantity}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <span className="font-medium">{formatPrice(item.price * item.quantity)} €</span>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-400 hover:text-red-500 self-start"
        onClick={handleRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItem;
