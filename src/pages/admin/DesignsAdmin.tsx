
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { fetchAllDesigns as fetchDesigns, createDesign, updateDesign, deleteDesign } from '@/services/api.service';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Design } from '@/types/supabase.types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DesignForm from '@/components/admin/DesignForm';
import { Badge } from '@/components/ui/badge';

const DesignsAdmin = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedDesign, setSelectedDesign] = React.useState<Design | null>(null);

  const queryClient = useQueryClient();

  const { data: designs = [], isLoading, error } = useQuery({
    queryKey: ['designs'],
    queryFn: fetchDesigns,
  });

  const createMutation = useMutation({
    mutationFn: createDesign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designs'] });
      toast.success('Design créé avec succès!');
      setIsCreateDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Erreur lors de la création: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; designData: any }) => 
      updateDesign(data.id, data.designData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designs'] });
      toast.success('Design mis à jour avec succès!');
      setIsEditDialogOpen(false);
      setSelectedDesign(null);
    },
    onError: (error: any) => {
      toast.error(`Erreur lors de la mise à jour: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDesign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designs'] });
      toast.success('Design supprimé avec succès!');
      setIsEditDialogOpen(false);
      setSelectedDesign(null);
    },
    onError: (error: any) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`);
    },
  });

  const handleCreate = (data: any) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data: any) => {
    if (selectedDesign) {
      updateMutation.mutate({ id: selectedDesign.id, designData: data });
    }
  };

  const handleDelete = () => {
    if (selectedDesign) {
      deleteMutation.mutate(selectedDesign.id);
    }
  };

  const handleEditClick = (design: Design) => {
    setSelectedDesign(design);
    setIsEditDialogOpen(true);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-4">
            <h2 className="text-2xl font-semibold mb-2">Erreur</h2>
            <p className="mb-4 text-muted-foreground">
              Une erreur s'est produite lors du chargement des designs.
            </p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        <section className="relative py-8 bg-gradient-to-b from-winshirt-blue/20 to-transparent">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Gestion des <span className="text-gradient">Designs</span>
                </h1>
                <p className="text-white/70 mt-2">
                  Créez et gérez les designs pour la personnalisation des produits
                </p>
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un design
              </Button>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg shadow-lg">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-winshirt-blue"></div>
                </div>
              ) : designs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="mb-4 text-white/70">Aucun design trouvé.</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer votre premier design
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: '120px' }}>Image</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {designs.map((design) => (
                      <TableRow key={design.id}>
                        <TableCell>
                          <div className="h-12 w-12 rounded overflow-hidden bg-gray-800">
                            <img 
                              src={design.image_url} 
                              alt={design.name} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{design.name}</TableCell>
                        <TableCell>{design.category}</TableCell>
                        <TableCell>
                          {design.is_active ? (
                            <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                              <Eye className="h-3 w-3 mr-1" />
                              Actif
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/30">
                              <EyeOff className="h-3 w-3 mr-1" />
                              Inactif
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditClick(design)}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Créer un nouveau design</DialogTitle>
          </DialogHeader>
          <DesignForm 
            onSubmit={handleCreate} 
            isSubmitting={createMutation.isPending} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Modifier le design</DialogTitle>
          </DialogHeader>
          <DesignForm 
            initialData={selectedDesign}
            onSubmit={handleUpdate}
            onDelete={handleDelete}
            isSubmitting={updateMutation.isPending || deleteMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DesignsAdmin;
