import logger from '@/utils/logger';

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getOrderById } from '@/services/order.service';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import PaymentWrapper from '@/components/payment/PaymentWrapper';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const orderId = state?.orderId;
  const checkoutData = state?.checkoutData;
  const orderTotal = state?.orderTotal;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError("Identifiant de commande manquant");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        console.error("Erreur lors de la récupération de la commande:", err);
        setError("Impossible de récupérer les détails de la commande");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleStripeCheckout = async () => {
    if (!order || !checkoutData) return;
    
    setPaymentLoading(true);
    
    try {
      logger.log("Creating Stripe checkout session...");
      
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          orderId: order.id,
          items: order.items?.map((item: any) => ({
            name: item.products?.name || 'Produit',
            price: parseFloat(item.price),
            quantity: item.quantity,
            image_url: item.products?.image_url,
            color: item.customization?.color,
            size: item.customization?.size,
          })) || [],
          total: order.total_amount,
          checkoutData: checkoutData,
        },
      });

      if (error) {
        console.error("Error creating checkout session:", error);
        throw error;
      }

      if (data?.url) {
        logger.log("Redirecting to Stripe checkout:", data.url);
        // Rediriger vers Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("URL de checkout manquante");
      }
    } catch (err) {
      console.error("Erreur lors de la création de la session Stripe:", err);
      toast({
        title: "Erreur",
        description: "Impossible de créer la session de paiement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="spinner"></div>
            <p className="mt-4">Chargement des détails de la commande...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16 flex-grow">
          <div className="max-w-2xl mx-auto glass-card p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-xl font-bold mb-4">Une erreur est survenue</h1>
            <p className="mb-6">{error || "Impossible de récupérer les détails de la commande"}</p>
            <Button onClick={() => navigate('/cart')}>
              Retourner au panier
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <PaymentWrapper fallback={
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16 flex-grow">
          <div className="max-w-2xl mx-auto glass-card p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h1 className="text-xl font-bold mb-4">Paiement indisponible</h1>
            <p className="mb-6">Les fonctionnalités de paiement ne sont pas disponibles actuellement. Veuillez contacter le support.</p>
            <Button onClick={() => navigate('/cart')}>
              Retourner au panier
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 mt-16 flex-grow">
          <div className="max-w-2xl mx-auto">
            <div className="glass-card p-8">
              <h1 className="text-2xl font-bold mb-6">Paiement sécurisé</h1>
              
              <div className="mb-6">
                <h2 className="font-semibold mb-4">Résumé de votre commande</h2>
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <div className="space-y-3">
                    {order.items?.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-medium">{item.products?.name || 'Produit'}</p>
                          <p className="text-sm text-gray-400">
                            Qté: {item.quantity} × {parseFloat(item.price).toFixed(2)} €
                          </p>
                        </div>
                        <p className="font-semibold">
                          {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-600 mt-4 pt-4">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total</span>
                      <span>{order.total_amount.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Adresse de livraison</h3>
                <div className="text-sm text-gray-300">
                  <p>{order.shipping_first_name} {order.shipping_last_name}</p>
                  <p>{order.shipping_address}</p>
                  <p>{order.shipping_postal_code} {order.shipping_city}</p>
                  <p>{order.shipping_country}</p>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5" />
                  <span className="font-semibold">Paiement par carte</span>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Vous allez être redirigé vers notre plateforme de paiement sécurisée Stripe pour finaliser votre achat.
                </p>
                <div className="text-xs text-gray-500">
                  🔒 Paiement 100% sécurisé - Vos données bancaires sont protégées par le cryptage SSL
                </div>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                disabled={paymentLoading}
                onClick={handleStripeCheckout}
              >
                {paymentLoading ? (
                  <>
                    <div className="spinner spinner-sm mr-2"></div>
                    Redirection en cours...
                  </>
                ) : (
                  <>
                    Payer {order.total_amount.toFixed(2)} € <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              
              <p className="mt-4 text-xs text-gray-400 text-center">
                En cliquant sur "Payer", vous acceptez nos conditions générales de vente et serez redirigé vers Stripe.
              </p>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </PaymentWrapper>
  );
};

export default Payment;
