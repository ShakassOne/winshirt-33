
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { createMockup, updateMockup } from '@/services/api.service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { X, Plus, Upload } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { PrintArea, Mockup } from '@/types/supabase.types';

const mockupSchema = z.object({
  name: z.string().min(3, { message: 'Le nom doit contenir au moins 3 caractères' }),
  category: z.string().min(1, { message: 'La catégorie est requise' }),
  svg_front_url: z.string().url({ message: 'URL SVG recto invalide' }),
  svg_back_url: z.string().url({ message: 'URL SVG verso invalide' }).optional().or(z.literal('')),
  price_a3: z.number().min(0, { message: 'Le prix doit être positif' }),
  price_a4: z.number().min(0, { message: 'Le prix doit être positif' }),
  price_a5: z.number().min(0, { message: 'Le prix doit être positif' }),
  price_a6: z.number().min(0, { message: 'Le prix doit être positif' }),
  text_price_front: z.number().min(0, { message: 'Le prix doit être positif' }),
  text_price_back: z.number().min(0, { message: 'Le prix doit être positif' }),
  is_active: z.boolean().default(true)
});

type MockupFormValues = z.infer<typeof mockupSchema>;

interface MockupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mockup?: Mockup | null;
}

const MockupForm = ({ isOpen, onClose, onSuccess, mockup }: MockupFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [printAreas, setPrintAreas] = useState<PrintArea[]>([]);
  const [newArea, setNewArea] = useState<Partial<PrintArea>>({
    name: '',
    side: 'front',
    x: 0,
    y: 0,
    width: 100,
    height: 100
  });

  const defaultValues: Partial<MockupFormValues> = {
    name: '',
    category: '',
    svg_front_url: '',
    svg_back_url: '',
    price_a3: 15,
    price_a4: 10,
    price_a5: 8,
    price_a6: 5,
    text_price_front: 3,
    text_price_back: 3,
    is_active: true
  };

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<MockupFormValues>({
    resolver: zodResolver(mockupSchema),
    defaultValues
  });

  useEffect(() => {
    if (mockup) {
      setValue('name', mockup.name);
      setValue('category', mockup.category);
      setValue('svg_front_url', mockup.svg_front_url);
      setValue('svg_back_url', mockup.svg_back_url || '');
      setValue('price_a3', mockup.price_a3);
      setValue('price_a4', mockup.price_a4);
      setValue('price_a5', mockup.price_a5);
      setValue('price_a6', mockup.price_a6);
      setValue('text_price_front', mockup.text_price_front);
      setValue('text_price_back', mockup.text_price_back);
      setValue('is_active', mockup.is_active);
      setPrintAreas(mockup.print_areas || []);
    } else {
      reset(defaultValues);
      setPrintAreas([]);
    }
  }, [mockup, setValue, reset]);

  const addPrintArea = () => {
    if (newArea.name && newArea.side) {
      const newId = `area_${Date.now()}`;
      setPrintAreas([...printAreas, { ...newArea as PrintArea, id: newId }]);
      setNewArea({
        name: '',
        side: 'front',
        x: 0,
        y: 0,
        width: 100,
        height: 100
      });
    } else {
      toast({
        title: "Erreur",
        description: "Le nom et le côté sont requis pour la zone d'impression",
        variant: "destructive"
      });
    }
  };

  const removePrintArea = (id: string) => {
    setPrintAreas(printAreas.filter(area => area.id !== id));
  };

  const onSubmit = async (data: MockupFormValues) => {
    try {
      setIsSubmitting(true);
      
      const mockupData = {
        ...data,
        svg_back_url: data.svg_back_url || null,
        print_areas: printAreas
      };
      
      if (mockup) {
        await updateMockup(mockup.id, mockupData);
        toast({
          title: "Succès",
          description: "Le mockup a été modifié avec succès",
          variant: "default"
        });
      } else {
        await createMockup(mockupData);
        toast({
          title: "Succès",
          description: "Le mockup a été créé avec succès",
          variant: "default"
        });
      }
      
      reset(defaultValues);
      setPrintAreas([]);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création/modification du mockup:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création/modification du mockup",
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
          <DialogTitle className="text-2xl font-bold">{mockup ? 'Modifier le mockup' : 'Nouveau mockup'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du mockup</Label>
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
                  <option value="Accessoires">Accessoires</option>
                </select>
                {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="svg_front_url">URL du SVG recto</Label>
                <Input id="svg_front_url" {...register('svg_front_url')} />
                {errors.svg_front_url && <p className="text-red-500 text-sm">{errors.svg_front_url.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="svg_back_url">URL du SVG verso (optionnel)</Label>
                <Input id="svg_back_url" {...register('svg_back_url')} />
                {errors.svg_back_url && <p className="text-red-500 text-sm">{errors.svg_back_url.message}</p>}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="is_active" 
                    {...register('is_active')} 
                    onCheckedChange={(checked) => setValue('is_active', checked)}
                    checked={watch('is_active')}
                  />
                  <Label htmlFor="is_active">Mockup actif</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_a3">Prix A3 (€)</Label>
                  <Input 
                    id="price_a3" 
                    type="number" 
                    step="0.01"
                    {...register('price_a3', { valueAsNumber: true })} 
                  />
                  {errors.price_a3 && <p className="text-red-500 text-sm">{errors.price_a3.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price_a4">Prix A4 (€)</Label>
                  <Input 
                    id="price_a4" 
                    type="number" 
                    step="0.01"
                    {...register('price_a4', { valueAsNumber: true })} 
                  />
                  {errors.price_a4 && <p className="text-red-500 text-sm">{errors.price_a4.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price_a5">Prix A5 (€)</Label>
                  <Input 
                    id="price_a5" 
                    type="number" 
                    step="0.01"
                    {...register('price_a5', { valueAsNumber: true })} 
                  />
                  {errors.price_a5 && <p className="text-red-500 text-sm">{errors.price_a5.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price_a6">Prix A6 (€)</Label>
                  <Input 
                    id="price_a6" 
                    type="number" 
                    step="0.01"
                    {...register('price_a6', { valueAsNumber: true })} 
                  />
                  {errors.price_a6 && <p className="text-red-500 text-sm">{errors.price_a6.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="text_price_front">Prix texte recto (€)</Label>
                  <Input 
                    id="text_price_front" 
                    type="number" 
                    step="0.01"
                    {...register('text_price_front', { valueAsNumber: true })} 
                  />
                  {errors.text_price_front && <p className="text-red-500 text-sm">{errors.text_price_front.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="text_price_back">Prix texte verso (€)</Label>
                  <Input 
                    id="text_price_back" 
                    type="number" 
                    step="0.01"
                    {...register('text_price_back', { valueAsNumber: true })} 
                  />
                  {errors.text_price_back && <p className="text-red-500 text-sm">{errors.text_price_back.message}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Zones d'impression</h3>
            <GlassCard className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom de la zone</Label>
                  <Input 
                    value={newArea.name} 
                    onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                    placeholder="ex: Devant centre"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Côté</Label>
                  <select 
                    value={newArea.side as string}
                    onChange={(e) => setNewArea({ ...newArea, side: e.target.value as 'front' | 'back' })}
                    className="w-full rounded-md bg-background/10 border border-white/20 px-4 py-2"
                  >
                    <option value="front">Recto</option>
                    <option value="back">Verso</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label>Position X</Label>
                  <Input 
                    type="number"
                    value={newArea.x} 
                    onChange={(e) => setNewArea({ ...newArea, x: Number(e.target.value) })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Position Y</Label>
                  <Input 
                    type="number"
                    value={newArea.y} 
                    onChange={(e) => setNewArea({ ...newArea, y: Number(e.target.value) })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Largeur</Label>
                  <Input 
                    type="number"
                    value={newArea.width} 
                    onChange={(e) => setNewArea({ ...newArea, width: Number(e.target.value) })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Hauteur</Label>
                  <Input 
                    type="number"
                    value={newArea.height} 
                    onChange={(e) => setNewArea({ ...newArea, height: Number(e.target.value) })}
                  />
                </div>
              </div>
              
              <Button type="button" onClick={addPrintArea} className="mt-4 w-full">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter cette zone d'impression
              </Button>
              
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Zones d'impression définies</h4>
                {printAreas.length === 0 ? (
                  <p className="text-white/50 text-sm">Aucune zone d'impression définie</p>
                ) : (
                  <div className="space-y-2">
                    {printAreas.map((area) => (
                      <div key={area.id} className="flex items-center justify-between bg-white/5 p-2 rounded-md">
                        <div>
                          <span className="font-medium">{area.name}</span>
                          <span className="text-sm text-white/70 ml-2">({area.side === 'front' ? 'Recto' : 'Verso'})</span>
                          <span className="text-xs text-white/50 block">
                            Position: {area.x},{area.y} - Taille: {area.width}x{area.height}
                          </span>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => removePrintArea(area.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "En cours..." : mockup ? "Mettre à jour" : "Créer le mockup"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MockupForm;
