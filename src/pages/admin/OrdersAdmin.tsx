import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExtendedOrder, OrderStatus, PaymentStatus, CartItem } from '@/types/supabase.types';
import { OrderItemDetails } from '@/components/order/OrderItemDetails';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, ChevronRight, Search, Calendar, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import GlassCard from '@/components/ui/GlassCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from '@/components/ui/skeleton';

const OrdersAdmin = () => {
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ExtendedOrder | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            *,
            products:product_id(*)
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Convert each order to match the ExtendedOrder type
      const typedOrders: ExtendedOrder[] = (data || []).map(order => {
        // Ensure status is valid OrderStatus
        const validStatus: OrderStatus = 
          ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(order.status) 
            ? order.status as OrderStatus 
            : 'pending';
            
        // Ensure payment_status is valid PaymentStatus
        const validPaymentStatus: PaymentStatus = 
          ['pending', 'paid', 'failed'].includes(order.payment_status) 
            ? order.payment_status as PaymentStatus 
            : 'pending';
        
        // Process order items with proper type conversion for customization
        const processedItems = (order.items || []).map(item => {
          // Convert Json customization to the expected CartItem['customization'] type or null
          let typedCustomization: CartItem['customization'] | null = null;
          
          if (item.customization) {
            try {
              // If it's already an object, use it directly, otherwise parse it if it's a string
              const customObj = typeof item.customization === 'string' 
                ? JSON.parse(item.customization) 
                : item.customization;
              
              typedCustomization = {
                designId: customObj.designId || customObj.design_id,
                designUrl: customObj.designUrl || customObj.design_url,
                designName: customObj.designName || customObj.design_name,
                customText: customObj.customText || customObj.custom_text,
                textColor: customObj.textColor || customObj.text_color,
                textFont: customObj.textFont || customObj.text_font
              };
            } catch (e) {
              console.error('Error parsing customization:', e);
              typedCustomization = null;
            }
          }
          
          return {
            ...item,
            customization: typedCustomization
          };
        });
        
        return {
          ...order,
          status: validStatus,
          payment_status: validPaymentStatus,
          items: processedItems
        };
      });
      
      setOrders(typedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les commandes",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
        
      if (error) throw error;
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été mis à jour",
      });
      
      // Update local state
      setOrders(prevOrders => prevOrders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status } : null);
      }
      
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
    }
  };
  
  const getOrderStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'processing': return 'bg-blue-500/20 text-blue-500';
      case 'shipped': return 'bg-indigo-500/20 text-indigo-500';
      case 'delivered': return 'bg-green-500/20 text-green-500';
      case 'cancelled': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };
  
  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-500';
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'failed': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };
  
  const getOrderStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Package className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };
  
  const filteredOrders = orders.filter(order => {
    // Filter by search term
    const searchMatch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.shipping_first_name} ${order.shipping_last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const statusMatch = statusFilter === 'all' || order.status === statusFilter;
    
    // Filter by payment status
    const paymentMatch = paymentFilter === 'all' || order.payment_status === paymentFilter;
    
    return searchMatch && statusMatch && paymentMatch;
  });
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        <section className="relative py-16 bg-gradient-to-b from-rose-500/20 to-transparent">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Gestion des <span className="text-gradient">Commandes</span>
                </h1>
                <p className="text-white/70 mt-2">
                  Gérez et suivez toutes les commandes de votre boutique
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="relative w-full md:w-auto md:min-w-[320px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  className="pl-10"
                  placeholder="Rechercher par ID, email ou nom..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Statut de commande" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="processing">En traitement</SelectItem>
                    <SelectItem value="shipped">Expédiée</SelectItem>
                    <SelectItem value="delivered">Livrée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={paymentFilter}
                  onValueChange={setPaymentFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Statut de paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les paiements</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="paid">Payé</SelectItem>
                    <SelectItem value="failed">Échoué</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  onClick={fetchOrders}
                  className="gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Actualiser
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div className="flex flex-col gap-2" key={index}>
                    <Skeleton className="h-24 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune commande trouvée</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' ? 
                    "Aucune commande ne correspond à vos critères de recherche" : 
                    "Aucune commande n'a encore été passée"}
                </p>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <GlassCard 
                    key={order.id} 
                    className="p-5 cursor-pointer hover:bg-gray-800/30 transition-colors"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsDetailOpen(true);
                    }}
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-sm text-gray-400">#{order.id.substring(0, 8)}</span>
                          <Badge variant="outline" className={`${getOrderStatusColor(order.status as OrderStatus)} flex items-center gap-1`}>
                            {getOrderStatusIcon(order.status as OrderStatus)}
                            <span className="capitalize">{order.status}</span>
                          </Badge>
                          <Badge variant="outline" className={getPaymentStatusColor(order.payment_status as PaymentStatus)}>
                            {order.payment_status === 'paid' ? 'Payé' : 
                             order.payment_status === 'pending' ? 'En attente' : 'Échoué'}
                          </Badge>
                        </div>
                        <p className="font-medium">
                          {order.shipping_first_name} {order.shipping_last_name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {order.shipping_email}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-400">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{order.total_amount.toFixed(2)} €</span>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* Dialog détaillé avec les nouveaux composants */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>Commande #{selectedOrder.id.substring(0, 8)}</span>
                  <Badge variant="outline" className={getOrderStatusColor(selectedOrder.status as OrderStatus)}>
                    <span className="capitalize">{selectedOrder.status}</span>
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Passée le {new Date(selectedOrder.created_at).toLocaleDateString()} à {new Date(selectedOrder.created_at).toLocaleTimeString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Informations client</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-400">Nom:</span> {selectedOrder.shipping_first_name} {selectedOrder.shipping_last_name}</p>
                    <p><span className="text-gray-400">Email:</span> {selectedOrder.shipping_email}</p>
                    <p><span className="text-gray-400">Téléphone:</span> {selectedOrder.shipping_phone}</p>
                    <p><span className="text-gray-400">Adresse:</span> {selectedOrder.shipping_address}</p>
                    <p><span className="text-gray-400">Ville:</span> {selectedOrder.shipping_postal_code} {selectedOrder.shipping_city}</p>
                    <p><span className="text-gray-400">Pays:</span> {selectedOrder.shipping_country}</p>
                    {selectedOrder.delivery_notes && (
                      <p><span className="text-gray-400">Notes de livraison:</span> {selectedOrder.delivery_notes}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Détails paiement</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-400">Statut paiement:</span> 
                      <Badge variant="outline" className={`ml-2 ${getPaymentStatusColor(selectedOrder.payment_status as PaymentStatus)}`}>
                        {selectedOrder.payment_status === 'paid' ? 'Payé' : 
                         selectedOrder.payment_status === 'pending' ? 'En attente' : 'Échoué'}
                      </Badge>
                    </p>
                    {selectedOrder.payment_intent_id && (
                      <p><span className="text-gray-400">ID Transaction:</span> {selectedOrder.payment_intent_id}</p>
                    )}
                    <p><span className="text-gray-400">Total:</span> {selectedOrder.total_amount.toFixed(2)} €</p>
                  </div>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-2">Mettre à jour le statut</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedOrder.status === 'pending' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'pending')}
                      disabled={selectedOrder.status === 'pending'}
                    >
                      En attente
                    </Button>
                    <Button
                      variant={selectedOrder.status === 'processing' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                      disabled={selectedOrder.status === 'processing'}
                    >
                      En traitement
                    </Button>
                    <Button
                      variant={selectedOrder.status === 'shipped' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                      disabled={selectedOrder.status === 'shipped'}
                    >
                      Expédiée
                    </Button>
                    <Button
                      variant={selectedOrder.status === 'delivered' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                      disabled={selectedOrder.status === 'delivered'}
                    >
                      Livrée
                    </Button>
                    <Button
                      variant={selectedOrder.status === 'cancelled' ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                      disabled={selectedOrder.status === 'cancelled'}
                    >
                      Annulée
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Articles avec détails complets */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Articles commandés</h3>
                {selectedOrder.items && selectedOrder.items.map((item: any) => (
                  <OrderItemDetails key={item.id} item={item} />
                ))}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Fermer
                </Button>
                <Button 
                  onClick={() => window.open(`/order-confirmation/${selectedOrder.id}`, '_blank')}
                >
                  Voir page de confirmation
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersAdmin;
