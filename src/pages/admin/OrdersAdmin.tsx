
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { ChevronDown, Eye } from 'lucide-react';
import { updateOrderStatus } from '@/services/order.service';
import { supabase } from '@/integrations/supabase/client';

type Order = {
  id: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_email: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status?: 'pending' | 'paid' | 'failed';
  created_at?: string;
};

const OrdersAdmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const navigate = useNavigate();

  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Order[];
    }
  });

  if (error) {
    toast({
      title: "Erreur",
      description: "Impossible de charger les commandes",
      variant: "destructive",
    });
  }

  const filterOrdersByStatus = (orders: Order[] | undefined, status: string) => {
    if (!orders) return [];
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  const filterOrdersBySearch = (orders: Order[] | undefined) => {
    if (!orders) return [];
    if (!searchTerm) return orders;
    
    return orders.filter(order => 
      order.shipping_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.shipping_first_name} ${order.shipping_last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredOrders = filterOrdersBySearch(filterOrdersByStatus(orders, currentTab));

  const handleOrderStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(
        orderId,
        status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
      );
      
      toast({
        title: "Statut modifié",
        description: `Commande ${orderId} mise à jour avec le statut: ${status}`,
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande",
        variant: "destructive",
      });
    }
  };

  const viewOrderDetails = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'processing': return 'bg-blue-500/20 text-blue-500';
      case 'shipped': return 'bg-indigo-500/20 text-indigo-500';
      case 'delivered': return 'bg-green-500/20 text-green-500';
      case 'cancelled': return 'bg-red-500/20 text-red-500';
      case 'paid': return 'bg-green-500/20 text-green-500';
      case 'failed': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-20">
        {/* Header */}
        <section className="relative py-16 bg-gradient-to-b from-rose-500/20 to-transparent">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              Gestion des <span className="text-gradient">Commandes</span>
            </h1>
            <p className="text-white/70 mt-2 max-w-2xl">
              Gérez et suivez toutes les commandes de votre boutique en ligne.
            </p>
          </div>
        </section>
        
        {/* Orders Table */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle>Liste des commandes</CardTitle>
                  <div className="flex flex-wrap gap-4">
                    <Input 
                      placeholder="Rechercher une commande..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full md:w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" onValueChange={setCurrentTab} className="mb-6">
                  <TabsList className="bg-black/50">
                    <TabsTrigger value="all">Toutes</TabsTrigger>
                    <TabsTrigger value="pending">En attente</TabsTrigger>
                    <TabsTrigger value="processing">En traitement</TabsTrigger>
                    <TabsTrigger value="shipped">Expédiées</TabsTrigger>
                    <TabsTrigger value="delivered">Livrées</TabsTrigger>
                    <TabsTrigger value="cancelled">Annulées</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="rounded-md border border-white/10 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-white/5">
                        <TableHead>N° de commande</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Paiement</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array(5).fill(0).map((_, index) => (
                          <TableRow key={index} className="hover:bg-white/5">
                            <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                          </TableRow>
                        ))
                      ) : filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                          <TableRow key={order.id} className="hover:bg-white/5">
                            <TableCell>
                              <div className="font-medium">#{order.id.substring(0, 8)}</div>
                            </TableCell>
                            <TableCell>
                              <div>{order.shipping_first_name} {order.shipping_last_name}</div>
                              <div className="text-xs text-white/60">{order.shipping_email}</div>
                            </TableCell>
                            <TableCell>
                              {order.created_at && new Date(order.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{order.total_amount.toFixed(2)} €</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                                {{
                                  'pending': 'En attente',
                                  'processing': 'En traitement',
                                  'shipped': 'Expédiée',
                                  'delivered': 'Livrée',
                                  'cancelled': 'Annulée'
                                }[order.status] || order.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              {order.payment_status && (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.payment_status)}`}>
                                  {{
                                    'pending': 'En attente',
                                    'paid': 'Payée',
                                    'failed': 'Échouée'
                                  }[order.payment_status] || order.payment_status}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => viewOrderDetails(order.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="h-4 w-4" /> Détails
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="flex items-center gap-1"
                                    >
                                      Actions <ChevronDown className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-black/90 border-white/10">
                                    <DropdownMenuItem onClick={() => viewOrderDetails(order.id)}>
                                      Voir les détails
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleOrderStatusUpdate(order.id, 'processing')}>
                                      Marquer en traitement
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleOrderStatusUpdate(order.id, 'shipped')}>
                                      Marquer comme expédiée
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleOrderStatusUpdate(order.id, 'delivered')}>
                                      Marquer comme livrée
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleOrderStatusUpdate(order.id, 'cancelled')}>
                                      Annuler la commande
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-white/60">
                            Aucune commande trouvée
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrdersAdmin;
