import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllLotteries as fetchLotteries,
  createLottery,
  updateLottery,
  deleteLottery,
} from '@/services/api.service';
import { Lottery } from '@/types/supabase.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LotteriesAdmin = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLottery, setSelectedLottery] = useState<Lottery | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: lotteries, isLoading, error } = useQuery({
    queryKey: ['lotteries'],
    queryFn: fetchLotteries,
  });

  const createLotteryMutation = useMutation({
    mutationFn: (lotteryData: any) => createLottery(lotteryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotteries'] });
      closeDialog();
      toast("Succès", {
        description: "La loterie a été créée avec succès"
      });
    },
    onError: () => {
      toast("Erreur", {
        description: "Une erreur s'est produite lors de la création de la loterie"
      });
    }
  });

  const updateLotteryMutation = useMutation({
    mutationFn: (lotteryData: { id: string; data: any }) =>
      updateLottery(lotteryData.id, lotteryData.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotteries'] });
      closeDialog();
      toast("Succès", {
        description: "La loterie a été mise à jour avec succès"
      });
    },
    onError: () => {
      toast("Erreur", {
        description: "Une erreur s'est produite lors de la mise à jour de la loterie"
      });
    }
  });

  const deleteLotteryMutation = useMutation({
    mutationFn: (id: string) => deleteLottery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotteries'] });
      toast("Succès", {
        description: "La loterie a été supprimée avec succès"
      });
    },
    onError: () => {
      toast("Erreur", {
        description: "Une erreur s'est produite lors de la suppression de la loterie"
      });
    }
  });

  useEffect(() => {
    if (selectedLottery) {
      setName(selectedLottery.name);
      setPrice(selectedLottery.price);
      setIsActive(selectedLottery.is_active !== false);
    }
  }, [selectedLottery]);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setSelectedLottery(null);
    setName('');
    setPrice(0);
    setIsActive(true);
  };

  const handleCreate = () => {
    setIsEditing(false);
    setSelectedLottery(null);
    openDialog();
  };

  const handleEdit = (lottery: Lottery) => {
    setIsEditing(true);
    setSelectedLottery(lottery);
    openDialog();
  };

  const handleDelete = async (id: string) => {
    await deleteLotteryMutation.mutateAsync(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const lotteryData = {
      name,
      price,
      is_active: isActive,
    };

    if (isEditing && selectedLottery) {
      await updateLotteryMutation.mutateAsync({ id: selectedLottery.id, data: lotteryData });
    } else {
      await createLotteryMutation.mutateAsync(lotteryData);
    }
  };

  if (isLoading) return <div>Chargement des loteries...</div>;
  if (error) return <div>Une erreur est survenue lors du chargement des loteries.</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestion des Loteries</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Loterie
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {lotteries?.map((lottery) => (
          <div key={lottery.id} className="relative bg-white/5 rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">{lottery.name}</h3>
            <p className="text-sm text-gray-500 mb-2">Prix: {lottery.price} €</p>
            <div className="flex items-center justify-between">
              <Switch
                id={`lottery-active-${lottery.id}`}
                checked={lottery.is_active !== false}
                onCheckedChange={(checked) => {
                  updateLotteryMutation.mutate({
                    id: lottery.id,
                    data: { is_active: checked },
                  });
                }}
              />
              <Label htmlFor={`lottery-active-${lottery.id}`} className="text-sm">
                {lottery.is_active !== false ? 'Actif' : 'Inactif'}
              </Label>
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleEdit(lottery)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(lottery.id)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="bg-black/50 backdrop-blur-xl border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Modifier Loterie' : 'Nouvelle Loterie'}</DialogTitle>
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
              <Label htmlFor="price">Prix</Label>
              <Input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="is_active">Loterie active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {isEditing ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LotteriesAdmin;
