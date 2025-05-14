
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminNavigation from '@/components/admin/AdminNavigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { fr } from 'date-fns/locale';
import { Eye, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrdersAdmin = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            products (
              id,
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      toast.error('Erreur lors de la récupération des commandes');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
      toast.success(`Statut de la commande mis à jour: ${status}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30',
      paid: 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30',
      processing: 'bg-purple-500/20 text-purple-500 hover:bg-purple-500/30',
      shipped: 'bg-green-500/20 text-green-500 hover:bg-green-500/30',
      completed: 'bg-green-600/20 text-green-600 hover:bg-green-600/30',
      cancelled: 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
    };
    
    return statusStyles[status] || 'bg-gray-500/20 text-gray-500 hover:bg-gray-500/30';
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />
      
      <div className="container px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestion des Commandes</h1>
          <Button onClick={() => fetchOrders()}>Actualiser</Button>
        </div>
        
        <Card className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="spinner"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune commande trouvée</h3>
              <p className="text-muted-foreground">Lorsque des clients passeront commande, elles apparaîtront ici.</p>
            </div>
          ) : (
            <Table>
              <TableCaption>Liste des commandes</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}...</TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell>
                      {order.shipping_first_name} {order.shipping_last_name}
                      <div className="text-xs text-gray-400">{order.shipping_email}</div>
                    </TableCell>
                    <TableCell>{order.order_items?.length || 0} produits</TableCell>
                    <TableCell>{Number(order.total_amount).toFixed(2)} €</TableCell>
                    <TableCell>
                      <select 
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="pending">En attente</option>
                        <option value="paid">Payé</option>
                        <option value="processing">En traitement</option>
                        <option value="shipped">Expédié</option>
                        <option value="completed">Terminé</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/order-details/${order.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
};

export default OrdersAdmin;
