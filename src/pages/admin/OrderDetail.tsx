import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrderById, updateOrderStatus } from '@/services/order.service';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GlassCard from '@/components/ui/GlassCard';
import { ArrowLeft, Package, Truck, CheckCircle, ShoppingBag, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Order } from '@/types/supabase.types';

// Types pour la personnalisation
type TextCustomization = {
  content: string;
  font: string;
  color: string;
  printPosition: 'front' | 'back';
  transform?: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
};

type DesignCustomization = {
  designId: string;
  designName?: string;
  designUrl: string;
  printPosition: 'front' | 'back';
  printSize: string;
  transform?: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
};

type CustomizationType = {
  designId?: string;
  designName?: string;
  designUrl?: string;
  printPosition?: 'front' | 'back';
  printSize?: string;
  transform?: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
  text?: TextCustomization;
};

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: order, isLoading, error, refetch } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId || ''),
    enabled: !!orderId,
  });

  const handleUpdateStatus = async (newStatus: Order['status']) => {
    if (!orderId) return;
    
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      
      toast.success(`Statut mis à jour: ${newStatus}`);
      
      if (refetch) {
        refetch();
      }
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Fonction utilitaire pour extraire les données de personnalisation en toute sécurité
  const getCustomization = (customization: any): CustomizationType => {
    if (!customization) return {};
    
    // Si c'est une chaîne, essayer de la parser
    if (typeof customization === 'string') {
      try {
        return JSON.parse(customization);
      } catch (e) {
        console.error('Erreur lors du parsing de la personnalisation:', e);
        return {};
      }
    }
    
    return customization as CustomizationType;
  };

  // Fixed comparison for order status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500">En attente</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-500">En traitement</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-purple-500">Expédiée</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-500">Livrée</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-500">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Non défini</Badge>;
    
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-500">Payé</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500">En attente</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-500">Échoué</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow mt-16 pb-20">
          <div className="container mx-auto px-4 py-8">
            <p className="text-center">Chargement des détails de la commande...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow mt-16 pb-20">
          <div className="container mx-auto px-4 py-8">
            <p className="text-center">Erreur lors du chargement des détails de la commande</p>
            <Button asChild className="mt-4">
              <Link to="/admin/orders">Retour aux commandes</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link to="/admin/orders" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux commandes
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Commande #{order.id.substring(0, 8)}
              </h1>
              <p className="text-white/70">
                Passée le {formatDate(order.created_at)}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col md:items-end">
              <div className="flex gap-2 mb-2">
                {getStatusBadge(order.status)}
                {getPaymentStatusBadge(order.payment_status)}
              </div>
              
              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <div className="flex gap-2 mt-2">
                  {order.status === 'pending' && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleUpdateStatus('processing')}
                      disabled={isUpdating}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Marquer en traitement
                    </Button>
                  )}
                  
                  {order.status === 'processing' && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleUpdateStatus('shipped')}
                      disabled={isUpdating}
                    >
                      <Truck className="mr-2 h-4 w-4" />
                      Marquer comme expédiée
                    </Button>
                  )}
                  
                  {order.status === 'shipped' && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleUpdateStatus('delivered')}
                      disabled={isUpdating}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Marquer comme livrée
                    </Button>
                  )}
                  
                  {(order.status === 'pending' || order.status === 'processing' || order.status === 'shipped') && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleUpdateStatus('cancelled')}
                      disabled={isUpdating}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Annuler
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Informations client</h3>
              <div className="space-y-2">
                <p><span className="text-white/70">Nom:</span> {order.shipping_first_name} {order.shipping_last_name}</p>
                <p><span className="text-white/70">Email:</span> {order.shipping_email}</p>
                <p><span className="text-white/70">Téléphone:</span> {order.shipping_phone}</p>
                {order.user_id && (
                  <p><span className="text-white/70">ID Utilisateur:</span> {order.user_id.substring(0, 8)}</p>
                )}
              </div>
            </GlassCard>
            
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Adresse de livraison</h3>
              <div className="space-y-2">
                <p>{order.shipping_address}</p>
                <p>{order.shipping_postal_code} {order.shipping_city}</p>
                <p>{order.shipping_country}</p>
                {order.delivery_notes && (
                  <p className="mt-4">
                    <span className="text-white/70">Notes de livraison:</span>
                    <br />
                    {order.delivery_notes}
                  </p>
                )}
              </div>
            </GlassCard>
            
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Détails de paiement</h3>
              <div className="space-y-2">
                <p><span className="text-white/70">Total:</span> {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(order.total_amount)}</p>
                <p><span className="text-white/70">Statut du paiement:</span> {getPaymentStatusBadge(order.payment_status)}</p>
                {order.payment_intent_id && (
                  <p><span className="text-white/70">ID Transaction:</span> {order.payment_intent_id}</p>
                )}
              </div>
            </GlassCard>
          </div>

          <h3 className="text-xl font-semibold mb-4">Articles commandés</h3>
          <GlassCard className="p-0 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Produit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Détails</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Prix unitaire</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Quantité</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Sous-total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {order.items?.map((item: any) => {
                    const customization = getCustomization(item.customization);
                    
                    return (
                      <tr key={item.id} className="hover:bg-white/5">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden bg-white/10">
                              {item.products?.image_url ? (
                                <img 
                                  src={item.products.image_url} 
                                  alt={item.products.name} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <ShoppingBag className="h-8 w-8 text-white/40" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium">{item.products?.name || 'Produit inconnu'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {customization?.designUrl && (
                              <p>
                                <button 
                                  onClick={() => {
                                    const modal = document.getElementById(`modal-${item.id}`);
                                    if (modal instanceof HTMLDialogElement) {
                                      modal.showModal();
                                    }
                                  }}
                                  className="text-winshirt-blue underline"
                                >
                                  Voir la personnalisation
                                </button>
                              </p>
                            )}
                            {item.color && (
                              <p><span className="text-white/70">Couleur:</span> {item.color}</p>
                            )}
                            {item.size && (
                              <p><span className="text-white/70">Taille:</span> {item.size}</p>
                            )}
                          </div>
                          
                          {/* Modal pour afficher la personnalisation */}
                          <dialog id={`modal-${item.id}`} className="modal">
                            <div className="modal-box bg-black/90 max-w-4xl">
                              <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                              </form>
                              <h3 className="font-bold text-lg mb-4">Détails de personnalisation</h3>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Image du produit */}
                                <div className="relative bg-white/10 rounded-lg p-4 flex items-center justify-center">
                                  <img 
                                    src={item.products?.image_url} 
                                    alt={item.products?.name} 
                                    className="max-w-full max-h-[300px] object-contain"
                                  />
                                </div>
                                
                                {/* Personnalisation */}
                                <div>
                                  <div className="mb-6">
                                    <h4 className="font-semibold mb-2">Informations sur le design</h4>
                                    <div className="bg-white/5 p-4 rounded-lg">
                                      {customization?.designUrl ? (
                                        <div className="space-y-3">
                                          <div className="bg-white/10 rounded-lg h-48 flex items-center justify-center overflow-hidden">
                                            <img 
                                              src={customization.designUrl} 
                                              alt="Design personnalisé"
                                              className="max-h-full"
                                            />
                                          </div>
                                          <p><span className="text-white/70">Position:</span> {customization.printPosition === 'front' ? 'Devant' : 'Arrière'}</p>
                                          <p><span className="text-white/70">Taille:</span> {customization.printSize}</p>
                                          {customization.transform && (
                                            <>
                                              <p><span className="text-white/70">Position X/Y:</span> {customization.transform.position.x.toFixed(2)}/{customization.transform.position.y.toFixed(2)}</p>
                                              <p><span className="text-white/70">Échelle:</span> {(customization.transform.scale * 100).toFixed(0)}%</p>
                                              <p><span className="text-white/70">Rotation:</span> {customization.transform.rotation}°</p>
                                            </>
                                          )}
                                        </div>
                                      ) : (
                                        <p>Pas de design personnalisé</p>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {customization?.text && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Texte personnalisé</h4>
                                      <div className="bg-white/5 p-4 rounded-lg">
                                        <div className="bg-white/10 rounded-lg p-4 mb-3" style={{color: customization.text.color}}>
                                          <p style={{fontFamily: customization.text.font, fontSize: '1.5rem'}}>{customization.text.content}</p>
                                        </div>
                                        <p><span className="text-white/70">Police:</span> {customization.text.font}</p>
                                        <p><span className="text-white/70">Couleur:</span> <span className="inline-block w-4 h-4 rounded-full ml-1" style={{backgroundColor: customization.text.color}}></span> {customization.text.color}</p>
                                        <p><span className="text-white/70">Position:</span> {customization.text.printPosition === 'front' ? 'Devant' : 'Arrière'}</p>
                                        {customization.text.transform && (
                                          <>
                                            <p><span className="text-white/70">Position X/Y:</span> {customization.text.transform.position.x.toFixed(2)}/{customization.text.transform.position.y.toFixed(2)}</p>
                                            <p><span className="text-white/70">Échelle:</span> {(customization.text.transform.scale * 100).toFixed(0)}%</p>
                                            <p><span className="text-white/70">Rotation:</span> {customization.text.transform.rotation}°</p>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="modal-action">
                                <form method="dialog">
                                  <Button type="submit">Fermer</Button>
                                </form>
                              </div>
                            </div>
                          </dialog>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.price * item.quantity)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-black/20">
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-right font-semibold">Total</td>
                    <td className="px-6 py-4 font-semibold">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(order.total_amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </GlassCard>
        </div>
      </main>
      
      <Footer />
      
      <style>
        {`
          .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            visibility: hidden;
            opacity: 0;
            transition: all 0.3s ease-out;
          }
          
          .modal[open] {
            visibility: visible;
            opacity: 1;
          }
          
          .modal::backdrop {
            background-color: rgba(0, 0, 0, 0.8);
          }
          
          .modal-box {
            max-width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            padding: 1.5rem;
            border-radius: 0.5rem;
          }
          
          .btn-circle {
            border-radius: 9999px;
            padding: 0;
            width: 2rem;
            height: 2rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          
          .modal-action {
            margin-top: 1.5rem;
            display: flex;
            justify-content: flex-end;
          }
        `}
      </style>
    </div>
  );
};

export default OrderDetail;
