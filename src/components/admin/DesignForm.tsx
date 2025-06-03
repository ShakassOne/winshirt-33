
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Design } from '@/types/supabase.types';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AdminSVGUpload } from '@/components/admin/AdminSVGUpload';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  image_url: z.string().url({
    message: "Veuillez entrer une URL d'image valide.",
  }),
  category: z.string().min(1, {
    message: "Veuillez sélectionner une catégorie.",
  }),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface DesignFormProps {
  initialData?: Design | null;
  onSubmit: (data: FormValues) => void;
  onDelete?: () => void;
  isSubmitting: boolean;
}

const DesignForm: React.FC<DesignFormProps> = ({
  initialData,
  onSubmit,
  onDelete,
  isSubmitting,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      image_url: initialData?.image_url || "",
      category: initialData?.category || "",
      is_active: initialData?.is_active !== false, // default to true if undefined
    },
  });

  const designCategories = [
    { value: "sports", label: "Sports" },
    { value: "music", label: "Musique" },
    { value: "animals", label: "Animaux" },
    { value: "nature", label: "Nature" },
    { value: "abstract", label: "Abstrait" },
    { value: "logos", label: "Logos" },
    { value: "text", label: "Texte" },
    { value: "other", label: "Autre" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du design</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du design" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {designCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AdminSVGUpload
                      label="Image du design"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="URL de l'image"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Actif</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Ce design sera disponible pour la personnalisation
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div>
            {/* Preview is now handled by AdminSVGUpload */}
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            {initialData && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "En cours..." : initialData ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DesignForm;
