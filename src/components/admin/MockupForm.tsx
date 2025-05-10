import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { createMockup, updateMockup, uploadFileToStorage } from '@/services/api.service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { X, Plus, Trash } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mockup, PrintArea } from '@/types/supabase.types';
import { UploadButton } from '@/components/ui/upload-button';
import MockupColorForm from './MockupColorForm';
import { MockupColor } from '@/types/mockup.types';

const mockupSchema = z.object({
  name: z.string().min(3, { message: 'Le nom doit contenir au moins 3 caractères' }),
  category: z.string().min(1, { message: 'La catégorie est requise' }),
  svg_front_url: z.string().url({ message: 'URL SVG avant invalide' }),
  svg_back_url: z.string().url({ message: 'URL SVG arrière invalide' }).optional(),
  price_a3: z.number().min(0, { message: 'Le prix doit être positif' }),
  price_a4: z.number().min(0, { message: 'Le prix doit être positif' }),
  price_a5: z.number().min(0, { message: 'Le prix doit être positif' }),
  price_a6: z.number().min(0, { message: 'Le prix doit être positif' }),
  text_price_front: z.number().min(0, { message: 'Le prix doit être positif' }),
  text_price_back: z.number().min(0, { message: 'Le prix doit être positif' }),
  is_active: z.boolean().default(true),
});

type MockupFormValues = z.infer<typeof mockupSchema>;

interface MockupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Mockup | null;
}

const MockupForm = ({ isOpen, onClose, onSuccess, initialData }: MockupFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [printAreas, setPrintAreas] = useState<PrintArea[]>([]);
  const [activeTab, setActiveTab] = useState<string>('front');
  const [mockupColors, setMockupColors] = useState<MockupColor[]>([]);
  const [activeTabSection, setActiveTabSection] = useState<string>('details');

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
    is_active: true,
  };

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<MockupFormValues>({
    resolver: zodResolver(mockupSchema),
    defaultValues
  });

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('category', initialData.category);
      setValue('svg_front_url', initialData.svg_front_url);
      setValue('svg_back_url', initialData.svg_back_url || '');
      setValue('price_a3', initialData.price_a3);
      setValue('price_a4', initialData.price_a4);
      setValue('price_a5', initialData.price_a5);
      setValue('price_a6', initialData.price_a6);
      setValue('text_price_front', initialData.text_price_front);
      setValue('text_price_back', initialData.text_price_back);
      setValue('is_active', initialData.is_active);

      // Ensure print_areas is always an array
      let areas: PrintArea[] = [];
      if (initialData.print_areas) {
        if (Array.isArray(initialData.print_areas)) {
          areas = initialData.print_areas;
        } else if (typeof initialData.print_areas === 'string') {
          try {
            areas = JSON.parse(initialData.print_areas);
            if (!Array.isArray(areas)) {
              areas = [];
            }
          } catch (e) {
            console.error("Error parsing print_areas JSON:", e);
            areas = [];
          }
        }
      }
      setPrintAreas(areas);
      
      // Load mockup colors if available
      if (initialData.colors) {
        try {
          const colors = Array.isArray(initialData.colors) 
            ? initialData.colors 
            : (typeof initialData.colors === 'string' ? JSON.parse(initialData.colors) : []);
          setMockupColors(Array.isArray(colors) ? colors : []);
        } catch (e) {
          console.error("Error loading mockup colors:", e);
          setMockupColors([]);
        }
      }
    } else {
      reset(defaultValues);
      setPrintAreas([]);
      setMockupColors([]);
    }
  }, [initialData, setValue, reset]);

  const addPrintArea = (side: 'front' | 'back') => {
    const newArea: PrintArea = {
      id: `${Date.now()}`,
      side,
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      name: `Zone ${side === 'front' ? 'avant' : 'arrière'} ${printAreas.filter(a => a.side === side).length + 1}`
    };

    setPrintAreas([...printAreas, newArea]);
  };

  const removePrintArea = (areaId: string) => {
    setPrintAreas(printAreas.filter(area => area.id !== areaId));
  };

  const updatePrintArea = (areaId: string, field: keyof PrintArea, value: any) => {
    setPrintAreas(areas => areas.map(area => {
      if (area.id === areaId) {
        // Handle both x/y and position_x/position_y
        if (field === 'position_x') {
          return { ...area, x: value };
        } else if (field === 'position_y') {
          return { ...area, y: value };
        }
        return { ...area, [field]: value };
      }
      return area;
    }));
  };
  
  // Color variant management
  const addMockupColor = () => {
    const newColor: MockupColor = {
      name: `Couleur ${mockupColors.length + 1}`,
      color_code: '#000000',
      hex_code: '#000000', // Add hex_code with same value as color_code
      front_image_url: '',
      back_image_url: ''
    };
    setMockupColors([...mockupColors, newColor]);
  };
  
  const updateMockupColor = (index: number, updatedColor: MockupColor) => {
    setMockupColors(currentColors => 
      currentColors.map((color, i) => i === index ? updatedColor : color)
    );
  };
  
  const removeMockupColor = (index: number) => {
    setMockupColors(currentColors => 
      currentColors.filter((_, i) => i !== index)
    );
  };

  const handleSvgFrontUpload = (url: string) => {
    setValue('svg_front_url', url);
  };

  const handleSvgBackUpload = (url: string) => {
    setValue('svg_back_url', url);
  };

  const onSubmit = async (data: MockupFormValues) => {
    try {
      setIsSubmitting(true);

      // Make sure we convert position_x/position_y to x/y in print areas
      const convertedPrintAreas = printAreas.map(area => ({
        id: area.id,
        name: area.name,
        width: area.width,
        height: area.height,
        x: area.position_x !== undefined ? area.position_x : area.x,
        y: area.position_y !== undefined ? area.position_y : area.y,
        side: area.side
      }));

      // Ensure required fields are present
      const mockupData = {
        name: data.name,
        category: data.category,
        svg_front_url: data.svg_front_url,
        svg_back_url: data.svg_back_url || '',
        price_a3: data.price_a3,
        price_a4: data.price_a4,
        price_a5: data.price_a5,
        price_a6: data.price_a6,
        text_price_front: data.text_price_front,
        text_price_back: data.text_price_back,
        is_active: data.is_active,
        print_areas: convertedPrintAreas,
        colors: mockupColors
      };

      if (initialData) {
        await updateMockup(initialData.id, mockupData);
        toast({
          title: "Succès",
          description: "Le mockup a été mis à jour avec succès",
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
      setMockupColors([]);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/50 backdrop-blur-xl border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {initialData ? 'Modifier le mockup' : 'Nouveau mockup'}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {initialData 
              ? 'Modifiez les détails, les zones d\'impression et les variantes de couleur du mockup.'
              : 'Créez un nouveau mockup avec ses zones d\'impression et ses variantes de couleur.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <Tabs value={activeTabSection} onValueChange={setActiveTabSection}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="print-areas">Zones d'impression</TabsTrigger>
              <TabsTrigger value="colors">Variantes de couleurs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Première colonne */}
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
                    <Label htmlFor="svg_front_url">URL SVG avant</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="svg_front_url" 
                        className="flex-1"
                        {...register('svg_front_url')} 
                      />
                      <UploadButton 
                        onUpload={handleSvgFrontUpload} 
                        size="icon"
                        targetFolder="mockups"
                        acceptTypes=".svg,.png,.jpg,.jpeg"
                      />
                    </div>
                    {errors.svg_front_url && <p className="text-red-500 text-sm">{errors.svg_front_url.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="svg_back_url">URL SVG arrière (optionnel)</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="svg_back_url" 
                        className="flex-1"
                        {...register('svg_back_url')} 
                      />
                      <UploadButton 
                        onUpload={handleSvgBackUpload} 
                        size="icon"
                        targetFolder="mockups"
                        acceptTypes=".svg,.png,.jpg,.jpeg"
                      />
                    </div>
                    {errors.svg_back_url && <p className="text-red-500 text-sm">{errors.svg_back_url.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="is_active" 
                        defaultChecked
                        {...register('is_active')} 
                      />
                      <Label htmlFor="is_active">Mockup actif</Label>
                    </div>
                  </div>
                </div>
                
                {/* Deuxième colonne */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price_a3">Prix A3</Label>
                      <Input 
                        id="price_a3" 
                        type="number" 
                        step="0.01"
                        {...register('price_a3', { valueAsNumber: true })} 
                      />
                      {errors.price_a3 && <p className="text-red-500 text-sm">{errors.price_a3.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price_a4">Prix A4</Label>
                      <Input 
                        id="price_a4" 
                        type="number" 
                        step="0.01"
                        {...register('price_a4', { valueAsNumber: true })} 
                      />
                      {errors.price_a4 && <p className="text-red-500 text-sm">{errors.price_a4.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price_a5">Prix A5</Label>
                      <Input 
                        id="price_a5" 
                        type="number" 
                        step="0.01"
                        {...register('price_a5', { valueAsNumber: true })} 
                      />
                      {errors.price_a5 && <p className="text-red-500 text-sm">{errors.price_a5.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price_a6">Prix A6</Label>
                      <Input 
                        id="price_a6" 
                        type="number" 
                        step="0.01"
                        {...register('price_a6', { valueAsNumber: true })} 
                      />
                      {errors.price_a6 && <p className="text-red-500 text-sm">{errors.price_a6.message}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="text_price_front">Prix texte avant</Label>
                      <Input 
                        id="text_price_front" 
                        type="number" 
                        step="0.01"
                        {...register('text_price_front', { valueAsNumber: true })} 
                      />
                      {errors.text_price_front && <p className="text-red-500 text-sm">{errors.text_price_front.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="text_price_back">Prix texte arrière</Label>
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
            </TabsContent>
            
            <TabsContent value="print-areas" className="space-y-4 pt-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="front">Avant</TabsTrigger>
                  <TabsTrigger value="back">Arrière</TabsTrigger>
                </TabsList>
                
                <TabsContent value="front" className="space-y-4 mt-4">
                  <Button 
                    type="button" 
                    onClick={() => addPrintArea('front')}
                    variant="outline"
                    className="flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une zone avant
                  </Button>
                  
                  {printAreas.filter(area => area.side === 'front').length === 0 ? (
                    <p className="text-sm text-white/60">Aucune zone d'impression définie pour l'avant</p>
                  ) : (
                    <div className="space-y-3">
                      {printAreas.filter(area => area.side === 'front').map((area, index) => (
                        <div key={area.id} className="bg-white/10 p-4 rounded-md">
                          <div className="flex justify-between items-center mb-3">
                            <h4>Zone {index + 1}</h4>
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => removePrintArea(area.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor={`area-name-${area.id}`}>Nom</Label>
                              <Input 
                                id={`area-name-${area.id}`} 
                                value={area.name} 
                                onChange={(e) => updatePrintArea(area.id, 'name', e.target.value)}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <Label htmlFor={`area-x-${area.id}`}>X</Label>
                                <Input 
                                  id={`area-x-${area.id}`} 
                                  type="number" 
                                  value={area.x} 
                                  onChange={(e) => updatePrintArea(area.id, 'position_x', Number(e.target.value))}
                                />
                              </div>
                              
                              <div className="space-y-1">
                                <Label htmlFor={`area-y-${area.id}`}>Y</Label>
                                <Input 
                                  id={`area-y-${area.id}`} 
                                  type="number" 
                                  value={area.y} 
                                  onChange={(e) => updatePrintArea(area.id, 'position_y', Number(e.target.value))}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <Label htmlFor={`area-width-${area.id}`}>Largeur</Label>
                              <Input 
                                id={`area-width-${area.id}`} 
                                type="number" 
                                value={area.width} 
                                onChange={(e) => updatePrintArea(area.id, 'width', Number(e.target.value))}
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <Label htmlFor={`area-height-${area.id}`}>Hauteur</Label>
                              <Input 
                                id={`area-height-${area.id}`} 
                                type="number" 
                                value={area.height} 
                                onChange={(e) => updatePrintArea(area.id, 'height', Number(e.target.value))}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="back" className="space-y-4 mt-4">
                  <Button 
                    type="button" 
                    onClick={() => addPrintArea('back')}
                    variant="outline"
                    className="flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une zone arrière
                  </Button>
                  
                  {printAreas.filter(area => area.side === 'back').length === 0 ? (
                    <p className="text-sm text-white/60">Aucune zone d'impression définie pour l'arrière</p>
                  ) : (
                    <div className="space-y-3">
                      {printAreas.filter(area => area.side === 'back').map((area, index) => (
                        <div key={area.id} className="bg-white/10 p-4 rounded-md">
                          <div className="flex justify-between items-center mb-3">
                            <h4>Zone {index + 1}</h4>
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => removePrintArea(area.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor={`area-name-${area.id}`}>Nom</Label>
                              <Input 
                                id={`area-name-${area.id}`} 
                                value={area.name} 
                                onChange={(e) => updatePrintArea(area.id, 'name', e.target.value)}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <Label htmlFor={`area-x-${area.id}`}>X</Label>
                                <Input 
                                  id={`area-x-${area.id}`} 
                                  type="number" 
                                  value={area.x} 
                                  onChange={(e) => updatePrintArea(area.id, 'position_x', Number(e.target.value))}
                                />
                              </div>
                              
                              <div className="space-y-1">
                                <Label htmlFor={`area-y-${area.id}`}>Y</Label>
                                <Input 
                                  id={`area-y-${area.id}`} 
                                  type="number" 
                                  value={area.y} 
                                  onChange={(e) => updatePrintArea(area.id, 'position_y', Number(e.target.value))}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <Label htmlFor={`area-width-${area.id}`}>Largeur</Label>
                              <Input 
                                id={`area-width-${area.id}`} 
                                type="number" 
                                value={area.width} 
                                onChange={(e) => updatePrintArea(area.id, 'width', Number(e.target.value))}
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <Label htmlFor={`area-height-${area.id}`}>Hauteur</Label>
                              <Input 
                                id={`area-height-${area.id}`} 
                                type="number" 
                                value={area.height} 
                                onChange={(e) => updatePrintArea(area.id, 'height', Number(e.target.value))}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            <TabsContent value="colors" className="space-y-4 pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Variantes de couleurs</h3>
                <Button 
                  type="button" 
                  onClick={addMockupColor}
                  variant="outline"
                  className="flex items-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une couleur
                </Button>
              </div>
              
              {mockupColors.length === 0 ? (
                <p className="text-sm text-white/60">Aucune variante de couleur définie</p>
              ) : (
                <div className="space-y-4">
                  {mockupColors.map((color, index) => (
                    <MockupColorForm
                      key={index}
                      color={color}
                      index={index}
                      onChange={updateMockupColor}
                      onDelete={removeMockupColor}
                      allowDelete={mockupColors.length > 1}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (initialData ? "Mise à jour en cours..." : "Création en cours...") 
                : (initialData ? "Mettre à jour" : "Créer le mockup")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MockupForm;
