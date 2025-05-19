
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getOrderById, updateOrderPaymentStatus } from '@/services/order.service';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, CreditCard, Check, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const orderId = state?.orderId;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');

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

  const handleProcessPayment = async () => {
    if (!order) return;
    
    setPaymentStatus('processing');
    
    try {
      // Simulation d'un paiement réussi (à remplacer par Stripe ou autre)
      // Attendre 2 secondes pour simuler le traitement du paiement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mise à jour du statut de la commande
      const paymentIntentId = `pi_${Math.random().toString(36).substring(2, 15)}`;
      await updateOrderPaymentStatus(orderId, paymentIntentId, 'paid');
      
      // Envoyer un email de confirmation (simulation)
      if (order.shipping_email) {
        console.log(`Email de confirmation envoyé à ${order.shipping_email}`);
      }
      
      setPaymentStatus('success');
    } catch (err) {
      console.error("Erreur lors du traitement du paiement:", err);
      setPaymentStatus('failed');
    }
  };

  const handleCompleteOrder = () => {
    navigate(`/order-confirmation/${orderId}`);
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16 flex-grow">
        <div className="max-w-2xl mx-auto">
          {paymentStatus === 'success' ? (
            <div className="glass-card p-8 text-center">
              <div className="mx-auto h-16 w-16 flex items-center justify-center bg-green-500/20 rounded-full mb-6">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Paiement réussi !</h1>
              <p className="mb-2">Votre commande a été confirmée</p>
              <p className="text-gray-400 mb-6">Numéro de commande: {order.id}</p>
              
              <div className="mb-6 text-left bg-gray-800/50 rounded-lg p-4">
                <h2 className="font-semibold mb-2">Résumé de la commande</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>{order.total_amount.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Adresse de livraison</span>
                    <span className="text-right">
                      {`${order.shipping_first_name} ${order.shipping_last_name}`}<br />
                      {order.shipping_address}<br />
                      {`${order.shipping_postal_code} ${order.shipping_city}`}<br />
                      {order.shipping_country}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-400 mb-6">
                Un email de confirmation a été envoyé à {order.shipping_email}
              </p>
              
              <Button size="lg" onClick={handleCompleteOrder}>
                Continuer <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="glass-card p-8">
              <h1 className="text-2xl font-bold mb-6">Paiement</h1>
              
              <div className="mb-6">
                <h2 className="font-semibold mb-2">Détails de la commande</h2>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total à payer</span>
                      <span className="font-semibold">{order.total_amount.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Méthode de paiement</span>
                      <span>Carte de crédit</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Simulation d'un formulaire de paiement par carte */}
              <div className="mb-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Numéro de carte</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700">
                      <CreditCard className="h-4 w-4" />
                    </span>
                    <input 
                      type="text"
                      className="flex-1 rounded-r-md border border-gray-600 bg-gray-700 px-3 py-2" 
                      placeholder="4242 4242 4242 4242"
                      value="4242 4242 4242 4242"
                      readOnly
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date d'expiration</label>
                    <input 
                      type="text"
                      className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2" 
                      placeholder="MM / AA"
                      value="12 / 25"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <input 
                      type="text"
                      className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2" 
                      placeholder="123"
                      value="123"
                      readOnly
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Nom sur la carte</label>
                  <input 
                    type="text"
                    className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2" 
                    placeholder="John Doe"
                    value={`${order.shipping_first_name} ${order.shipping_last_name}`}
                    readOnly
                  />
                </div>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                disabled={paymentStatus === 'processing'}
                onClick={handleProcessPayment}
              >
                {paymentStatus === 'processing' ? (
                  <>
                    <div className="spinner spinner-sm mr-2"></div>
                    Traitement en cours...
                  </>
                ) : paymentStatus === 'failed' ? (
                  'Réessayer le paiement'
                ) : (
                  'Payer maintenant'
                )}
              </Button>
              
              {paymentStatus === 'failed' && (
                <div className="mt-4 p-3 bg-red-500/20 rounded-md text-red-400 text-sm">
                  Le paiement a échoué. Veuillez vérifier vos informations et réessayer.
                </div>
              )}
              
              <p className="mt-4 text-xs text-gray-400 text-center">
                En cliquant sur "Payer maintenant", vous acceptez nos conditions générales de vente.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Payment;
