import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Product as ProductType, Mockup as MockupType, CartItem, Lottery, Design } from '@/types/supabase.types';
import { MockupWithColors, MockupColor } from '@/types/mockup.types';
import { useCart } from '@/context/CartContext';
import { ProductPreview } from '@/components/product/ProductPreview';
import { useCustomizationCapture } from '@/hooks/useCustomizationCapture';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ReloadIcon } from "@radix-ui/react-icons"
import { Palette, Star, Zap, Sparkles } from "lucide-react"
import { ModalPersonnalisation } from '@/components/product/ModalPersonnalisation';
import { LotterySelector } from '@/components/product/LotterySelector';
import { ProductColorSelector } from '@/components/product/ProductColorSelector';
import { DynamicColorMockup } from '@/components/product/DynamicColorMockup';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { removeBackground, loadImageFromUrl } from '@/services/backgroundRemoval.service';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, isLoading: cartLoading } = useCart();
  const { captureAndSaveCustomization } = useCustomizationCapture();

  // Product and mockup states
  const [product, setProduct] = useState<ProductType | null>(null);
  const [mockup, setMockup] = useState<MockupWithColors | null>(null);
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMockupLoading, setIsMockupLoading] = useState(true);

  // Product selection states
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<MockupColor | null>(null);
  const [selectedLottery, setSelectedLottery] = useState<string>('none');

  // Customization modal state
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [currentViewSide, setCurrentViewSide] = useState<'front' | 'back'>('front');
  const [validatedCustomization, setValidatedCustomization] = useState<any>(null);
  const [validatedViewSide, setValidatedViewSide] = useState<'front' | 'back'>('front');

  // Design states
  const [selectedDesignFront, setSelectedDesignFront] = useState<Design | null>(null);
  const [selectedDesignBack, setSelectedDesignBack] = useState<Design | null>(null);
  const [designTransformFront, setDesignTransformFront] = useState({
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0
  });
  const [designTransformBack, setDesignTransformBack] = useState({
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0
  });
  const [selectedSizeFront, setSelectedSizeFront] = useState('A4');
  const [selectedSizeBack, setSelectedSizeBack] = useState('A4');

  // Text states
  const [textContentFront, setTextContentFront] = useState('');
  const [textContentBack, setTextContentBack] = useState('');
  const [textFontFront, setTextFontFront] = useState('Arial');
  const [textFontBack, setTextFontBack] = useState('Arial');
  const [textColorFront, setTextColorFront] = useState('#ffffff');
  const [textColorBack, setTextColorBack] = useState('#ffffff');
  const [textStylesFront, setTextStylesFront] = useState({
    bold: false,
    italic: false,
    underline: false
  });
  const [textStylesBack, setTextStylesBack] = useState({
    bold: false,
    italic: false,
    underline: false
  });
  const [textTransformFront, setTextTransformFront] = useState({
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0
  });
  const [textTransformBack, setTextTransformBack] = useState({
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0
  });

  // SVG states
  const [svgColorFront, setSvgColorFront] = useState('#ffffff');
  const [svgColorBack, setSvgColorBack] = useState('#ffffff');
  const [svgContentFront, setSvgContentFront] = useState('');
  const [svgContentBack, setSvgContentBack] = useState('');

  // Interaction states for drag & drop
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState<'design' | 'text' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

  // Other states
  const [isAdding, setIsAdding] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);

  // Helper function to validate and convert Json to MockupColor[]
  const validateMockupColors = (colors: any): MockupColor[] => {
    if (!Array.isArray(colors)) return [];
    
    return colors.filter((color: any) => {
      return color && 
             typeof color === 'object' &&
             typeof color.name === 'string' &&
             typeof color.color_code === 'string';
    }).map((color: any) => ({
      id: color.id || undefined,
      name: color.name,
      color_code: color.color_code,
      front_image_url: color.front_image_url || '',
      back_image_url: color.back_image_url || ''
    }));
  };

  // Generate customization object
  const generateCustomization = () => {
    const frontDesign = selectedDesignFront ? {
      designId: selectedDesignFront.id,
      designUrl: selectedDesignFront.image_url,
      designName: selectedDesignFront.name,
      printSize: selectedSizeFront,
      transform: designTransformFront
    } : null;

    const backDesign = selectedDesignBack ? {
      designId: selectedDesignBack.id,
      designUrl: selectedDesignBack.image_url,
      designName: selectedDesignBack.name,
      printSize: selectedSizeBack,
      transform: designTransformBack
    } : null;

    const frontText = textContentFront ? {
      content: textContentFront,
      font: textFontFront,
      color: textColorFront,
      styles: textStylesFront,
      transform: textTransformFront
    } : null;

    const backText = textContentBack ? {
      content: textContentBack,
      font: textFontBack,
      color: textColorBack,
      styles: textStylesBack,
      transform: textTransformBack
    } : null;

    return {
      frontDesign,
      backDesign,
      frontText,
      backText,
      svgColorFront: svgColorFront !== '#ffffff' ? svgColorFront : null,
      svgColorBack: svgColorBack !== '#ffffff' ? svgColorBack : null,
      svgContentFront: svgContentFront || null,
      svgContentBack: svgContentBack || null
    };
  };

  const hasCustomization = () => {
    const customization = generateCustomization();
    return !!(customization.frontDesign || customization.backDesign ||
              customization.frontText || customization.backText ||
              customization.svgContentFront || customization.svgContentBack);
  };

  useEffect(() => {
    if (!validatedCustomization || !product) return;

    const { frontDesign, backDesign, frontText, backText } = validatedCustomization;
    const hasDesignOrText =
      frontDesign ||
      backDesign ||
      (frontText && frontText.content) ||
      (backText && backText.content);

    if (!hasDesignOrText) return;

    const timeout = setTimeout(() => {
      captureAndSaveCustomization(product.name, validatedCustomization);
    }, 300);

    return () => clearTimeout(timeout);
  }, [validatedCustomization]);

  // Drag & Drop handlers
  const handleDesignMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const currentTransform = currentViewSide === 'front' ? designTransformFront : designTransformBack;
    
    setIsDragging(true);
    setDragTarget('design');
    setDragStart({ x: clientX, y: clientY });
    setInitialPosition(currentTransform.position);
  };

  const handleTextMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const currentTransform = currentViewSide === 'front' ? textTransformFront : textTransformBack;
    
    setIsDragging(true);
    setDragTarget('text');
    setDragStart({ x: clientX, y: clientY });
    setInitialPosition(currentTransform.position);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !dragTarget) return;
    
    e.preventDefault();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    const newPosition = {
      x: initialPosition.x + deltaX,
      y: initialPosition.y + deltaY
    };
    
    if (dragTarget === 'design') {
      handleDesignTransformChange('position', newPosition);
    } else if (dragTarget === 'text') {
      handleTextTransformChange('position', newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragTarget(null);
  };

  // Add global mouse/touch event listeners
  React.useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent | TouchEvent) => {
        handleMouseMove(e as any);
      };
      
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('touchmove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('touchmove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, dragTarget, dragStart, initialPosition]);

  // Design selection handler
  const handleSelectDesign = (design: Design) => {
    if (currentViewSide === 'front') {
      setSelectedDesignFront(design);
    } else {
      setSelectedDesignBack(design);
    }
  };

  // File upload handler with better SVG support
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let imageUrl: string;

      // Handle SVG files differently so that color editing works
      if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
        const text = await file.text();
        imageUrl = `data:image/svg+xml;base64,${btoa(text)}`;
        handleSvgContentChange(text);
      } else {
        // Create a temporary URL for the uploaded file
        imageUrl = URL.createObjectURL(file);
      }

      const uploadedDesign: Design = {
        id: `upload-${Date.now()}`,
        name: file.name,
        image_url: imageUrl,
        category: 'Uploaded',
        is_active: true
      };

      handleSelectDesign(uploadedDesign);

      toast({
        title: "Image uploadée",
        description: `${file.name} a été ajoutée avec succès.`,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'uploader l'image."
      });
    }
  };

  // AI Image generation handler
  const handleAIImageGenerated = (imageUrl: string, imageName: string) => {
    const aiDesign: Design = {
      id: `ai-${Date.now()}`,
      name: imageName,
      image_url: imageUrl,
      category: 'AI Generated',
      is_active: true
    };
    handleSelectDesign(aiDesign);
    
    toast({
      title: "Image IA générée",
      description: `${imageName} a été ajoutée avec succès.`,
    });
  };

  const handleRemoveBackground = async () => {
    const currentDesign = currentViewSide === 'front' ? selectedDesignFront : selectedDesignBack;
    if (!currentDesign) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Aucun design sélectionné pour supprimer le fond."
      });
      return;
    }

    setIsRemovingBackground(true);
    try {
      console.log('Starting AI background removal for:', currentDesign.image_url);
      
      // Load the image
      const imageElement = await loadImageFromUrl(currentDesign.image_url);
      
      // Remove background using AI with better error handling
      const cleanedBlob = await removeBackground(imageElement);
      
      // Create URL for the cleaned image
      const cleanedUrl = URL.createObjectURL(cleanedBlob);

      const cleanedDesign: Design = {
        ...currentDesign,
        id: `${currentDesign.id}-ai-cleaned`,
        name: `${currentDesign.name} (Fond supprimé IA)`,
        image_url: cleanedUrl,
        category: 'AI Background Removed'
      };

      handleSelectDesign(cleanedDesign);

      toast({
        title: "Fond supprimé avec succès",
        description: "Le fond de l'image a été supprimé grâce à l'intelligence artificielle."
      });
    } catch (error) {
      console.error('Error in AI background removal:', error);
      
      let errorMessage = "Une erreur inattendue s'est produite.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Erreur IA",
        description: errorMessage
      });
    } finally {
      setIsRemovingBackground(false);
    }
  };

  // Text handlers
  const handleTextContentChange = (content: string) => {
    if (currentViewSide === 'front') {
      setTextContentFront(content);
    } else {
      setTextContentBack(content);
    }
  };

  const handleTextFontChange = (font: string) => {
    if (currentViewSide === 'front') {
      setTextFontFront(font);
    } else {
      setTextFontBack(font);
    }
  };

  const handleTextColorChange = (color: string) => {
    if (currentViewSide === 'front') {
      setTextColorFront(color);
    } else {
      setTextColorBack(color);
    }
  };

  const handleTextStylesChange = (styles: { bold: boolean; italic: boolean; underline: boolean }) => {
    if (currentViewSide === 'front') {
      setTextStylesFront(styles);
    } else {
      setTextStylesBack(styles);
    }
  };

  const handleTextTransformChange = (property: string, value: any) => {
    if (currentViewSide === 'front') {
      setTextTransformFront(prev => ({
        ...prev,
        [property]: value
      }));
    } else {
      setTextTransformBack(prev => ({
        ...prev,
        [property]: value
      }));
    }
  };

  const handleDesignTransformChange = (property: string, value: any) => {
    if (currentViewSide === 'front') {
      setDesignTransformFront(prev => ({
        ...prev,
        [property]: value
      }));
    } else {
      setDesignTransformBack(prev => ({
        ...prev,
        [property]: value
      }));
    }
  };

  const handleSizeChange = (size: string) => {
    if (currentViewSide === 'front') {
      setSelectedSizeFront(size);
    } else {
      setSelectedSizeBack(size);
    }
  };

  const handleSvgColorChange = (color: string) => {
    if (currentViewSide === 'front') {
      setSvgColorFront(color);
    } else {
      setSvgColorBack(color);
    }
  };

  const handleSvgContentChange = (content: string) => {
    if (currentViewSide === 'front') {
      setSvgContentFront(content);
    } else {
      setSvgContentBack(content);
    }
  };

  useEffect(() => {
    if (!id) {
      navigate('/products');
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (productError) throw productError;

        setProduct(productData);

        if (productData?.mockup_id) {
          fetchMockup(productData.mockup_id);
        } else {
          setIsMockupLoading(false);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer le produit."
        });
        navigate('/products');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchMockup = async (mockupId: string) => {
      setIsMockupLoading(true);
      try {
        const { data: mockupData, error: mockupError } = await supabase
          .from('mockups')
          .select('*')
          .eq('id', mockupId)
          .single();

        if (mockupError) throw mockupError;

        const transformedMockup: MockupWithColors = {
          ...mockupData,
          colors: validateMockupColors(mockupData.colors),
          print_areas: Array.isArray(mockupData.print_areas) 
            ? mockupData.print_areas 
            : []
        };

        setMockup(transformedMockup);
        
        if (transformedMockup.colors && transformedMockup.colors.length > 0) {
          setSelectedColor(transformedMockup.colors[0]);
        }
      } catch (error) {
        console.error('Error fetching mockup:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer le mockup."
        });
      } finally {
        setIsMockupLoading(false);
      }
    };

    const fetchLotteries = async () => {
      try {
        const { data: lotteriesData, error: lotteriesError } = await supabase
          .from('lotteries')
          .select('*')
          .eq('is_active', true);

        if (lotteriesError) throw lotteriesError;

        setLotteries(lotteriesData || []);
      } catch (error) {
        console.error('Error fetching lotteries:', error);
      }
    };

    fetchProduct();
    fetchLotteries();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setIsAdding(true);
      
      const customization = hasCustomization() ? generateCustomization() : null;
      
      const cartItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image_url: product.image_url,
        size: selectedSize,
        color: selectedColor?.name || product.color,
        available_sizes: product.available_sizes,
        available_colors: product.available_colors,
        lotteries: (product.tickets_offered && product.tickets_offered > 0) ? lotteries : [],
        customization: customization
      };

      await addItem(cartItem);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier."
      });
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow mt-16 pb-20">
          <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-lg">Chargement du produit...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow mt-16 pb-20">
          <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-8 text-center">
                <p className="text-white text-lg">Produit non trouvé.</p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        <div className="container mx-auto px-4 py-8">
          {/* Layout mobile-first vertical, puis horizontal sur large screens */}
          <div className="flex flex-col lg:flex-row gap-8 lg:h-[calc(100vh-200px)]">
            
            {/* Left Column - Image fixe (sur desktop) */}
            <div className="lg:w-1/2 lg:sticky lg:top-32 lg:self-start">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 overflow-hidden h-full lg:min-h-[calc(100vh-200px)]">
                <CardContent className="p-6 h-full">
                  <div className="space-y-4 h-full">
                    <AspectRatio ratio={1 / 1} className="w-full" data-capture-element>
                      {validatedCustomization ? (
                        <ProductPreview
                          productName={product.name}
                          productImageUrl={product.image_url}
                          currentViewSide={validatedViewSide}
                          onViewSideChange={setValidatedViewSide}
                          mockup={mockup}
                          selectedMockupColor={validatedCustomization.mockupColor}
                          hasTwoSides={mockup?.svg_back_url ? true : false}
                          selectedDesignFront={validatedCustomization.frontDesign}
                          selectedDesignBack={validatedCustomization.backDesign}
                          designTransformFront={validatedCustomization.designTransformFront}
                          designTransformBack={validatedCustomization.designTransformBack}
                          svgColorFront={svgColorFront}
                          svgColorBack={svgColorBack}
                          svgContentFront={svgContentFront}
                          svgContentBack={svgContentBack}
                          textContentFront={validatedCustomization.frontText?.content || ''}
                          textContentBack={validatedCustomization.backText?.content || ''}
                          textFontFront={validatedCustomization.frontText?.font || 'Arial'}
                          textFontBack={validatedCustomization.backText?.font || 'Arial'}
                          textColorFront={validatedCustomization.frontText?.color || '#000000'}
                          textColorBack={validatedCustomization.backText?.color || '#000000'}
                          textStylesFront={validatedCustomization.frontText?.styles || { bold: false, italic: false, underline: false }}
                          textStylesBack={validatedCustomization.backText?.styles || { bold: false, italic: false, underline: false }}
                          textTransformFront={validatedCustomization.frontText?.transform || { position: { x: 0, y: 0 }, scale: 1, rotation: 0 }}
                          textTransformBack={validatedCustomization.backText?.transform || { position: { x: 0, y: 0 }, scale: 1, rotation: 0 }}
                        />
                      ) : mockup && selectedColor ? (
                        <DynamicColorMockup
                          baseImageUrl={mockup.svg_front_url || product.image_url}
                          selectedColor={selectedColor}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </AspectRatio>
                    
                    {/* Boutons recto/verso si personnalisation validée */}
                    {validatedCustomization && mockup?.svg_back_url && (
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant={validatedViewSide === 'front' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setValidatedViewSide('front')}
                        >
                          Recto
                        </Button>
                        <Button
                          variant={validatedViewSide === 'back' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setValidatedViewSide('back')}
                        >
                          Verso
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Contenu scrollable */}
            <div className="lg:w-1/2 lg:overflow-y-auto lg:max-h-[calc(100vh-200px)] space-y-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
                    {product.name}
                    {product.tickets_offered && product.tickets_offered > 0 && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-0 animate-pulse">
                        <Star className="h-4 w-4 mr-1" />
                        {product.tickets_offered} tickets
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-white">
                      {product.price.toFixed(2)} €
                    </span>
                    {hasCustomization() && (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/50 animate-pulse">
                        <Sparkles className="h-4 w-4 mr-1" />
                        Personnalisé
                      </Badge>
                    )}
                  </div>

                  {/* Mockup Color Selector */}
                  {mockup && mockup.colors && mockup.colors.length > 0 && (
                    <ProductColorSelector
                      colors={mockup.colors}
                      selectedColor={selectedColor}
                      onColorSelect={setSelectedColor}
                      className="mb-6"
                    />
                  )}

                  {/* Size Selector */}
                  {product.available_sizes && product.available_sizes.length > 0 && (
                    <div>
                      <Label className="text-white font-medium mb-3 block">Taille:</Label>
                      <div className="flex flex-wrap gap-2">
                        {product.available_sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                              selectedSize === size 
                                ? 'border-purple-400 bg-purple-400/20 text-white shadow-lg shadow-purple-400/25' 
                                : 'border-white/30 bg-white/10 text-gray-300 hover:border-white/50 hover:bg-white/20'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lottery Selection */}
                  <LotterySelector
                    lotteries={lotteries}
                    selectedLottery={selectedLottery}
                    onLotteryChange={setSelectedLottery}
                    ticketsOffered={product.tickets_offered || 0}
                  />

                  {/* Quantity Input */}
                  <div>
                    <Label htmlFor="quantity" className="text-white font-medium mb-3 block">
                      Quantité:
                    </Label>
                    <Input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      min="1"
                      className="w-24 bg-white/10 border-white/30 text-white"
                    />
                  </div>

                  {/* Customization Button */}
                  {product.is_customizable && (
                    <Button
                      variant="outline"
                      onClick={() => setIsCustomizationModalOpen(true)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white font-semibold py-3 transition-all duration-200 transform hover:scale-105"
                    >
                      <Palette className="mr-2 h-5 w-5" />
                      <Zap className="mr-2 h-4 w-4" />
                      Personnaliser ce produit
                    </Button>
                  )}

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 text-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/25"
                  >
                    {isAdding ? (
                      <>
                        <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />
                        Ajout au panier...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Ajouter au panier
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Customization Modal */}
          {product.is_customizable && isCustomizationModalOpen && (
            <ModalPersonnalisation
              open={isCustomizationModalOpen}
              onClose={() => setIsCustomizationModalOpen(false)}
              onValidate={() => {
                // Capturer l'état actuel de la personnalisation
                const currentCustomization = {
                  frontDesign: selectedDesignFront,
                  backDesign: selectedDesignBack,
                  frontText: textContentFront ? {
                    content: textContentFront,
                    font: textFontFront,
                    color: textColorFront,
                    styles: textStylesFront,
                    transform: textTransformFront
                  } : null,
                  backText: textContentBack ? {
                    content: textContentBack,
                    font: textFontBack,
                    color: textColorBack,
                    styles: textStylesBack,
                    transform: textTransformBack
                  } : null,
                  designTransformFront,
                  designTransformBack,
                  selectedSizeFront,
                  selectedSizeBack,
                  mockupColor: selectedColor
                };
                
                setValidatedCustomization(currentCustomization);
                
                setIsCustomizationModalOpen(false);
                console.log('✅ Personnalisation validée et sauvegardée:', currentCustomization);
              }}
              currentViewSide={currentViewSide}
              onViewSideChange={setCurrentViewSide}
              productName={product.name}
              productImageUrl={product.image_url}
              productAvailableColors={product.available_colors}
              mockup={mockup}
              selectedMockupColor={selectedColor}
              onMockupColorChange={setSelectedColor}
              selectedDesignFront={selectedDesignFront}
              selectedDesignBack={selectedDesignBack}
              onSelectDesign={handleSelectDesign}
              setSelectedDesignFront={setSelectedDesignFront}
              setSelectedDesignBack={setSelectedDesignBack}
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
              onTouchMove={handleMouseMove}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
