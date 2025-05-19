
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getOrderById } from '@/services/order.service';
import { ExtendedOrder } from '@/types/supabase.types';
import { format } from 'date-fns';

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<ExtendedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        setIsLoading(true);
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (err: any) {
        console.error("Error fetching order:", err);
        setError(err.message || "Impossible de charger les détails de la commande");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Chargement des détails de la commande...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-600">{error || "Commande non trouvée"}</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'paid': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Commande #{order.id.slice(0, 8)}</h1>
        <div className="flex gap-2">
          <Badge variant="outline" className={`${getStatusColor(order.status)} text-white`}>
            {order.status === 'pending' && "En attente"}
            {order.status === 'processing' && "En traitement"}
            {order.status === 'shipped' && "Expédiée"}
            {order.status === 'delivered' && "Livrée"}
            {order.status === 'cancelled' && "Annulée"}
          </Badge>
          <Badge variant="outline" className={`${getPaymentStatusColor(order.payment_status)} text-white`}>
            {order.payment_status === 'pending' && "Paiement en attente"}
            {order.payment_status === 'paid' && "Payée"}
            {order.payment_status === 'failed' && "Paiement échoué"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Informations de commande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Date de commande</p>
                <p>{formatDate(order.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dernière mise à jour</p>
                <p>{order.updated_at ? formatDate(order.updated_at) : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-bold">{order.total_amount.toFixed(2)}€</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Numéro de commande</p>
                <p>{order.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adresse de livraison</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{order.shipping_first_name} {order.shipping_last_name}</p>
            <p>{order.shipping_address}</p>
            <p>{order.shipping_postal_code} {order.shipping_city}</p>
            <p>{order.shipping_country}</p>
            <p className="mt-2">{order.shipping_email}</p>
            <p>{order.shipping_phone}</p>
            {order.delivery_notes && (
              <>
                <p className="mt-2 text-sm text-gray-500">Notes de livraison:</p>
                <p className="text-sm">{order.delivery_notes}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Articles commandés</CardTitle>
        </CardHeader>
        <CardContent>
          {order.items.length === 0 ? (
            <p className="text-gray-500">Aucun article dans cette commande</p>
          ) : (
            <ul className="divide-y">
              {order.items.map((item) => (
                <li key={item.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded overflow-hidden">
                      <img 
                        src={item.products?.image_url || '/placeholder.svg'} 
                        alt={item.products?.name || 'Product'} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.products?.name}</h3>
                      <div className="text-sm text-gray-500">
                        {item.customization && (
                          <p>
                            {item.customization.designName && `Design: ${item.customization.designName}`}
                            {item.customization.customText && ` - Texte: "${item.customization.customText}"`}
                          </p>
                        )}
                        <p className="mt-1">
                          Quantité: {item.quantity} × {item.price.toFixed(2)}€
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{(item.price * item.quantity).toFixed(2)}€</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Separator className="my-4" />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{order.total_amount.toFixed(2)}€</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetail;
