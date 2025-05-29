
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Share2, Plus, Edit, Trash2, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { fetchAllSocialNetworks, createSocialNetwork, updateSocialNetwork, deleteSocialNetwork } from '@/services/api.service';
import { SocialNetwork } from '@/types/supabase.types';
import { useToast } from '@/hooks/use-toast';

const availableIcons = [
  { id: "facebook", label: "Facebook", icon: <Facebook className="h-4 w-4" /> },
  { id: "twitter", label: "Twitter", icon: <Twitter className="h-4 w-4" /> },
  { id: "linkedin", label: "LinkedIn", icon: <Linkedin className="h-4 w-4" /> },
  { id: "instagram", label: "Instagram", icon: <Instagram className="h-4 w-4" /> },
];

const SocialNetworksAdmin = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNetwork, setEditingNetwork] = useState<SocialNetwork | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: 'facebook',
    is_active: true,
    priority: 1
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: socialNetworks, isLoading } = useQuery({
    queryKey: ['allSocialNetworks'],
    queryFn: fetchAllSocialNetworks,
  });

  const createMutation = useMutation({
    mutationFn: createSocialNetwork,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allSocialNetworks'] });
      toast({
        title: "Réseau social créé",
        description: "Le réseau social a été créé avec succès.",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateSocialNetwork(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allSocialNetworks'] });
      toast({
        title: "Réseau social mis à jour",
        description: "Le réseau social a été mis à jour avec succès.",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSocialNetwork,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allSocialNetworks'] });
      toast({
        title: "Réseau social supprimé",
        description: "Le réseau social a été supprimé avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingNetwork) {
      updateMutation.mutate({ id: editingNetwork.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (network: SocialNetwork) => {
    setEditingNetwork(network);
    setFormData({
      name: network.name,
      url: network.url || '',
      icon: network.icon,
      is_active: network.is_active,
      priority: network.priority
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce réseau social ?')) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setEditingNetwork(null);
    setFormData({
      name: '',
      url: '',
      icon: 'facebook',
      is_active: true,
      priority: 1
    });
  };

  const renderIcon = (iconName: string) => {
    const icon = availableIcons.find((i) => i.id === iconName);
    return icon ? icon.icon : null;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        <section className="relative py-16 bg-gradient-to-b from-winshirt-blue/20 to-transparent">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <Share2 className="h-8 w-8 text-winshirt-blue" />
              <h1 className="text-3xl md:text-4xl font-bold">
                Réseaux <span className="text-gradient">Sociaux</span>
              </h1>
            </div>
            <p className="text-white/70">
              Gérez vos liens de réseaux sociaux
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Réseaux sociaux</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm} className="bg-gradient-purple hover:opacity-90">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un réseau
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingNetwork ? 'Modifier le réseau' : 'Nouveau réseau social'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nom</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="url">URL</Label>
                      <Input
                        id="url"
                        type="url"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://facebook.com/votrepage"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="icon">Icône</Label>
                      <select
                        id="icon"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full p-2 border rounded-md bg-background"
                      >
                        {availableIcons.map((icon) => (
                          <option key={icon.id} value={icon.id}>
                            {icon.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="priority">Priorité</Label>
                      <Input
                        id="priority"
                        type="number"
                        min="1"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      />
                      <Label htmlFor="is_active">Réseau actif</Label>
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1">
                        {editingNetwork ? 'Mettre à jour' : 'Créer'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Annuler
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <p>Chargement des réseaux sociaux...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {socialNetworks?.map((network) => (
                  <GlassCard key={network.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          {renderIcon(network.icon)}
                          <h3 className="text-lg font-semibold">{network.name}</h3>
                          {!network.is_active && (
                            <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">
                              Inactif
                            </span>
                          )}
                        </div>
                        {network.url && (
                          <p className="text-white/70 mb-2 truncate">{network.url}</p>
                        )}
                        <div className="flex gap-4 text-sm text-white/60">
                          <span>Priorité: {network.priority}</span>
                          <span>Icône: {network.icon}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(network)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(network.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
                
                {(!socialNetworks || socialNetworks.length === 0) && (
                  <div className="text-center py-8">
                    <p className="text-white/60">Aucun réseau social configuré</p>
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

export default SocialNetworksAdmin;
