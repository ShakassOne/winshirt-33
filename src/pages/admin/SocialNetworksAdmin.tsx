
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Share2, Plus, Edit, Trash2, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialNetwork {
  id: string;
  name: string;
  icon: string;
  url: string;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

const SocialNetworksAdmin = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNetwork, setEditingNetwork] = useState<SocialNetwork | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    url: '',
    is_active: true,
    priority: 1
  });

  const { toast } = useToast();

  const { data: socialNetworks, isLoading, refetch } = useQuery({
    queryKey: ['socialNetworks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_networks')
        .select('*')
        .order('priority', { ascending: true });
      
      if (error) throw error;
      return data as SocialNetwork[];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingNetwork) {
        const { error } = await supabase
          .from('social_networks')
          .update(formData)
          .eq('id', editingNetwork.id);
        
        if (error) throw error;
        
        toast({
          title: "Réseau social mis à jour",
          description: "Le réseau social a été mis à jour avec succès.",
        });
      } else {
        const { error } = await supabase
          .from('social_networks')
          .insert([formData]);
        
        if (error) throw error;
        
        toast({
          title: "Réseau social créé",
          description: "Le réseau social a été créé avec succès.",
        });
      }
      
      refetch();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (network: SocialNetwork) => {
    setEditingNetwork(network);
    setFormData({
      name: network.name,
      icon: network.icon,
      url: network.url,
      is_active: network.is_active,
      priority: network.priority
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce réseau social ?')) return;
    
    try {
      const { error } = await supabase
        .from('social_networks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Réseau social supprimé",
        description: "Le réseau social a été supprimé avec succès.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingNetwork(null);
    setFormData({
      name: '',
      icon: '',
      url: '',
      is_active: true,
      priority: 1
    });
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      default:
        return <Share2 className="h-5 w-5" />;
    }
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
              Gérez les liens de partage sur les réseaux sociaux
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
                      <Label htmlFor="icon">Icône (facebook, twitter, instagram, linkedin)</Label>
                      <Input
                        id="icon"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
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
                        required
                      />
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
                      <Label htmlFor="is_active">Actif</Label>
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
                      <div className="flex items-center gap-4">
                        <div className="bg-black/30 p-3 rounded-xl">
                          {getIconComponent(network.icon)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{network.name}</h3>
                            {!network.is_active && (
                              <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">
                                Inactif
                              </span>
                            )}
                          </div>
                          <p className="text-white/70 mb-1">{network.url}</p>
                          <span className="text-sm text-white/60">Priorité: {network.priority}</span>
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
