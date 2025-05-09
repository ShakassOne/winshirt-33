
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { createLottery, updateLottery } from '@/services/api.service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Lottery } from '@/types/supabase.types';

const lotterySchema = z.object({
  title: z.string().min(3, { message: 'Le titre doit contenir au moins 3 caractères' }),
  description: z.string().min(10, { message: 'La description doit contenir au moins 10 caractères' }),
  image_url: z.string().url({ message: 'URL d\'image invalide' }),
  value: z.number().min(0.01, { message: 'La valeur doit être supérieure à 0' }),
  goal: z.number().int().min(1, { message: 'L\'objectif doit être au moins de 1' }),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

type LotteryFormValues = z.infer<typeof lotterySchema>;

interface LotteryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Lottery | null;
}

const LotteryForm = ({ isOpen, onClose, onSuccess, initialData }: LotteryFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [drawDate, setDrawDate] = useState<Date | undefined>(new Date());

  const defaultValues: Partial<LotteryFormValues> = {
    title: '',
    description: '',
    image_url: '',
    value: 0,
    goal: 100,
    is_active: true,
    is_featured: false
  };

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<LotteryFormValues>({
    resolver: zodResolver(lotterySchema),
    defaultValues
  });

  // Initialize form with initialData if provided
  useEffect(() => {
    if (initialData) {
      setValue('title', initialData.title);
      setValue('description', initialData.description);
      setValue('image_url', initialData.image_url);
      setValue('value', initialData.value);
      setValue('goal', initialData.goal);
      setValue('is_active', initialData.is_active);
      setValue('is_featured', initialData.is_featured);
      setDrawDate(new Date(initialData.draw_date));
    }
  }, [initialData, setValue]);

  const isFeatured = watch('is_featured');

  const onSubmit = async (data: LotteryFormValues) => {
    if (!drawDate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date de tirage",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Nous nous assurons que toutes les propriétés requises sont définies
      const lotteryData = {
        title: data.title,
        description: data.description,
        image_url: data.image_url,
        value: data.value,
        goal: data.goal,
        is_active: data.is_active,
        is_featured: data.is_featured,
        draw_date: drawDate.toISOString(),
        participants: initialData?.participants || 0
      };
      
      if (initialData) {
        await updateLottery(initialData.id, lotteryData);
        toast({
          title: "Succès",
          description: "La loterie a été mise à jour avec succès",
          variant: "default"
        });
      } else {
        await createLottery(lotteryData);
        toast({
          title: "Succès",
          description: "La loterie a été créée avec succès",
          variant: "default"
        });
      }
      
      reset(defaultValues);
      setDrawDate(new Date());
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'opération sur la loterie:", error);
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
      <DialogContent className="bg-black/50 backdrop-blur-xl border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {initialData ? 'Modifier la loterie' : 'Nouvelle loterie'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de la loterie</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            
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
              <Label htmlFor="image_url">URL de l'image</Label>
              <Input id="image_url" {...register('image_url')} />
              {errors.image_url && <p className="text-red-500 text-sm">{errors.image_url.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Valeur (€)</Label>
                <Input 
                  id="value" 
                  type="number" 
                  step="0.01"
                  {...register('value', { valueAsNumber: true })} 
                />
                {errors.value && <p className="text-red-500 text-sm">{errors.value.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goal">Objectif de participants</Label>
                <Input 
                  id="goal" 
                  type="number" 
                  min="1"
                  {...register('goal', { valueAsNumber: true })} 
                />
                {errors.goal && <p className="text-red-500 text-sm">{errors.goal.message}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="draw_date">Date du tirage</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {drawDate ? format(drawDate, 'PPP', { locale: fr }) : <span>Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black/80 backdrop-blur-lg border border-white/20" align="start">
                  <Calendar
                    mode="single"
                    selected={drawDate}
                    onSelect={setDrawDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is_active" 
                  defaultChecked
                  {...register('is_active')} 
                />
                <Label htmlFor="is_active">Loterie active</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is_featured" 
                  checked={isFeatured}
                  onCheckedChange={(checked) => setValue('is_featured', checked)}
                />
                <Label htmlFor="is_featured">En vedette</Label>
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
                : (initialData ? "Mettre à jour" : "Créer la loterie")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LotteryForm;
