import React, { useState, useEffect } from 'react';
import { getDTFOrders, updateDTFProductionStatus, DTFOrderWithDetails, DTFProductionStatus } from '@/services/dtf.service';
import { OrderItemDetails } from '@/components/order/OrderItemDetails';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, ChevronRight, Search, Calendar, Package, Wrench, AlertCircle, CheckCircle, RefreshCw, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
import { useRetroactiveCapture } from '@/hooks/useRetroactiveCapture';
import { Progress } from '@/components/ui/progress';

const DTFProductionAdmin = () => {
  const [orders, setOrders] = useState<DTFOrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<DTFOrderWithDetails | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  
  const { 
    regenerateSingleOrder, 
    regenerateMultipleOrders, 
    isRegenerating, 
    regenerationProgress 
  } = useRetroactiveCapture();
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getDTFOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching DTF orders:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les commandes DTF",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updateStatus = async (orderId: string, status: DTFProductionStatus) => {
    setUpdatingStatus(orderId);
    try {
      await updateDTFProductionStatus(orderId, status, notes);
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut de production a été mis à jour",
      });
      
      // Update local state
      setOrders(prevOrders => prevOrders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              production_status: status,
              notes: notes || order.notes,
              updated_at: new Date().toISOString()
            } 
          : order
      ));
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { 
          ...prev, 
          production_status: status,
          notes: notes || prev.notes,
          updated_at: new Date().toISOString()
        } : null);
      }
      
      setNotes('');
    } catch (error) {
      console.error('Error updating DTF status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleRegenerateSingle = async (orderId: string) => {
    try {
      const result = await regenerateSingleOrder(orderId);
      
      if (result.success) {
        toast({
          title: "Fichiers HD régénérés",
          description: `Commande ${orderId.substring(0, 8)} : ${result.frontUrl ? 'Recto ' : ''}${result.backUrl ? 'Verso' : ''} mis à jour`,
        });
        
        // Rafraîchir les données
        await fetchOrders();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur de régénération",
          description: result.error || "Impossible de régénérer les fichiers HD",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la régénération",
      });
    }
  };

  const handleRegenerateBatch = async () => {
    if (selectedOrders.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner au moins une commande",
      });
      return;
    }

    try {
      const results = await regenerateMultipleOrders(selectedOrders);
      const successCount = results.filter(r => r.success).length;
      const failCount = results.length - successCount;
      
      toast({
        title: "Régénération batch terminée",
        description: `${successCount} succès, ${failCount} échecs sur ${results.length} commandes`,
      });
      
      setSelectedOrders([]);
      setIsBatchDialogOpen(false);
      await fetchOrders();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la régénération batch",
      });
    }
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };
  
  const getStatusColor = (status: DTFProductionStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'in_progress': return 'bg-blue-500/20 text-blue-500';
      case 'ready': return 'bg-green-500/20 text-green-500';
      case 'completed': return 'bg-gray-500/20 text-gray-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };
  
  const getStatusIcon = (status: DTFProductionStatus) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'in_progress': return <Wrench className="h-4 w-4" />;
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <Package className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };
  
  const getStatusText = (status: DTFProductionStatus) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En production';
      case 'ready': return 'Prêt';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };
  
  const filteredOrders = orders.filter(order => {
    // Filter by search term
    const searchMatch = 
      order.order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order.shipping_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.order.shipping_first_name} ${order.order.shipping_last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const statusMatch = statusFilter === 'all' || order.production_status === statusFilter;
    
    return searchMatch && statusMatch;
  });
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        <section className="relative py-16 bg-gradient-to-b from-orange-500/20 to-transparent">
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
                  Gestion de la production pour le fournisseur DTF
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
                  placeholder="Rechercher par ID ou client..." 
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
                    <SelectValue placeholder="Statut de production" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="in_progress">En production</SelectItem>
                    <SelectItem value="ready">Prêt</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                  </SelectContent>
                </Select>
                
                {selectedOrders.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsBatchDialogOpen(true)}
                    disabled={isRegenerating}
                    className="gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    Régénérer ({selectedOrders.length})
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={fetchOrders}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Actualiser
                </Button>
              </div>
            </div>

            {/* Progress bar pour la régénération */}
            {isRegenerating && regenerationProgress.total > 0 && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Régénération en cours...</span>
                  <span>{regenerationProgress.current}/{regenerationProgress.total}</span>
                </div>
                <Progress 
                  value={(regenerationProgress.current / regenerationProgress.total) * 100} 
                  className="mb-2"
                />
                {regenerationProgress.currentOrderId && (
                  <p className="text-xs text-gray-500">
                    Traitement: {regenerationProgress.currentOrderId.substring(0, 8)}
                  </p>
                )}
              </div>
            )}
            
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
                <h3 className="text-lg font-semibold mb-2">Aucune commande DTF trouvée</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || statusFilter !== 'all' ? 
                    "Aucune commande ne correspond à vos critères de recherche" : 
                    "Aucune commande DTF en attente de production"}
                </p>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <GlassCard 
                    key={order.id} 
                    className="p-5 hover:bg-gray-800/30 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex items-start gap-3 flex-grow">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          className="mt-1"
                        />
                        
                        <div 
                          className="flex-grow cursor-pointer"
                          onClick={() => {
                            setSelectedOrder(order);
                            setNotes(order.notes || '');
                            setIsDetailOpen(true);
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-sm text-gray-400">#{order.order.id.substring(0, 8)}</span>
                            <Badge variant="outline" className={`${getStatusColor(order.production_status)} flex items-center gap-1`}>
                              {getStatusIcon(order.production_status)}
                              <span>{getStatusText(order.production_status)}</span>
                            </Badge>
                          </div>
                          <p className="font-medium">
                            {order.order.shipping_first_name} {order.order.shipping_last_name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {order.order.shipping_email}
                          </p>
                          <p className="text-sm text-gray-400">
                            {order.order.items?.length || 0} article(s) à produire
                          </p>
                          {order.notes && (
                            <p className="text-sm text-orange-400 mt-1">
                              Note: {order.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-400">
                            {new Date(order.order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRegenerateSingle(order.id);
                            }}
                            disabled={isRegenerating}
                            className="gap-1"
                          >
                            <RefreshCw className="h-3 w-3" />
                            HD
                          </Button>
                          
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{order.order.total_amount.toFixed(2)} €</span>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
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
      
      {/* Dialog détaillé */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>Commande #{selectedOrder.order.id.substring(0, 8)}</span>
                  <Badge variant="outline" className={getStatusColor(selectedOrder.production_status)}>
                    <span>{getStatusText(selectedOrder.production_status)}</span>
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Passée le {new Date(selectedOrder.order.created_at).toLocaleDateString()} à {new Date(selectedOrder.order.created_at).toLocaleTimeString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Informations client</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-400">Nom:</span> {selectedOrder.order.shipping_first_name} {selectedOrder.order.shipping_last_name}</p>
                    <p><span className="text-gray-400">Email:</span> {selectedOrder.order.shipping_email}</p>
                    <p><span className="text-gray-400">Total:</span> {selectedOrder.order.total_amount.toFixed(2)} €</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Gestion de production</h3>
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      onClick={() => handleRegenerateSingle(selectedOrder.id)}
                      disabled={isRegenerating}
                      className="w-full gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Régénérer fichiers HD
                    </Button>
                    
                    <div>
                      <label className="text-sm text-gray-400">Notes de production:</label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ajouter une note de production..."
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={selectedOrder.production_status === 'pending' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateStatus(selectedOrder.id, 'pending')}
                        disabled={updatingStatus === selectedOrder.id}
                      >
                        En attente
                      </Button>
                      <Button
                        variant={selectedOrder.production_status === 'in_progress' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateStatus(selectedOrder.id, 'in_progress')}
                        disabled={updatingStatus === selectedOrder.id}
                      >
                        En production
                      </Button>
                      <Button
                        variant={selectedOrder.production_status === 'ready' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateStatus(selectedOrder.id, 'ready')}
                        disabled={updatingStatus === selectedOrder.id}
                      >
                        Prêt
                      </Button>
                      <Button
                        variant={selectedOrder.production_status === 'completed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateStatus(selectedOrder.id, 'completed')}
                        disabled={updatingStatus === selectedOrder.id}
                      >
                        Terminé
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Articles avec détails complets */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Articles à produire</h3>
                {selectedOrder.order.items && selectedOrder.order.items.map((item: any) => (
                  <OrderItemDetails key={item.id} item={item} />
                ))}
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

      {/* Dialog régénération batch */}
      <Dialog open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Régénération batch des fichiers HD</DialogTitle>
            <DialogDescription>
              Vous allez régénérer les fichiers HD pour {selectedOrders.length} commande(s) sélectionnée(s).
              Cette opération peut prendre plusieurs minutes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-400">
              Commandes sélectionnées: {selectedOrders.map(id => id.substring(0, 8)).join(', ')}
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBatchDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleRegenerateBatch} disabled={isRegenerating}>
              {isRegenerating ? 'Régénération...' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DTFProductionAdmin;
