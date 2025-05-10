import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllDesigns as fetchDesigns, createDesign, updateDesign, deleteDesign
} from '@/services/api.service';
import { Design } from '@/types/supabase.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UploadButton } from '@/components/ui/upload-button';

const DesignsAdmin = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [isActive, setIsActive] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: designs, isLoading, error } = useQuery({
    queryKey: ['designs'],
    queryFn: fetchDesigns,
  });

  const createDesignMutation = useMutation(createDesign, {
    onSuccess: () => {
      queryClient.invalidateQueries(['designs']);
      closeDialog();
      toast({
        title: "Succès",
        description: "Le design a été créé avec succès",
        variant: "default"
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création du design",
        variant: "destructive"
      });
    }
  });

  const updateDesignMutation = useMutation(
    (designData: { id: string; data: any }) => updateDesign(designData.id, designData.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['designs']);
        closeDialog();
        toast({
          title: "Succès",
          description: "Le design a été mis à jour avec succès",
          variant: "default"
        });
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors de la mise à jour du design",
          variant: "destructive"
        });
      }
    }
  );

  const deleteDesignMutation = useMutation(deleteDesign, {
    onSuccess: () => {
      queryClient.invalidateQueries(['designs']);
      toast({
        title: "Succès",
        description: "Le design a été supprimé avec succès",
        variant: "default"
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression du design",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (selectedDesign) {
      setName(selectedDesign.name);
      setImageUrl(selectedDesign.image_url);
      setCategory(selectedDesign.category);
      setIsActive(selectedDesign.is_active !== false);
    }
  }, [selectedDesign]);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setSelectedDesign(null);
    setName('');
    setImageUrl('');
    setCategory('');
    setIsActive(true);
  };

  const handleCreate = () => {
    setIsEditing(false);
    setSelectedDesign(null);
    openDialog();
  };

  const handleEdit = (design: Design) => {
    setIsEditing(true);
    setSelectedDesign(design);
    openDialog();
  };

  const handleDelete = async (id: string) => {
    await deleteDesignMutation.mutateAsync(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const designData = {
      name,
      image_url: imageUrl,
      category,
      is_active: isActive,
    };

    if (isEditing && selectedDesign) {
      await updateDesignMutation.mutateAsync({ id: selectedDesign.id, data: designData });
    } else {
      await createDesignMutation.mutateAsync(designData);
    }
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  if (isLoading) return <div>Chargement des designs...</div>;
  if (error) return <div>Une erreur est survenue lors du chargement des designs.</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestion des Designs</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Design
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {designs?.map((design) => (
          <div key={design.id} className="relative bg-white/5 rounded-lg shadow-md p-4">
            <img src={design.image_url} alt={design.name} className="w-full h-32 object-contain mb-4" />
            <h3 className="text-lg font-semibold mb-2">{design.name}</h3>
            <p className="text-sm text-gray-500 mb-2">Catégorie: {design.category}</p>
            <div className="flex items-center justify-between">
              <Switch
                id={`design-active-${design.id}`}
                checked={design.is_active !== false}
                onCheckedChange={(checked) => {
                  updateDesignMutation.mutate({
                    id: design.id,
                    data: { is_active: checked },
                  });
                }}
              />
              <Label htmlFor={`design-active-${design.id}`} className="text-sm">
                {design.is_active !== false ? 'Actif' : 'Inactif'}
              </Label>
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleEdit(design)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(design.id)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="bg-black/50 backdrop-blur-xl border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Modifier Design' : 'Nouveau Design'}</DialogTitle>
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
              <Label htmlFor="imageUrl">URL de l'image</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                  className="flex-1"
                />
                <UploadButton
                  onUpload={handleImageUpload}
                  variant="outline"
                  targetFolder="designs"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                <Label htmlFor="is_active">Design actif</Label>
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

export default DesignsAdmin;
