
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { createProduct, updateProduct, fetchAllMockups } from '@/services/api.service';
import { Product, Mockup } from '@/types/supabase.types';
import { UploadButton } from '@/components/ui/upload-button';
import { useQuery } from '@tanstack/react-query';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Product | null;
}

export function ProductForm({ isOpen, onClose, onSuccess, initialData }: ProductFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      category: initialData?.category || '',
      image_url: initialData?.image_url || '',
      is_customizable: initialData?.is_customizable || false,
      available_colors: initialData?.available_colors?.join(',') || '',
      available_sizes: initialData?.available_sizes?.join(',') || '',
      tickets_offered: initialData?.tickets_offered || 0,
      is_active: initialData?.is_active !== false,
      mockup_id: initialData?.mockup_id || ''
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>(initialData?.category || '');
  const [imageUrl, setImageUrl] = useState<string>(initialData?.image_url || '');

  const { data: mockups, isLoading: isMockupsLoading } = useQuery({
    queryKey: ['adminMockups'],
    queryFn: fetchAllMockups,
  });

  // Fix typing issues with mockups data
  useEffect(() => {
    // Filter mockups by selected category
    if (selectedCategory && mockups && Array.isArray(mockups) && mockups.length > 0) {
      const matchingMockups = mockups.filter(mockup => mockup.category === selectedCategory);
      if (matchingMockups.length === 1) {
        setValue('mockup_id', matchingMockups[0].id);
      }
    }
  }, [selectedCategory, mockups, setValue]);

  // Form submission handler
  const onSubmit = async (data: any) => {
    // Implementation will go here
  };

  // Fix the mockup selection section
  const renderMockupSelector = () => {
    if (!selectedCategory || !mockups) return null;
    
    const filteredMockups = Array.isArray(mockups) 
      ? mockups.filter(m => m.category === selectedCategory)
      : [];
      
    if (filteredMockups.length === 0) return null;
    
    return (
      <div className="space-y-2">
        <Label htmlFor="mockup_id">Mockup</Label>
        <select 
          id="mockup_id"
          {...register('mockup_id')}
          className="w-full rounded-md bg-background/10 border border-white/20 px-4 py-2"
        >
          <option value="">Sélectionnez un mockup</option>
          {filteredMockups.map(mockup => (
            <option key={mockup.id} value={mockup.id}>{mockup.name}</option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/50 backdrop-blur-xl border-white/20 text-white sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Modifier le produit' : 'Ajouter un produit'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Button type="submit" className="w-full">
            {initialData ? 'Mettre à jour' : 'Créer'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
