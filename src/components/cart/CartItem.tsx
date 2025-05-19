
import React from 'react';
import { X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { CartItemProps } from './CartItemProps';

export const CartItem = ({ item, onRemove, onUpdateQuantity }: CartItemProps) => {
  const pathname = window.location.pathname;

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
            <h3>
              <Link to={`/product/${item.productId}`} className="hover:text-winshirt-purple">
                {item.name}
              </Link>
            </h3>
            <p className="ml-4">{formatCurrency(item.price * item.quantity)}</p>
          </div>
          {item.color && (
            <p className="mt-1 text-sm text-gray-400">
              Couleur: <span className="text-white">{item.color}</span>
            </p>
          )}
          {item.size && (
            <p className="mt-1 text-sm text-gray-400">
              Taille: <span className="text-white">{item.size}</span>
            </p>
          )}
          {item.customization && item.customization.customText && (
            <p className="mt-1 text-sm text-gray-400">
              Texte: <span className="text-white">{item.customization.customText}</span>
            </p>
          )}
          {item.customization && item.customization.designName && (
            <p className="mt-1 text-sm text-gray-400">
              Design: <span className="text-white">{item.customization.designName}</span>
            </p>
          )}
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center">
            <span className="text-gray-400 mr-2">Qté</span>
            <select
              className="bg-transparent border border-gray-600 rounded px-2 py-1"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="flex">
            <button
              type="button"
              onClick={handleRemove}
              className="font-medium text-winshirt-purple hover:text-winshirt-purple/80 flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              {pathname.includes('cart') ? 'Remove' : ''}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
