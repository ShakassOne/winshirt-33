// Import the CartItemProps
import { CartItem as CartItemComponent } from '@/components/cart/CartItem';
import { CartItemProps } from '@/components/cart/CartItemProps';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { items, removeItem, updateQuantity: updateItemQuantity, total, itemCount, isLoading } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {items.length === 0 ? (
        <div>
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate('/products')}>Continue Shopping</button>
        </div>
      ) : (
        <div>
          <h1>Shopping Cart</h1>
          <div>
            <ul>
              {items.map((item) => (
                <CartItemComponent 
                  key={item.productId} 
                  item={item} 
                  onRemove={removeItem} 
                  onUpdateQuantity={updateItemQuantity}
                />
              ))}
            </ul>
          </div>
          <div>
            <div>
              <span>Subtotal ({itemCount || items.length} items)</span>
              <span>{formatCurrency(total || 0)}</span>
            </div>
            <button onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
