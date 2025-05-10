
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Minus, Plus } from 'lucide-react';

interface ProductOrderSectionProps {
  quantity: number;
  handleQuantityChange: (type: 'increase' | 'decrease') => void;
  handleAddToCart: () => void;
}

const ProductOrderSection = ({ quantity, handleQuantityChange, handleAddToCart }: ProductOrderSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded">
          <button
            className="px-3 py-2 border-r"
            onClick={() => handleQuantityChange('decrease')}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-2">{quantity}</span>
          <button
            className="px-3 py-2 border-l"
            onClick={() => handleQuantityChange('increase')}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className="flex-1"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
};

export default ProductOrderSection;
