
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Truck, ArrowRight } from 'lucide-react';
import { ExtendedOrder, OrderStatus, PaymentStatus } from '@/types/supabase.types';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<ExtendedOrder | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data: orderData, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products:product_id (*)
            )
          `)
          .eq('id', orderId)
          .single();

        if (error) throw error;
        
        // Valider et convertir les types
        const validatedOrder: ExtendedOrder = {
          ...orderData,
          status: (['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(orderData.status) 
            ? orderData.status 
            : 'pending') as OrderStatus,
          payment_status: (['pending', 'paid', 'failed'].includes(orderData.payment_status) 
            ? orderData.payment_status 
            : 'pending') as PaymentStatus,
          items: orderData.order_items
        };
        
        setOrder(validatedOrder);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
            <p>Chargement des détails de votre commande...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Commande introuvable</h1>
            <Button onClick={() => navigate('/')}>
              Retour à l'accueil
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
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Header */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Paiement réussi !
            </h1>
            <p className="text-gray-600">
              Votre commande a été confirmée et sera traitée dans les plus brefs délais.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Détails de votre commande
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-500">Numéro de commande</p>
                  <p className="font-medium">#{order.id.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Montant total</p>
                  <p className="font-medium">{order.total_amount.toFixed(2)} €</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de commande</p>
                  <p className="font-medium">
                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    En cours de traitement
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-gray-500" />
                  <p className="text-sm font-medium">Adresse de livraison</p>
                </div>
                <div className="text-left bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">
                    {order.shipping_first_name} {order.shipping_last_name}
                  </p>
                  <p className="text-sm text-gray-600">{order.shipping_address}</p>
                  <p className="text-sm text-gray-600">
                    {order.shipping_postal_code} {order.shipping_city}
                  </p>
                  <p className="text-sm text-gray-600">{order.shipping_country}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-3 text-left">Articles commandés</p>
                <div className="space-y-2">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.products.image_url}
                        alt={item.products.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-grow text-left">
                        <p className="font-medium text-sm">{item.products.name}</p>
                        <p className="text-xs text-gray-500">
                          Quantité: {item.quantity}
                          {item.selected_color && ` • ${item.selected_color}`}
                          {item.selected_size && ` • ${item.selected_size}`}
                        </p>
                      </div>
                      <p className="font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => navigate('/orders')}
                className="w-full"
              >
                Voir mes commandes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/products')}
                className="w-full"
              >
                Continuer mes achats
              </Button>
            </div>
            
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                Un email de confirmation a été envoyé à {order.shipping_email}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
