
import React, { memo, useCallback } from 'react';
import { TrashIcon, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/types/supabase.types';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = memo(({ item, onRemove, onUpdateQuantity }) => {
  const handleQuantityChange = useCallback((change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity >= 1) {
      onUpdateQuantity(item.productId, newQuantity);
    }
  }, [item.quantity, item.productId, onUpdateQuantity]);

  const handleRemove = useCallback(() => {
    onRemove(item.productId);
  }, [item.productId, onRemove]);

  const handleIncrement = useCallback(() => {
    handleQuantityChange(1);
  }, [handleQuantityChange]);

  const handleDecrement = useCallback(() => {
    handleQuantityChange(-1);
  }, [handleQuantityChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border-b border-gray-100/10">
      <div className="flex-shrink-0 w-full sm:w-24 h-24 rounded-md overflow-hidden">
        <img 
          src={item.image_url} 
          alt={item.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between">
          <Link to={`/products/${item.productId}`} className="text-lg font-medium hover:text-winshirt-blue transition-colors">
            {item.name}
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-500 hover:text-red-500"
            onClick={handleRemove}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-1 space-y-1">
          {item.color && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Couleur:</span>
              <span 
                className="h-4 w-4 rounded-full border border-white/30" 
                style={{ backgroundColor: item.color }}
              />
            </div>
          )}
          
          {item.size && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Taille:</span>
              <span className="text-sm">{item.size}</span>
            </div>
          )}
          
          {item.customization && (
            <div className="mt-2">
              <Badge variant="outline" className="mb-1">Personnalisé</Badge>
              {item.customization.designId && (
                <div className="text-xs text-gray-400">Design appliqué</div>
              )}
              {item.customization.customText && (
                <div className="text-xs text-gray-400">Texte personnalisé</div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center border border-gray-200/20 rounded-md">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-r-none"
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-10 text-center">{item.quantity}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-l-none"
              onClick={handleIncrement}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="font-semibold">{(item.price * item.quantity).toFixed(2)} €</div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function pour éviter les re-renders inutiles
  return (
    prevProps.item.productId === nextProps.item.productId &&
    prevProps.item.quantity === nextProps.item.quantity &&
    prevProps.item.price === nextProps.item.price &&
    prevProps.onRemove === nextProps.onRemove &&
    prevProps.onUpdateQuantity === nextProps.onUpdateQuantity
  );
});

CartItem.displayName = 'CartItem';

export default CartItem;
