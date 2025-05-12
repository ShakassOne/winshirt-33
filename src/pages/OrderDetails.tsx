
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Truck, Package, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getOrderById } from '@/services/order.service';

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError(err.message || 'Une erreur est survenue lors du chargement de la commande');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);
  
  const getStatusStep = (status: string) => {
    switch (status) {
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0; // pending
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto flex-grow flex items-center justify-center">
          <p>Chargement de la commande...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto flex-grow flex flex-col items-center justify-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Erreur</h1>
          <p className="text-muted-foreground mb-6">
            {error || "Impossible de trouver cette commande"}
          </p>
          <Button asChild>
            <Link to="/account">Retour à mon compte</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  const statusStep = getStatusStep(order.status);
  const totalItems = order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" className="mb-6" asChild>
            <Link to="/account">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Retour à mon compte
            </Link>
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Commande #{order.id.slice(0, 8)}</h1>
          <p className="text-muted-foreground mb-8">
            Passée le {formatDate(order.created_at)}
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="mr-2 h-5 w-5" />
                    Suivi de commande
                  </CardTitle>
                  <CardDescription>
                    Statut actuel: {
                      order.status === 'processing' ? 'En cours de traitement' :
                      order.status === 'shipped' ? 'Expédiée' :
                      order.status === 'delivered' ? 'Livrée' :
                      order.status === 'cancelled' ? 'Annulée' :
                      'En attente de traitement'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {order.status !== 'cancelled' ? (
                    <div className="relative">
                      <div className="flex justify-between mb-2">
                        <div className="text-center">
                          <div className={`rounded-full h-10 w-10 flex items-center justify-center mx-auto mb-1 ${
                            statusStep >= 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            <CheckCircle className="h-5 w-5" />
                          </div>
                          <div className="text-xs">Confirmée</div>
                        </div>
                        
                        <div className="text-center">
                          <div className={`rounded-full h-10 w-10 flex items-center justify-center mx-auto mb-1 ${
                            statusStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            <Package className="h-5 w-5" />
                          </div>
                          <div className="text-xs">En préparation</div>
                        </div>
                        
                        <div className="text-center">
                          <div className={`rounded-full h-10 w-10 flex items-center justify-center mx-auto mb-1 ${
                            statusStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            <Truck className="h-5 w-5" />
                          </div>
                          <div className="text-xs">Expédiée</div>
                        </div>
                        
                        <div className="text-center">
                          <div className={`rounded-full h-10 w-10 flex items-center justify-center mx-auto mb-1 ${
                            statusStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div className="text-xs">Livrée</div>
                        </div>
                      </div>
                      
                      <div className="relative h-1 bg-muted rounded-full mt-6">
                        <div 
                          className="absolute top-0 left-0 h-1 bg-primary rounded-full"
                          style={{ width: `${statusStep * 33.33}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-2" />
                      <p>Cette commande a été annulée</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Articles commandés ({totalItems})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded bg-muted flex-shrink-0 overflow-hidden">
                          {item.products?.image_url && (
                            <img 
                              src={item.products.image_url} 
                              alt={item.products.name}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">{item.products?.name}</div>
                          {item.customization && (
                            <div className="text-sm text-muted-foreground">
                              Personnalisé
                            </div>
                          )}
                          {item.size && (
                            <div className="text-sm text-muted-foreground">
                              Taille: {item.size}
                            </div>
                          )}
                          {item.color && (
                            <div className="text-sm text-muted-foreground">
                              Couleur: {item.color}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {item.price.toFixed(2)} €
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Quantité: {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Résumé</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span>{order.total_amount.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Livraison</span>
                      <span>0.00 €</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{order.total_amount.toFixed(2)} €</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Livraison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">
                      {order.shipping_first_name} {order.shipping_last_name}
                    </p>
                    <p>{order.shipping_address}</p>
                    <p>{order.shipping_postal_code} {order.shipping_city}</p>
                    <p>{order.shipping_country}</p>
                    {order.delivery_notes && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">Notes de livraison:</p>
                        <p className="text-sm">{order.delivery_notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Besoin d'aide ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/contact">
                      Contacter le support
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderDetails;
