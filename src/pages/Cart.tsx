
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-6">Votre panier</h1>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center">
          <h2 className="text-xl mb-4">Votre panier est vide</h2>
          <p className="text-muted-foreground mb-6">Ajoutez des produits à votre panier pour commencer vos achats</p>
          <Button asChild>
            <Link to="/products">Voir nos produits</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Votre panier</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div 
              key={`${item.productId}-${item.color}-${item.size}`} 
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex gap-4"
            >
              <div className="w-24 h-24 rounded-md overflow-hidden">
                <img 
                  src={item.customization?.designUrl || item.image_url} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-grow">
                <h3 className="font-medium">{item.name}</h3>
                
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-1">
                  {item.color && (
                    <div className="flex items-center gap-1">
                      <span>Couleur:</span>
                      <div 
                        className="w-3 h-3 rounded-full border border-white/30" 
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  )}
                  
                  {item.size && (
                    <div className="flex items-center gap-1">
                      <span>Taille: {item.size}</span>
                    </div>
                  )}
                  
                  {item.customization && (
                    <div className="flex items-center gap-1">
                      <span>Personnalisé</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.color || undefined, item.size || undefined)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="mx-3">{item.quantity}</span>
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.color || undefined, item.size || undefined)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{(item.price * item.quantity).toFixed(2)} €</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFromCart(item.productId, item.color || undefined, item.size || undefined)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-medium mb-4">Résumé de commande</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Nombre d'articles</span>
                <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
            </div>
            
            <div className="border-t border-white/10 my-4 pt-4">
              <div className="flex justify-between font-medium mb-6">
                <span>Total</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
              
              <Button asChild className={cn("w-full", "bg-gradient-purple")} size="lg">
                <Link to="/checkout">
                  Passer à la caisse
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <div className="mt-4 text-center">
                <Link 
                  to="/products" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Continuer vos achats
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
