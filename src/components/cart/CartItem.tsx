
import React from 'react';
import { CartItem as CartItemType } from '@/types/supabase.types';
import { X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link, useLocation } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeItem, updateQuantity } = useCart();
  const location = useLocation();
  const pathname = location.pathname;

  const handleRemove = () => {
    removeItem(item.productId);
  };

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.productId, newQuantity);
  };

  return (
    <li key={item.productId} className="flex py-6">
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
              <Link to={`/products/${item.productId}`} className="hover:text-gray-400">
                {item.name}
              </Link>
            </h3>
            <p className="ml-4">{formatCurrency(item.price)}</p>
          </div>
          <div className="flex gap-2 mt-1 text-sm text-gray-500">
            {item.color && <p>Color: {item.color}</p>}
            {item.size && <p>Size: {item.size}</p>}
          </div>
          {item.customization?.customText && (
            <p className="mt-1 text-sm text-gray-500">Text: {item.customization.customText}</p>
          )}
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex gap-4">
            <div className="max-w-[120px]">
              <label htmlFor={`quantity-${item.productId}`} className="sr-only">
                Quantity
              </label>
              <select
                id={`quantity-${item.productId}`}
                className="rounded-md border border-gray-700 bg-gray-900 py-1.5 pl-3 pr-5 text-white focus:border-indigo-500 focus:text-gray-900 sm:text-sm"
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
            {pathname !== '/checkout' && (
              <button type="button" className="font-medium text-winshirt-purple hover:text-indigo-500" onClick={handleRemove}>
                Remove
              </button>
            )}
          </div>
          {pathname !== '/checkout' && (
            <div className="flex">
              <button type="button" className="-m-2 inline-flex p-2 text-gray-500 hover:text-gray-400" onClick={handleRemove}>
                <span className="sr-only">Remove</span>
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default CartItem;
