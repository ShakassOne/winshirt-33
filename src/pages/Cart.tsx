
import CartItem from '@/components/cart/CartItem';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { items, removeItem, updateQuantity, total, itemCount, isLoading } = useCart();
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
                <CartItem 
                  key={item.productId} 
                  item={item} 
                  onRemove={removeItem} 
                  onUpdateQuantity={updateQuantity}
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
