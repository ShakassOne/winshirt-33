
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/cart/CartItem';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const totalPrice = useMemo(() => getTotalPrice(), [getTotalPrice]);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Mon Panier</h1>
          
          {items.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Votre panier est vide</h2>
              <p className="text-muted-foreground mb-6">
                Découvrez nos produits et ajoutez-les à votre panier
              </p>
              <Button onClick={() => navigate('/products')}>
                Voir les produits
              </Button>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={`${item.id}-${item.size}-${item.color}`}
                    item={item}
                    onUpdateQuantity={(newQuantity) => updateQuantity(item.id, newQuantity, item.size, item.color)}
                    onRemove={() => removeFromCart(item.id, item.size, item.color)}
                  />
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <GlassCard className="p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">Résumé de la commande</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span>{totalPrice.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraison</span>
                      <span>Gratuite</span>
                    </div>
                    <div className="border-t border-white/20 pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>{totalPrice.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                  
                  <AnimatedButton 
                    onClick={handleCheckout}
                    className="w-full"
                  >
                    Procéder au paiement
                  </AnimatedButton>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-3"
                    onClick={() => navigate('/products')}
                  >
                    Continuer mes achats
                  </Button>
                </GlassCard>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
