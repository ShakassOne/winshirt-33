import logger from '@/utils/logger';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { createProduct, updateProduct } from '@/services/api.service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { X, Plus } from 'lucide-react';
import { Product, Mockup } from '@/types/supabase.types';
import { UploadImageField } from '@/components/ui/upload-image-field';

const productSchema = z.object({
  name: z.string().min(3, { message: 'Le nom doit contenir au moins 3 caractères' }),
  description: z.string().min(10, { message: 'La description doit contenir au moins 10 caractères' }),
  price: z.number().min(0.01, { message: 'Le prix doit être supérieur à 0' }),
  image_url: z.string().url({ message: 'URL d\'image invalide' }),
  category: z.string().min(1, { message: 'La catégorie est requise' }),
  is_customizable: z.boolean().default(false),
  is_active: z.boolean().default(true),
  tickets_offered: z.number().int().min(0).default(0),
  mockup_id: z.string().optional().nullable()
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Product | null;
  mockups?: Mockup[]; // ✅ Reçu en props maintenant
}

const ProductForm = ({ isOpen, onClose, onSuccess, initialData, mockups = [] }: ProductFormProps) => {
  logger.log('🎭 [ProductForm] Rendering with mockups:', mockups?.length || 0);
  
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');

  const defaultValues: Partial<ProductFormValues> = {
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category: '',
    is_customizable: false,
    is_active: true,
    tickets_offered: 0,
    mockup_id: null
  };

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues
  });

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('description', initialData.description);
      setValue('price', initialData.price);
      setValue('image_url', initialData.image_url);
      setValue('category', initialData.category);
      setValue('is_customizable', initialData.is_customizable);
      setValue('is_active', initialData.is_active);
      setValue('tickets_offered', initialData.tickets_offered);
      setValue('mockup_id', initialData.mockup_id);
      
      setColors(initialData.available_colors || []);
      setSizes(initialData.available_sizes || []);
    } else {
      reset(defaultValues);
      setColors([]);
      setSizes([]);
    }
  }, [initialData, setValue, reset]);

  const isCustomizable = watch('is_customizable');
  const selectedCategory = watch('category');
  const imageUrl = watch('image_url');

  useEffect(() => {
    if (selectedCategory && mockups && mockups.length > 0) {
      const matchingMockups = mockups.filter(mockup => mockup.category === selectedCategory);
      if (matchingMockups.length === 1) {
        setValue('mockup_id', matchingMockups[0].id);
      }
    }
  }, [selectedCategory, mockups, setValue]);

  const addColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor('');
    }
  };

  const removeColor = (color: string) => {
    setColors(colors.filter(c => c !== color));
  };

  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    setSizes(sizes.filter(s => s !== size));
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      
      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        image_url: data.image_url,
        category: data.category,
        is_customizable: data.is_customizable,
        is_active: data.is_active,
        tickets_offered: data.tickets_offered,
        mockup_id: data.mockup_id,
        color: colors.length > 0 ? colors[0] : null,
        available_colors: colors,
        available_sizes: sizes
      };
      
      if (initialData) {
        await updateProduct(initialData.id, productData);
        toast({
          title: "Succès",
          description: "Le produit a été mis à jour avec succès",
          variant: "default"
        });
      } else {
        await createProduct(productData);
        toast({
          title: "Succès",
          description: "Le produit a été créé avec succès",
          variant: "default"
        });
      }
      
      reset(defaultValues);
      setColors([]);
      setSizes([]);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'opération sur le produit:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'opération",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/50 backdrop-blur-xl border-white/20 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {initialData ? 'Modifier le produit' : 'Nouveau produit'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <select 
                  id="category"
                  {...register('category')}
                  className="w-full rounded-md bg-background/10 border border-white/20 px-4 py-2"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="T-shirts">T-shirts</option>
                  <option value="Sweatshirts">Sweatshirts</option>
                  <option value="Casquettes">Casquettes</option>
                  <option value="Accessoires">BodyWarmer</option>
                  <option value="Accessoires">Accessoires</option>
                </select>
                {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
              </div>

              {selectedCategory && mockups && mockups.filter(m => m.category === selectedCategory).length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="mockup_id">Mockup</Label>
                  <select 
                    id="mockup_id"
                    {...register('mockup_id')}
                    className="w-full rounded-md bg-background/10 border border-white/20 px-4 py-2"
                  >
                    <option value="">Sélectionnez un mockup</option>
                    {mockups
                      .filter(mockup => mockup.category === selectedCategory)
                      .map(mockup => (
                        <option key={mockup.id} value={mockup.id}>{mockup.name}</option>
                      ))
                    }
                  </select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="price">Prix (€)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  step="0.01"
                  {...register('price', { valueAsNumber: true })} 
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>
              
              <UploadImageField
                label="Image du produit"
                value={imageUrl}
                onChange={(value) => setValue('image_url', value)}
                placeholder="URL de l'image"
                id="product-image"
              />
              {errors.image_url && <p className="text-red-500 text-sm">{errors.image_url.message}</p>}
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="is_customizable" 
                    checked={isCustomizable}
                    onCheckedChange={(checked) => setValue('is_customizable', checked)}
                  />
                  <Label htmlFor="is_customizable">Personnalisable</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="is_active" 
                    defaultChecked
                    {...register('is_active')} 
                  />
                  <Label htmlFor="is_active">Produit actif</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tickets_offered">Tickets offerts</Label>
                <Input 
                  id="tickets_offered" 
                  type="number" 
                  min="0"
                  {...register('tickets_offered', { valueAsNumber: true })} 
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  className="min-h-32 bg-background/10 border border-white/20" 
                  {...register('description')} 
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label>Couleurs disponibles</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    value={newColor} 
                    onChange={(e) => setNewColor(e.target.value)} 
                    placeholder="Ajouter une couleur" 
                  />
                  <Button type="button" variant="outline" onClick={addColor}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {colors.map((color, index) => (
                    <div key={index} className="flex items-center bg-background/20 rounded-full px-3 py-1">
                      <span className="mr-1">{color}</span>
                      <button 
                        type="button" 
                        onClick={() => removeColor(color)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Tailles disponibles</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    value={newSize} 
                    onChange={(e) => setNewSize(e.target.value)} 
                    placeholder="Ajouter une taille" 
                  />
                  <Button type="button" variant="outline" onClick={addSize}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sizes.map((size, index) => (
                    <div key={index} className="flex items-center bg-background/20 rounded-full px-3 py-1">
                      <span className="mr-1">{size}</span>
                      <button 
                        type="button" 
                        onClick={() => removeSize(size)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (initialData ? "Mise à jour en cours..." : "Création en cours...")
                : (initialData ? "Mettre à jour" : "Créer le produit")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
