
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '@/services/order.service';
import { OrderItemDetails } from '@/components/order/OrderItemDetails';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle } from 'lucide-react';

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            <Button asChild>
              <Link to="/">Retourner à l'accueil</Link>
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 flex items-center justify-center bg-green-500/20 rounded-full mb-6">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Merci pour votre commande !</h1>
            <p className="mb-2">Votre commande a été confirmée</p>
            <p className="text-gray-400">Numéro de commande: {order.id}</p>
          </div>
          
          {/* Informations générales de la commande */}
          <div className="glass-card p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="font-semibold mb-3 border-b border-gray-700 pb-2">Détails de la commande</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Statut:</span>
                    <span className="capitalize">{order.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Paiement:</span>
                    <span className="capitalize">{order.payment_status}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{order.total_amount.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="font-semibold mb-3 border-b border-gray-700 pb-2">Adresse de livraison</h2>
                <div className="space-y-1 text-sm">
                  <p>{order.shipping_first_name} {order.shipping_last_name}</p>
                  <p>{order.shipping_address}</p>
                  <p>{order.shipping_postal_code} {order.shipping_city}</p>
                  <p>{order.shipping_country}</p>
                  <p>{order.shipping_email}</p>
                  <p>{order.shipping_phone}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Articles commandés avec détails complets */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Articles commandés</h2>
            {order.items && order.items.map((item: any) => (
              <OrderItemDetails key={item.id} item={item} />
            ))}
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild>
              <Link to="/">Continuer mes achats</Link>
            </Button>
            {order.user_id && (
              <Button variant="outline" asChild>
                <Link to="/account">Voir mes commandes</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
