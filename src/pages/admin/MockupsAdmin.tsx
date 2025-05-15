
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllMockups as fetchMockups,
  createMockup,
  updateMockup,
  deleteMockup,
} from '@/services/api.service';
import { Mockup, PrintArea } from '@/types/supabase.types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import MockupForm from '@/components/admin/MockupForm';

const MockupsAdmin = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMockup, setSelectedMockup] = useState<Mockup | null>(null);
  const queryClient = useQueryClient();

  const { data: mockups, isLoading, error } = useQuery({
    queryKey: ['mockups'],
    queryFn: fetchMockups,
  });

  const createMockupMutation = useMutation({
    mutationFn: (mockupData: any) => createMockup(mockupData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mockups'] });
      toast("Succès", { 
        description: "Operation réussie" 
      });
    },
    onError: () => {
      toast("Erreur", {
        description: "Une erreur s'est produite lors de la création du mockup"
      });
    }
  });

  const updateMockupMutation = useMutation({
    mutationFn: (mockupData: { id: string; data: any }) =>
      updateMockup(mockupData.id, mockupData.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mockups'] });
      toast("Succès", { 
        description: "Operation réussie" 
      });
    },
    onError: () => {
      toast("Erreur", {
        description: "Une erreur s'est produite lors de la mise à jour du mockup"
      });
    }
  });

  const deleteMockupMutation = useMutation({
    mutationFn: (id: string) => deleteMockup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mockups'] });
      toast("Succès", { 
        description: "Operation réussie" 
      });
    },
    onError: () => {
      toast("Erreur", {
        description: "Une erreur s'est produite lors de la suppression du mockup"
      });
    }
  });

  const handleCreate = () => {
    setSelectedMockup(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (mockup: any) => {
    // Make sure print_areas is properly parsed as PrintArea[]
    const print_areas = mockup.print_areas ? 
      (typeof mockup.print_areas === 'string' ? 
        JSON.parse(mockup.print_areas) : mockup.print_areas) : [];
    
    const parsedMockup = {
      ...mockup,
      print_areas: print_areas as PrintArea[]
    };
    
    setSelectedMockup(parsedMockup as Mockup);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteMockupMutation.mutateAsync(id);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMockup(null);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['mockups'] });
  };

  if (isLoading) return <div>Chargement des mockups...</div>;
  if (error) return <div>Une erreur est survenue lors du chargement des mockups.</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestion des Mockups</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Mockup
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockups?.map((mockup) => (
          <div key={mockup.id} className="relative bg-white/5 rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">{mockup.name}</h3>
            <p className="text-sm text-gray-500 mb-2">Catégorie: {mockup.category}</p>
            <div className="absolute top-2 right-2 flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleEdit(mockup)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(mockup.id)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <MockupForm
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
        initialData={selectedMockup}
      />
    </div>
  );
};

export default MockupsAdmin;
