
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/context/CartContext';
import { createOrder, createAccount, updateOrderPaymentStatus } from '@/services/order.service';
import { CheckoutFormData } from '@/types/cart.types';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, clearCart, cartToken, currentUser } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get form data from location state
  const checkoutData: CheckoutFormData = location.state?.checkoutData;
  const orderId: string = location.state?.orderId;

  useEffect(() => {
    if (!checkoutData || items.length === 0 || !orderId) {
      navigate('/checkout');
    }
  }, [checkoutData, items, orderId, navigate]);

  const handlePayment = async () => {
    if (!checkoutData) {
      toast({
        title: "Erreur",
        description: "Les données de paiement sont manquantes. Veuillez réessayer.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      console.log("Processing payment with data:", {
        checkoutData,
        items,
        currentUser,
        cartToken,
        orderId
      });

      // Generate a fake payment intent ID for demo purposes
      const paymentIntentId = `pi_${Math.random().toString(36).substring(2, 15)}`;
      
      // Update order payment status to 'paid'
      await updateOrderPaymentStatus(orderId, paymentIntentId, 'paid');

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to confirmation page
      navigate(`/order-confirmation/${orderId}`);
    } catch (err: any) {
      console.error("Error processing payment:", err);
      setError(err.message || "Une erreur s'est produite lors du traitement du paiement.");
      toast({
        title: "Erreur de paiement",
        description: err.message || "Une erreur s'est produite lors du traitement du paiement.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!checkoutData) {
    return null;
  }

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Paiement</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Résumé de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Informations de livraison</h3>
                <p>
                  {checkoutData.firstName} {checkoutData.lastName}<br />
                  {checkoutData.address}<br />
                  {checkoutData.postalCode} {checkoutData.city}<br />
                  {checkoutData.country}
                </p>
                <p>{checkoutData.email}</p>
                <p>{checkoutData.phone}</p>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Articles</h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={`${item.productId}-${JSON.stringify(item.customization)}`} className="flex justify-between">
                      <span>
                        {item.name} {item.size && `(${item.size})`}{" "}
                        {item.color && `- ${item.color}`} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        {(item.price * item.quantity).toFixed(2)}€
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Total à payer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{totalAmount.toFixed(2)}€</span>
              </div>
              
              {error && (
                <div className="text-red-600 text-sm p-2 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              
              <Button 
                onClick={handlePayment} 
                className="w-full" 
                disabled={isProcessing}
              >
                {isProcessing ? "Traitement en cours..." : "Payer maintenant"}
              </Button>
              
              <p className="text-xs text-center text-gray-500 mt-4">
                En cliquant sur "Payer maintenant", vous acceptez nos conditions générales de vente.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
