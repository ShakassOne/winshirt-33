
import React, { memo, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartItem from '@/components/cart/CartItem';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';

// Memoized empty cart component
const EmptyCart = memo(() => (
  <div className="text-center py-12 glass-card">
    <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" aria-hidden="true" />
    <h2 className="text-xl font-semibold mb-2">Votre panier est vide</h2>
    <p className="text-gray-400 mb-6">Ajoutez des articles à votre panier pour continuer vos achats</p>
    <Button asChild>
      <Link to="/products">Voir les produits</Link>
    </Button>
  </div>
));

EmptyCart.displayName = 'EmptyCart';

// Memoized order summary component
const OrderSummary = memo(({ total, itemCount }: { total: number; itemCount: number }) => {
  const formatPrice = (price: number) => price.toFixed(2);
  
  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold mb-4">Résumé de la commande</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-400">Sous-total</span>
          <span>{formatPrice(total)} €</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Nombre d'articles</span>
          <span>{itemCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Livraison</span>
          <span>Calculé à l'étape suivante</span>
        </div>
      </div>
      
      <div className="border-t border-gray-100/10 pt-4 mb-6">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)} €</span>
        </div>
      </div>
      
      <Button className="w-full" size="lg" asChild>
        <Link to="/checkout">
          Passer à la caisse <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
      
      <div className="mt-4">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/products">
            Continuer mes achats
          </Link>
        </Button>
      </div>
    </div>
  );
});

OrderSummary.displayName = 'OrderSummary';

const Cart = memo(() => {
  const { items, removeItem, updateItemQuantity, total, itemCount, isLoading } = useCart();

  // Memoize cart items to prevent unnecessary re-renders
  const memoizedItems = useMemo(() => items, [items]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Votre Panier</h1>
          
          {isLoading ? (
            <div className="text-center py-12">
              <LoadingSpinner size="lg" text="Chargement de votre panier..." />
            </div>
          ) : itemCount === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="glass-card divide-y divide-gray-100/10">
                  {memoizedItems.map((item) => (
                    <CartItem 
                      key={item.productId}
                      item={item}
                      onRemove={removeItem}
                      onUpdateQuantity={updateItemQuantity}
                    />
                  ))}
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <OrderSummary total={total} itemCount={itemCount} />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
});

Cart.displayName = 'Cart';

export default Cart;
