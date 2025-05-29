
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Truck, Plus, Edit, Trash2 } from 'lucide-react';
import { getAllShippingOptions, createShippingOption, updateShippingOption, deleteShippingOption } from '@/services/shipping.service';
import { ShippingOption } from '@/types/shipping.types';
import { toast } from 'sonner';

const ShippingOptionsAdmin = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<ShippingOption | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    estimated_days_min: 1,
    estimated_days_max: 3,
    is_active: true,
    priority: 1
  });

  const queryClient = useQueryClient();

  const { data: shippingOptions, isLoading } = useQuery({
    queryKey: ['allShippingOptions'],
    queryFn: getAllShippingOptions,
  });

  const createMutation = useMutation({
    mutationFn: createShippingOption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allShippingOptions'] });
      toast.success("Option de livraison créée avec succès");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error creating shipping option:', error);
      toast.error(`Erreur lors de la création: ${error.message || 'Erreur inconnue'}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateShippingOption(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allShippingOptions'] });
      toast.success("Option mise à jour avec succès");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error updating shipping option:', error);
      toast.error(`Erreur lors de la mise à jour: ${error.message || 'Erreur inconnue'}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteShippingOption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allShippingOptions'] });
      toast.success("Option supprimée avec succès");
    },
    onError: (error: any) => {
      console.error('Error deleting shipping option:', error);
      toast.error(`Erreur lors de la suppression: ${error.message || 'Erreur inconnue'}`);
    },
  });

  const createDefaultOptions = async () => {
    const defaultOptions = [
      {
        name: 'Standard',
        description: 'Livraison standard en France métropolitaine',
        price: 4.99,
        estimated_days_min: 3,
        estimated_days_max: 5,
        is_active: true,
        priority: 1
      },
      {
        name: 'Rapide',
        description: 'Livraison rapide en 48h',
        price: 8.99,
        estimated_days_min: 1,
        estimated_days_max: 2,
        is_active: true,
        priority: 2
      },
      {
        name: 'Express',
        description: 'Livraison express en 24h',
        price: 12.99,
        estimated_days_min: 1,
        estimated_days_max: 1,
        is_active: true,
        priority: 3
      }
    ];

    try {
      for (const option of defaultOptions) {
        await createShippingOption(option);
      }
      queryClient.invalidateQueries({ queryKey: ['allShippingOptions'] });
      toast.success("Options de livraison par défaut créées");
    } catch (error: any) {
      console.error('Error creating default options:', error);
      toast.error(`Erreur lors de la création des options par défaut: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingOption) {
        await updateMutation.mutateAsync({ id: editingOption.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleEdit = (option: ShippingOption) => {
    setEditingOption(option);
    setFormData({
      name: option.name,
      description: option.description || '',
      price: option.price,
      estimated_days_min: option.estimated_days_min,
      estimated_days_max: option.estimated_days_max,
      is_active: option.is_active,
      priority: option.priority
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette option de livraison ?')) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setEditingOption(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      estimated_days_min: 1,
      estimated_days_max: 3,
      is_active: true,
      priority: 1
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        <section className="relative py-16 bg-gradient-to-b from-winshirt-blue/20 to-transparent">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <Truck className="h-8 w-8 text-winshirt-blue" />
              <h1 className="text-3xl md:text-4xl font-bold">
                Options de <span className="text-gradient">Livraison</span>
              </h1>
            </div>
            <p className="text-white/70">
              Gérez les options de livraison disponibles pour vos clients
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Options de livraison</h2>
              <div className="flex gap-2">
                {(!shippingOptions || shippingOptions.length === 0) && (
                  <Button 
                    onClick={createDefaultOptions}
                    variant="outline"
                    className="bg-blue-500/20 hover:bg-blue-500/30"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer options par défaut
                  </Button>
                )}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm} className="bg-gradient-purple hover:opacity-90">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une option
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingOption ? 'Modifier l\'option' : 'Nouvelle option de livraison'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nom *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="ex: Standard, Rapide, Express"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Description de l'option de livraison"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="price">Prix (€) *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="min_days">Jours min *</Label>
                          <Input
                            id="min_days"
                            type="number"
                            min="1"
                            value={formData.estimated_days_min}
                            onChange={(e) => setFormData({ ...formData, estimated_days_min: parseInt(e.target.value) || 1 })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="max_days">Jours max *</Label>
                          <Input
                            id="max_days"
                            type="number"
                            min="1"
                            value={formData.estimated_days_max}
                            onChange={(e) => setFormData({ ...formData, estimated_days_max: parseInt(e.target.value) || 1 })}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="priority">Priorité *</Label>
                        <Input
                          id="priority"
                          type="number"
                          min="1"
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                          required
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_active"
                          checked={formData.is_active}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                        />
                        <Label htmlFor="is_active">Option active</Label>
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button 
                          type="submit" 
                          className="flex-1"
                          disabled={createMutation.isPending || updateMutation.isPending}
                        >
                          {createMutation.isPending || updateMutation.isPending ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              {editingOption ? 'Mise à jour...' : 'Création...'}
                            </div>
                          ) : (
                            editingOption ? 'Mettre à jour' : 'Créer'
                          )}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Annuler
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-winshirt-blue mx-auto mb-4"></div>
                <p>Chargement des options de livraison...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {shippingOptions?.map((option) => (
                  <GlassCard key={option.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{option.name}</h3>
                          {!option.is_active && (
                            <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                        {option.description && (
                          <p className="text-white/70 mb-2">{option.description}</p>
                        )}
                        <div className="flex gap-4 text-sm text-white/60">
                          <span>Prix: {option.price > 0 ? `${option.price.toFixed(2)} €` : 'Gratuit'}</span>
                          <span>Délai: {option.estimated_days_min}-{option.estimated_days_max} jours</span>
                          <span>Priorité: {option.priority}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(option)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(option.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
                
                {(!shippingOptions || shippingOptions.length === 0) && (
                  <div className="text-center py-8">
                    <Truck className="h-12 w-12 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60 mb-4">Aucune option de livraison configurée</p>
                    <p className="text-white/40 text-sm">
                      Cliquez sur "Créer options par défaut" pour créer Standard, Rapide et Express
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ShippingOptionsAdmin;
