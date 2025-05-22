
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface SocialNetwork {
  id: string;
  name: string;
  url?: string;
  icon: string;
  is_active: boolean;
  priority: number;
}

const socialIcons = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'mail', label: 'Email' },
  { value: 'user', label: 'User' },
  { value: 'share', label: 'Share' },
];

const SocialNetworksAdmin = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<SocialNetwork | null>(null);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('facebook');
  const [isActive, setIsActive] = useState(true);
  const [priority, setPriority] = useState(0);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: socialNetworks, isLoading, error } = useQuery({
    queryKey: ['socialNetworks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_networks')
        .select('*')
        .order('priority');
      
      if (error) throw error;
      return data || [];
    }
  });

  const createNetworkMutation = useMutation({
    mutationFn: async (networkData: Omit<SocialNetwork, 'id'>) => {
      const { data, error } = await supabase
        .from('social_networks')
        .insert(networkData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialNetworks'] });
      closeDialog();
      toast({
        title: "Succès",
        description: "Le réseau social a été ajouté avec succès",
        variant: "default"
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Une erreur s'est produite: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const updateNetworkMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SocialNetwork> }) => {
      const { data: updatedNetwork, error } = await supabase
        .from('social_networks')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedNetwork;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialNetworks'] });
      closeDialog();
      toast({
        title: "Succès",
        description: "Le réseau social a été mis à jour avec succès",
        variant: "default"
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Une erreur s'est produite: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const deleteNetworkMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('social_networks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialNetworks'] });
      toast({
        title: "Succès",
        description: "Le réseau social a été supprimé avec succès",
        variant: "default"
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Une erreur s'est produite: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const changePriorityMutation = useMutation({
    mutationFn: async ({ id, newPriority }: { id: string; newPriority: number }) => {
      const { data, error } = await supabase
        .from('social_networks')
        .update({ priority: newPriority })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialNetworks'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Une erreur s'est produite: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (selectedNetwork) {
      setName(selectedNetwork.name);
      setUrl(selectedNetwork.url || '');
      setIcon(selectedNetwork.icon);
      setIsActive(selectedNetwork.is_active);
      setPriority(selectedNetwork.priority);
    }
  }, [selectedNetwork]);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setSelectedNetwork(null);
    setName('');
    setUrl('');
    setIcon('facebook');
    setIsActive(true);
    setPriority(0);
  };

  const handleCreate = () => {
    setIsEditing(false);
    setSelectedNetwork(null);
    // Set new priority to max + 1
    setPriority(socialNetworks ? Math.max(...socialNetworks.map(n => n.priority), 0) + 1 : 1);
    openDialog();
  };

  const handleEdit = (network: SocialNetwork) => {
    setIsEditing(true);
    setSelectedNetwork(network);
    openDialog();
  };

  const handleDelete = async (id: string) => {
    await deleteNetworkMutation.mutateAsync(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const networkData = {
      name,
      url,
      icon,
      is_active: isActive,
      priority,
    };

    if (isEditing && selectedNetwork) {
      await updateNetworkMutation.mutateAsync({ id: selectedNetwork.id, data: networkData });
    } else {
      await createNetworkMutation.mutateAsync(networkData);
    }
  };

  const handleMoveUp = (network: SocialNetwork, index: number) => {
    if (index === 0 || !socialNetworks) return;
    
    const prevNetwork = socialNetworks[index - 1];
    const prevPriority = prevNetwork.priority;
    
    changePriorityMutation.mutate({ id: network.id, newPriority: prevPriority });
    changePriorityMutation.mutate({ id: prevNetwork.id, newPriority: network.priority });
  };

  const handleMoveDown = (network: SocialNetwork, index: number) => {
    if (!socialNetworks || index === socialNetworks.length - 1) return;
    
    const nextNetwork = socialNetworks[index + 1];
    const nextPriority = nextNetwork.priority;
    
    changePriorityMutation.mutate({ id: network.id, newPriority: nextPriority });
    changePriorityMutation.mutate({ id: nextNetwork.id, newPriority: network.priority });
  };

  const getSocialIcon = (iconName: string) => {
    const foundIcon = socialIcons.find(icon => icon.value === iconName);
    return foundIcon ? foundIcon.label : 'Custom Icon';
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Gestion des Réseaux Sociaux</h1>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Réseau
          </Button>
        </div>

        {isLoading ? (
          <div>Chargement des réseaux sociaux...</div>
        ) : error ? (
          <div>Une erreur est survenue lors du chargement des réseaux sociaux.</div>
        ) : socialNetworks?.length === 0 ? (
          <div className="text-center p-8">
            <p className="mb-4">Aucun réseau social configuré.</p>
            <Button onClick={handleCreate}>Ajouter un réseau social</Button>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-left">Ordre</th>
                    <th className="p-4 text-left">Nom</th>
                    <th className="p-4 text-left">Icône</th>
                    <th className="p-4 text-left">URL</th>
                    <th className="p-4 text-left">Actif</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {socialNetworks?.map((network, index) => (
                    <tr key={network.id} className="border-b border-white/5">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={index === 0}
                            onClick={() => handleMoveUp(network, index)}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <span>{network.priority}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={index === socialNetworks.length - 1}
                            onClick={() => handleMoveDown(network, index)}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-4">{network.name}</td>
                      <td className="p-4">{getSocialIcon(network.icon)}</td>
                      <td className="p-4 max-w-[200px] truncate">{network.url}</td>
                      <td className="p-4">
                        <Switch
                          checked={network.is_active}
                          onCheckedChange={(checked) => {
                            updateNetworkMutation.mutate({
                              id: network.id,
                              data: { is_active: checked }
                            });
                          }}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(network)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDelete(network.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
          <DialogContent className="bg-black/50 backdrop-blur-xl border-white/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Modifier le Réseau Social' : 'Nouveau Réseau Social'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="url">URL (optionnel pour partage)</Label>
                <Input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://... ou laisser vide pour génération automatique"
                />
              </div>

              <div>
                <Label htmlFor="icon">Icône</Label>
                <Select value={icon} onValueChange={setIcon}>
                  <SelectTrigger id="icon">
                    <SelectValue placeholder="Choisir une icône" />
                  </SelectTrigger>
                  <SelectContent>
                    {socialIcons.map((iconOption) => (
                      <SelectItem key={iconOption.value} value={iconOption.value}>
                        {iconOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <Label htmlFor="is_active">Actif</Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Annuler
                </Button>
                <Button type="submit">
                  {isEditing ? 'Mettre à jour' : 'Créer'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default SocialNetworksAdmin;
