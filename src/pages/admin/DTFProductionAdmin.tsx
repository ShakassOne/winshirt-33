
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDTFOrders, updateDTFStatus } from '@/services/dtf.service';
import { DTFOrderWithDetails, DTFProductionStatus } from '@/types/dtf.types';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, Package, Clock, Play, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import GlassCard from '@/components/ui/GlassCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

const DTFProductionAdmin = () => {
  const [selectedOrder, setSelectedOrder] = useState<DTFOrderWithDetails | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['dtf-orders'],
    queryFn: getDTFOrders
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: DTFProductionStatus; notes?: string }) => 
      updateDTFStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dtf-orders'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de production a été mis à jour avec succès",
      });
      setIsDetailOpen(false);
    },
    onError: (error) => {
      console.error('Error updating DTF status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
    }
  });

  const getStatusColor = (status: DTFProductionStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'in_progress': return 'bg-blue-500/20 text-blue-500';
      case 'ready': return 'bg-purple-500/20 text-purple-500';
      case 'completed': return 'bg-green-500/20 text-green-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getStatusIcon = (status: DTFProductionStatus) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <Play className="h-4 w-4" />;
      case 'ready': return <Package className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: DTFProductionStatus) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'ready': return 'Prêt';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  const handleUpdateStatus = (status: DTFProductionStatus) => {
    if (!selectedOrder) return;
    
    updateStatusMutation.mutate({
      id: selectedOrder.id,
      status,
      notes: notes.trim() || undefined
    });
  };

  useEffect(() => {
    if (selectedOrder) {
      setNotes(selectedOrder.notes || '');
    }
  }, [selectedOrder]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        <section className="relative py-16 bg-gradient-to-b from-purple-500/20 to-transparent">
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
                  Production <span className="text-gradient">DTF</span>
                </h1>
                <p className="text-white/70 mt-2">
                  Gestion des commandes en production DTF
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-8">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="h-24 w-full" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune commande DTF</h3>
                <p className="text-gray-400">
                  Aucune commande n'est actuellement en production DTF
                </p>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
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
                          <span className="font-mono text-sm text-gray-400">
                            #{order.order_id.substring(0, 8)}
                          </span>
                          <Badge variant="outline" className={`${getStatusColor(order.production_status)} flex items-center gap-1`}>
                            {getStatusIcon(order.production_status)}
                            <span>{getStatusLabel(order.production_status)}</span>
                          </Badge>
                        </div>
                        <p className="font-medium">
                          {order.order.shipping_first_name} {order.order.shipping_last_name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {order.order.items.length} article(s) • {order.order.total_amount.toFixed(2)} €
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end justify-between">
                        <span className="text-sm text-gray-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                        {order.notes && (
                          <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
                            Note présente
                          </span>
                        )}
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
      
      {/* Dialog de détail */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>Commande #{selectedOrder.order_id.substring(0, 8)}</span>
                  <Badge variant="outline" className={getStatusColor(selectedOrder.production_status)}>
                    {getStatusLabel(selectedOrder.production_status)}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Informations client */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Informations client</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <p><span className="text-gray-400">Client:</span> {selectedOrder.order.shipping_first_name} {selectedOrder.order.shipping_last_name}</p>
                    <p><span className="text-gray-400">Email:</span> {selectedOrder.order.shipping_email}</p>
                    <p><span className="text-gray-400">Total:</span> {selectedOrder.order.total_amount.toFixed(2)} €</p>
                    <p><span className="text-gray-400">Statut paiement:</span> {selectedOrder.order.payment_status}</p>
                  </div>
                </div>

                {/* Articles */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Articles à produire</h3>
                  <div className="space-y-3">
                    {selectedOrder.order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-800/30 rounded-lg">
                        <img 
                          src={item.products.image_url} 
                          alt={item.products.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-grow">
                          <p className="font-medium">{item.products.name}</p>
                          <p className="text-sm text-gray-400">Quantité: {item.quantity}</p>
                          {item.selected_size && (
                            <p className="text-sm text-gray-400">Taille: {item.selected_size}</p>
                          )}
                          {item.selected_color && (
                            <p className="text-sm text-gray-400">Couleur: {item.selected_color}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {item.mockup_recto_url && (
                            <img 
                              src={item.mockup_recto_url} 
                              alt="Aperçu recto"
                              className="w-12 h-12 object-cover rounded border"
                            />
                          )}
                          {item.mockup_verso_url && (
                            <img 
                              src={item.mockup_verso_url} 
                              alt="Aperçu verso"
                              className="w-12 h-12 object-cover rounded border"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Notes de production</h3>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ajouter des notes sur la production..."
                    rows={3}
                  />
                </div>

                {/* Actions de statut */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Mettre à jour le statut</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedOrder.production_status === 'pending' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus('pending')}
                      disabled={updateStatusMutation.isPending}
                    >
                      En attente
                    </Button>
                    <Button
                      variant={selectedOrder.production_status === 'in_progress' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus('in_progress')}
                      disabled={updateStatusMutation.isPending}
                    >
                      En cours
                    </Button>
                    <Button
                      variant={selectedOrder.production_status === 'ready' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus('ready')}
                      disabled={updateStatusMutation.isPending}
                    >
                      Prêt
                    </Button>
                    <Button
                      variant={selectedOrder.production_status === 'completed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus('completed')}
                      disabled={updateStatusMutation.isPending}
                    >
                      Terminé
                    </Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Fermer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DTFProductionAdmin;
