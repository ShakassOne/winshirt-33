
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchAllOrders } from '@/services/order.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GlassCard from '@/components/ui/GlassCard';
import { Search, Eye, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const OrdersAdmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: fetchAllOrders,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-purple-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return '';
    }
  };

  const getPaymentStatusColor = (status: string | undefined) => {
    if (!status) return '';
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      order.shipping_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        {/* Header Section */}
        <section className="relative py-16 bg-gradient-to-b from-winshirt-purple/20 to-transparent">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Gestion des <span className="text-gradient">Commandes</span>
                </h1>
                <p className="text-white/70 mt-2">
                  Suivez et gérez les commandes de vos clients
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <GlassCard className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                  <Input
                    placeholder="Rechercher une commande..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={statusFilter === null ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setStatusFilter(null)}
                  >
                    Toutes
                  </Button>
                  <Button 
                    variant={statusFilter === 'pending' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setStatusFilter('pending')}
                  >
                    En attente
                  </Button>
                  <Button 
                    variant={statusFilter === 'processing' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setStatusFilter('processing')}
                  >
                    En traitement
                  </Button>
                  <Button 
                    variant={statusFilter === 'shipped' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setStatusFilter('shipped')}
                  >
                    Expédiée
                  </Button>
                  <Button 
                    variant={statusFilter === 'delivered' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setStatusFilter('delivered')}
                  >
                    Livrée
                  </Button>
                  <Button 
                    variant={statusFilter === 'cancelled' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setStatusFilter('cancelled')}
                  >
                    Annulée
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Orders Table */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <GlassCard className="p-0 overflow-hidden">
              {isLoading ? (
                <div className="p-10 text-center">Chargement des commandes...</div>
              ) : error ? (
                <div className="p-10 text-center">Erreur lors du chargement des commandes</div>
              ) : filteredOrders?.length === 0 ? (
                <div className="p-10 text-center">Aucune commande ne correspond à votre recherche</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black/20">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Paiement</th>
                        <th className="px-6 py-3 text-xs font-medium text-white/70 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredOrders?.map(order => (
                        <tr key={order.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-mono text-sm">{order.id.substring(0, 8)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDate(order.created_at || '')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{order.shipping_first_name} {order.shipping_last_name}</div>
                            <div className="text-sm text-white/70">{order.shipping_email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(order.total_amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline" className={`${getStatusColor(order.status)}`}>
                              {order.status === 'pending' && 'En attente'}
                              {order.status === 'processing' && 'En traitement'}
                              {order.status === 'shipped' && 'Expédiée'}
                              {order.status === 'delivered' && 'Livrée'}
                              {order.status === 'cancelled' && 'Annulée'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline" className={`${getPaymentStatusColor(order.payment_status)}`}>
                              {order.payment_status === 'paid' && 'Payé'}
                              {order.payment_status === 'pending' && 'En attente'}
                              {order.payment_status === 'failed' && 'Échoué'}
                              {!order.payment_status && 'Non défini'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/admin/orders/${order.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrdersAdmin;
