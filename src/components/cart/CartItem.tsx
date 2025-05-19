
import React from 'react';
import { X } from 'lucide-react';
import { CartItemProps } from './CartItemProps';
import { formatCurrency } from '@/lib/utils';

export const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQuantity }) => {
  const handleRemove = () => {
    onRemove(item.productId);
  };

  const handleQuantityChange = (newQuantity: number) => {
    onUpdateQuantity(item.productId, newQuantity);
  };

  return (
    <li className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={item.image_url || '/placeholder-image.png'}
          alt={item.name}
          className="h-full w-full object-cover object-center"
        />
      </div>
      
      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-white">
            <h3>{item.name}</h3>
            <p className="ml-4">{formatCurrency(item.price * item.quantity)}</p>
          </div>
          {item.color && <p className="mt-1 text-sm text-gray-300">Couleur: {item.color}</p>}
          {item.size && <p className="mt-1 text-sm text-gray-300">Taille: {item.size}</p>}
          {item.customization && (
            <div className="mt-1 text-sm text-gray-300">
              {item.customization.designName && <p>Design: {item.customization.designName}</p>}
              {item.customization.customText && <p>Texte: {item.customization.customText}</p>}
            </div>
          )}
        </div>
        
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center">
            <p className="text-white mr-2">Quantité:</p>
            <select 
              value={item.quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="font-medium text-red-400 hover:text-red-300 flex items-center"
            onClick={handleRemove}
          >
            <X className="h-4 w-4 mr-1" />
            Supprimer
          </button>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
