import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Product, Design, MockupColor } from '@/types/supabase.types';
import { fetchProductById, fetchMockupColorsByMockupId } from '@/services/api.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useCart } from '@/hooks/use-cart';
import { ModalPersonnalisation } from '@/components/product/ModalPersonnalisation';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [modalPersonnalisationOpen, setModalPersonnalisationOpen] = useState(false);
  const [currentViewSide, setCurrentViewSide] = useState<'front' | 'back'>('front');
  const [selectedMockup, setSelectedMockup] = useState<any>(null);
  const [selectedMockupColor, setSelectedMockupColor] = useState<MockupColor | null>(null);
  const [selectedDesignFront, setSelectedDesignFront] = useState<Design | null>(null);
  const [selectedDesignBack, setSelectedDesignBack] = useState<Design | null>(null);
  const [svgColorFront, setSvgColorFront] = useState('#000000');
  const [svgColorBack, setSvgColorBack] = useState('#000000');
  const [svgContentFront, setSvgContentFront] = useState('');
  const [svgContentBack, setSvgContentBack] = useState('');
  const [textContentFront, setTextContentFront] = useState('');
  const [textContentBack, setTextContentBack] = useState('');
  const [textFontFront, setTextFontFront] = useState('Roboto');
  const [textFontBack, setTextFontBack] = useState('Roboto');
  const [textColorFront, setTextColorFront] = useState('#000000');
  const [textColorBack, setTextColorBack] = useState('#000000');
  const [textStylesFront, setTextStylesFront] = useState({ bold: false, italic: false, underline: false });
  const [textStylesBack, setTextStylesBack] = useState({ bold: false, italic: false, underline: false });
  const [designTransformFront, setDesignTransformFront] = useState({ position: { x: 0, y: 0 }, scale: 0.5, rotation: 0 });
  const [designTransformBack, setDesignTransformBack] = useState({ position: { x: 0, y: 0 }, scale: 0.5, rotation: 0 });
  const [textTransformFront, setTextTransformFront] = useState({ position: { x: 0, y: 0 }, scale: 1, rotation: 0 });
  const [textTransformBack, setTextTransformBack] = useState({ position: { x: 0, y: 0 }, scale: 1, rotation: 0 });
  const [selectedSizeFront, setSelectedSizeFront] = useState('A4');
  const [selectedSizeBack, setSelectedSizeBack] = useState('A4');
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  
  const { addItem } = useCart();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
  });

  const { data: mockupColors = [], isLoading: isMockupColorsLoading } = useQuery({
    queryKey: ['mockupColors', selectedMockup?.id],
    queryFn: () => fetchMockupColorsByMockupId(selectedMockup?.id),
    enabled: !!selectedMockup?.id,
  });

  useEffect(() => {
    if (product?.mockups && product.mockups.length > 0) {
      setSelectedMockup(product.mockups[0]);
    }
  }, [product]);

  useEffect(() => {
    if (mockupColors && mockupColors.length > 0) {
      setSelectedMockupColor(mockupColors[0]);
    }
  }, [mockupColors]);

  const handleMockupColorSelect = (color: MockupColor) => {
    console.log('🎨 [ProductDetail] Sélection d\'une couleur de mockup:', color.color_name);
    setSelectedMockupColor(color);
  };

  const handleSvgColorChange = (color: string) => {
    console.log('🎨 [ProductDetail] Changement de couleur SVG:', color);
    if (currentViewSide === 'front') {
      setSvgColorFront(color);
    } else {
      setSvgColorBack(color);
    }
  };

  const handleSvgContentChange = (content: string) => {
    console.log('🎨 [ProductDetail] Changement de contenu SVG:', content);
    if (currentViewSide === 'front') {
      setSvgContentFront(content);
    } else {
      setSvgContentBack(content);
    }
  };

  const handleTextContentChange = (content: string) => {
    console.log('🎨 [ProductDetail] Changement de contenu texte:', content);
    if (currentViewSide === 'front') {
      setTextContentFront(content);
    } else {
      setTextContentBack(content);
    }
  };

  const handleTextFontChange = (font: string) => {
    console.log('🎨 [ProductDetail] Changement de police:', font);
    if (currentViewSide === 'front') {
      setTextFontFront(font);
    } else {
      setTextFontBack(font);
    }
  };

  const handleTextColorChange = (color: string) => {
    console.log('🎨 [ProductDetail] Changement de couleur du texte:', color);
    if (currentViewSide === 'front') {
      setTextColorFront(color);
    } else {
      setTextColorBack(color);
    }
  };

  const handleTextStylesChange = (styles: { bold: boolean; italic: boolean; underline: boolean }) => {
    console.log('🎨 [ProductDetail] Changement de style du texte:', styles);
    if (currentViewSide === 'front') {
      setTextStylesFront(styles);
    } else {
      setTextStylesBack(styles);
    }
  };

  const handleTextTransformChange = (property: string, value: any) => {
    console.log('🎨 [ProductDetail] Changement de transformation du texte:', property, value);
    if (currentViewSide === 'front') {
      setTextTransformFront(prev => ({ ...prev, [property]: value }));
    } else {
      setTextTransformBack(prev => ({ ...prev, [property]: value }));
    }
  };

  const handleDesignTransformChange = (property: string, value: any) => {
    console.log('🎨 [ProductDetail] Changement de transformation du design:', property, value);
    if (currentViewSide === 'front') {
      setDesignTransformFront(prev => ({ ...prev, [property]: value }));
    } else {
      setDesignTransformBack(prev => ({ ...prev, [property]: value }));
    }
  };

  const handleSizeChange = (size: string) => {
    console.log('🎨 [ProductDetail] Changement de taille du design:', size);
    if (currentViewSide === 'front') {
      setSelectedSizeFront(size);
    } else {
      setSelectedSizeBack(size);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const frontDesign = selectedDesignFront ? {
      design: selectedDesignFront,
      transform: designTransformFront,
      svgColor: svgColorFront,
      svgContent: svgContentFront,
      textContent: textContentFront,
      textFont: textFontFront,
      textColor: textColorFront,
      textStyles: textStylesFront,
      textTransform: textTransformFront,
      selectedSize: selectedSizeFront
    } : null;

    const backDesign = selectedDesignBack ? {
      design: selectedDesignBack,
      transform: designTransformBack,
      svgColor: svgColorBack,
      svgContent: svgContentBack,
      textContent: textContentBack,
      textFont: textFontBack,
      textColor: textColorBack,
      textStyles: textStylesBack,
      textTransform: textTransformBack,
      selectedSize: selectedSizeBack
    } : null;

    addItem({
      ...product,
      quantity: 1,
      selectedMockupColor: selectedMockupColor || undefined,
      frontDesign: frontDesign,
      backDesign: backDesign
    });

    toast({
      title: "Ajouté au panier !",
      description: "Le produit a été ajouté à votre panier avec succès.",
    })
  };

  const handleRemoveBackground = useCallback(async () => {
    if (isRemovingBackground) return;
    if (!selectedDesignFront && !selectedDesignBack) return;

    setIsRemovingBackground(true);
    const currentDesign = currentViewSide === 'front' ? selectedDesignFront : selectedDesignBack;

    try {
      const response = await fetch('/api/remove-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: currentDesign?.image_url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.result) {
        const newImageUrl = data.result;

        const newDesign: Design = {
          ...currentDesign!,
          image_url: newImageUrl,
          category: 'ai-generated-cleaned',
          updated_at: new Date().toISOString()
        };

        if (currentViewSide === 'front') {
          setSelectedDesignFront(newDesign);
        } else {
          setSelectedDesignBack(newDesign);
        }

        toast({
          title: "Fond supprimé !",
          description: "Le fond de l'image a été supprimé avec succès.",
        });
      } else {
        toast({
          title: "Erreur",
          description: "La suppression du fond a échoué.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Erreur lors de la suppression du fond:', error);
      toast({
        title: "Erreur",
        description: `La suppression du fond a échoué: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsRemovingBackground(false);
    }
  }, [selectedDesignFront, selectedDesignBack, currentViewSide, isRemovingBackground]);

  const handleSelectDesign = (design: Design) => {
    console.log('🎨 [ProductDetail] Sélection d\'un design:', design.name);
    
    if (currentViewSide === 'front') {
      setSelectedDesignFront(design);
      // Reset des autres personnalisations pour ce côté
      setTextContentFront('');
      setSvgContentFront('');
      setSvgColorFront('#000000');
    } else {
      setSelectedDesignBack(design);
      // Reset des autres personnalisations pour ce côté
      setTextContentBack('');
      setSvgContentBack('');
      setSvgColorBack('#000000');
    }
    
    // NE PAS FERMER LA MODAL - laisser modalPersonnalisationOpen = true
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📁 [ProductDetail] Upload d\'un fichier:', file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      if (imageUrl) {
        const newDesign: Design = {
          id: `upload-${Date.now()}`,
          name: file.name,
          image_url: imageUrl,
          category: 'upload',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        handleSelectDesign(newDesign);
        // NE PAS FERMER LA MODAL - laisser modalPersonnalisationOpen = true
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAIImageGenerated = (imageUrl: string, imageName: string) => {
    console.log('🤖 [ProductDetail] Image IA générée:', imageName);
    
    const newDesign: Design = {
      id: `ai-${Date.now()}`,
      name: imageName,
      image_url: imageUrl,
      category: 'ai-generated',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    handleSelectDesign(newDesign);
    // NE PAS FERMER LA MODAL - laisser modalPersonnalisationOpen = true
  };

  const handleDesignMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  const handleTextMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  if (isLoading) return <div>Chargement du produit...</div>;
  if (isError) return <div>Erreur lors du chargement du produit.</div>;
  if (!product) return <div>Produit non trouvé.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Colonne de gauche - Image produit */}
          <div>
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardContent className="p-4">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-auto rounded-lg object-contain"
                />
              </CardContent>
            </Card>
          </div>

          {/* Colonne de droite - Informations produit */}
          <div className="space-y-6">
            {/* Nom et description */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">{product.name}</h1>
              <p className="text-white/80">{product.description}</p>
            </div>

            {/* Prix et code produit */}
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold text-winshirt-purple">{product.price} €</span>
              <span className="text-sm text-white/50">Code: {product.code}</span>
            </div>

            {/* Mockup colors */}
            {mockupColors.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Couleurs disponibles</Label>
                <div className="flex flex-wrap gap-2">
                  {mockupColors.map((color) => (
                    <Button
                      key={color.id}
                      variant="outline"
                      className={`relative p-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        selectedMockupColor?.id === color.id 
                          ? 'border-winshirt-purple ring-2 ring-winshirt-purple/50' 
                          : 'border-white/20 hover:border-winshirt-purple/50'
                      }`}
                      onClick={() => handleMockupColorSelect(color)}
                    >
                      <img
                        src={color.front_image_url}
                        alt={color.color_name}
                        className="w-full h-full object-cover"
                      />
                      {selectedMockupColor?.id === color.id && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 12.88a.75.75 0 01-1.154.114l-5.258-3.78a.75.75 0 011.079-1.002l4.18 3.002 8.314-11.88a.75.75 0 011.04-.208z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantité */}
            <div className="space-y-3">
              <Label htmlFor="quantity" className="text-sm font-medium">Quantité</Label>
              <Input
                type="number"
                id="quantity"
                defaultValue={1}
                min={1}
                className="bg-black/20 border-white/20"
              />
            </div>

            {/* Bouton de personnalisation */}
            <div className="space-y-4">
              <Button 
                onClick={() => setModalPersonnalisationOpen(true)}
                className="w-full h-14 text-lg bg-gradient-to-r from-winshirt-purple to-winshirt-blue hover:opacity-90 transition-opacity"
              >
                🎨 Commencer la personnalisation
              </Button>
              
              <Button
                onClick={handleAddToCart}
                className="w-full h-14 text-lg bg-gradient-to-r from-winshirt-blue to-winshirt-purple hover:opacity-90 transition-opacity"
              >
                🛒 Ajouter au panier
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de personnalisation */}
      <ModalPersonnalisation
        open={modalPersonnalisationOpen}
        onClose={() => setModalPersonnalisationOpen(false)}
        currentViewSide={currentViewSide}
        onViewSideChange={setCurrentViewSide}
        productName={product?.name || ''}
        productImageUrl={product?.image_url}
        mockup={selectedMockup}
        selectedMockupColor={selectedMockupColor}
        mockupColors={mockupColors}
        onColorSelect={handleMockupColorSelect}
        selectedDesignFront={selectedDesignFront}
        selectedDesignBack={selectedDesignBack}
        onSelectDesign={handleSelectDesign}
        onFileUpload={handleFileUpload}
        onAIImageGenerated={handleAIImageGenerated}
        onRemoveBackground={handleRemoveBackground}
        isRemovingBackground={isRemovingBackground}
        svgColorFront={svgColorFront}
        svgColorBack={svgColorBack}
        svgContentFront={svgContentFront}
        svgContentBack={svgContentBack}
        onSvgColorChange={handleSvgColorChange}
        onSvgContentChange={handleSvgContentChange}
        textContentFront={textContentFront}
        textContentBack={textContentBack}
        textFontFront={textFontFront}
        textFontBack={textFontBack}
        textColorFront={textColorFront}
        textColorBack={textColorBack}
        textStylesFront={textStylesFront}
        textStylesBack={textStylesBack}
        textTransformFront={textTransformFront}
        textTransformBack={textTransformBack}
        onTextContentChange={handleTextContentChange}
        onTextFontChange={handleTextFontChange}
        onTextColorChange={handleTextColorChange}
        onTextStylesChange={handleTextStylesChange}
        onTextTransformChange={handleTextTransformChange}
        designTransformFront={designTransformFront}
        designTransformBack={designTransformBack}
        selectedSizeFront={selectedSizeFront}
        selectedSizeBack={selectedSizeBack}
        onDesignTransformChange={handleDesignTransformChange}
        onSizeChange={handleSizeChange}
        onDesignMouseDown={handleDesignMouseDown}
        onTextMouseDown={handleTextMouseDown}
        onTouchMove={handleTouchMove}
      />
    </div>
  );
};
