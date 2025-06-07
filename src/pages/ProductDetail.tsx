import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ShoppingCart, Star, Package, Palette, Shirt, Award } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useCart } from '@/context/CartContext';
import { fetchProductById, fetchMockupById, fetchAllLotteries } from '@/services/api.service';
import { Product, Design, Lottery } from '@/types/supabase.types';
import { MockupColor } from '@/types/mockup.types';
import { ModalPersonnalisation } from '@/components/product/ModalPersonnalisation';
import { LotterySelectionRequired } from '@/components/product/LotterySelectionRequired';
import { useMockupCapture } from '@/hooks/useMockupCapture';
import { useScrollReset } from '@/hooks/useScrollReset';
import { useHDCaptureOnAddToCart } from '@/hooks/useHDCaptureOnAddToCart';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const ProductDetail: React.FC = () => {
  useScrollReset();
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  // Basic states
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [mockup, setMockup] = useState<any>(null);
  const [selectedMockupColor, setSelectedMockupColor] = useState<MockupColor | null>(null);
  const [currentViewSide, setCurrentViewSide] = useState<'front' | 'back'>('front');
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedLotteries, setSelectedLotteries] = useState<string[]>([]);
  const [showLotteryError, setShowLotteryError] = useState(false);

  // Design state - using local state since useDesignState doesn't exist
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
  const [selectedSizeFront, setSelectedSizeFront] = useState<string>('A4');
  const [selectedSizeBack, setSelectedSizeBack] = useState<string>('A4');
  const [svgColorFront, setSvgColorFront] = useState<string>('#000000');
  const [svgColorBack, setSvgColorBack] = useState<string>('#000000');
  const [svgContentFront, setSvgContentFront] = useState<string>('');
  const [svgContentBack, setSvgContentBack] = useState<string>('');
  const [textContentFront, setTextContentFront] = useState<string>('');
  const [textContentBack, setTextContentBack] = useState<string>('');
  const [textFontFront, setTextFontFront] = useState<string>('Arial');
  const [textFontBack, setTextFontBack] = useState<string>('Arial');
  const [textColorFront, setTextColorFront] = useState<string>('#000000');
  const [textColorBack, setTextColorBack] = useState<string>('#000000');
  const [textStylesFront, setTextStylesFront] = useState({ bold: false, italic: false, underline: false });
  const [textStylesBack, setTextStylesBack] = useState({ bold: false, italic: false, underline: false });
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
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);

  // HD Capture hook
  const { captureForProduction, isCapturing } = useHDCaptureOnAddToCart();

  // API queries
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id
  });

  const { data: lotteries, isLoading: isLoadingLotteries } = useQuery({
    queryKey: ['lotteries'],
    queryFn: fetchAllLotteries
  });

  // Load mockup when product is available
  useEffect(() => {
    const loadMockup = async () => {
      if (product?.mockup_id) {
        try {
          console.log(`Fetching mockup with id ${product.mockup_id}...`);
          const mockupData = await fetchMockupById(product.mockup_id);
          console.log(`Mockup with id ${product.mockup_id} fetched successfully:`, mockupData);
          setMockup(mockupData);
          
          if (mockupData?.colors && mockupData.colors.length > 0) {
            setSelectedMockupColor(mockupData.colors[0]);
          }
        } catch (error) {
          console.error('Error loading mockup:', error);
        }
      }
    };

    loadMockup();
  }, [product?.mockup_id]);

  // Initialize selected values when product loads
  useEffect(() => {
    if (product) {
      if (product.available_colors && product.available_colors.length > 0) {
        setSelectedColor(product.available_colors[0]);
      }
      if (product.available_sizes && product.available_sizes.length > 0) {
        setSelectedSize(product.available_sizes[0]);
      }
    }
  }, [product]);

  // Design state handlers
  const onSelectDesign = useCallback((design: Design) => {
    if (currentViewSide === 'front') {
      setSelectedDesignFront(design);
    } else {
      setSelectedDesignBack(design);
    }
  }, [currentViewSide]);

  const onDesignTransformChange = useCallback((property: string, value: any) => {
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
  }, [currentViewSide]);

  const onTextTransformChange = useCallback((property: string, value: any) => {
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
  }, [currentViewSide]);

  const onSizeChange = useCallback((size: string) => {
    if (currentViewSide === 'front') {
      setSelectedSizeFront(size);
    } else {
      setSelectedSizeBack(size);
    }
  }, [currentViewSide]);

  const onSvgColorChange = useCallback((color: string) => {
    if (currentViewSide === 'front') {
      setSvgColorFront(color);
    } else {
      setSvgColorBack(color);
    }
  }, [currentViewSide]);

  const onSvgContentChange = useCallback((content: string) => {
    if (currentViewSide === 'front') {
      setSvgContentFront(content);
    } else {
      setSvgContentBack(content);
    }
  }, [currentViewSide]);

  const onTextContentChange = useCallback((content: string) => {
    if (currentViewSide === 'front') {
      setTextContentFront(content);
    } else {
      setTextContentBack(content);
    }
  }, [currentViewSide]);

  const onTextFontChange = useCallback((font: string) => {
    if (currentViewSide === 'front') {
      setTextFontFront(font);
    } else {
      setTextFontBack(font);
    }
  }, [currentViewSide]);

  const onTextColorChange = useCallback((color: string) => {
    if (currentViewSide === 'front') {
      setTextColorFront(color);
    } else {
      setTextColorBack(color);
    }
  }, [currentViewSide]);

  const onTextStylesChange = useCallback((styles: { bold: boolean; italic: boolean; underline: boolean }) => {
    if (currentViewSide === 'front') {
      setTextStylesFront(styles);
    } else {
      setTextStylesBack(styles);
    }
  }, [currentViewSide]);

  const onFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic
      console.log('File upload:', file, currentViewSide);
    }
  }, [currentViewSide]);

  const onAIImageGenerated = useCallback((imageUrl: string, side: 'front' | 'back') => {
    // Handle AI image generation
    console.log('AI image generated:', imageUrl, side);
  }, []);

  const onRemoveBackground = useCallback(() => {
    setIsRemovingBackground(true);
    // Handle background removal
    setTimeout(() => setIsRemovingBackground(false), 2000);
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (!product) return;

    // Validation obligatoire des loteries
    if (product.tickets_offered > 0 && selectedLotteries.length === 0) {
      setShowLotteryError(true);
      toast({
        title: "Loterie requise",
        description: "Veuillez sélectionner au moins une loterie pour ce produit.",
        variant: "destructive",
      });
      return;
    }

    setShowLotteryError(false);

    console.log('🎨 [ProductDetail] Personnalisation détectée, génération des fichiers HD...');

    try {
      const enrichedData = await captureForProduction();

      const itemToAdd = {
        productId: product.id,
        name: product.name,
        price: calculateTotalPrice(),
        quantity,
        color: selectedColor,
        size: selectedSize,
        image_url: product.image_url,
        customization: {
          frontDesign: selectedDesignFront ? {
            designId: selectedDesignFront.id,
            designName: selectedDesignFront.name,
            designUrl: selectedDesignFront.image_url,
            printSize: selectedSizeFront,
            transform: designTransformFront
          } : null,
          backDesign: selectedDesignBack ? {
            designId: selectedDesignBack.id,
            designName: selectedDesignBack.name,
            designUrl: selectedDesignBack.image_url,
            printSize: selectedSizeBack,
            transform: designTransformBack
          } : null,
          hdRectoUrl: enrichedData.hdRectoUrl,
          hdVersoUrl: enrichedData.hdVersoUrl,
          hdCaptureTimestamp: new Date().toISOString()
        },
        available_colors: product.available_colors,
        available_sizes: product.available_sizes,
        lottery_selections: selectedLotteries
      };

      console.log('Starting addItem function with item:', JSON.stringify(itemToAdd, null, 2));
      
      await addItem(itemToAdd);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout au panier",
        variant: "destructive",
      });
    }
  }, [
    product, 
    selectedLotteries,
    selectedColor, 
    selectedSize, 
    quantity, 
    selectedDesignFront, 
    selectedDesignBack, 
    designTransformFront, 
    designTransformBack,
    selectedSizeFront,
    selectedSizeBack,
    captureForProduction,
    addItem,
    calculateTotalPrice
  ]);

  const calculateTotalPrice = useCallback(() => {
    if (!product || !mockup) return 0;
    
    let basePrice = product.price;
    let designPrice = 0;
    let textPrice = 0;

    // Calculate design prices
    if (selectedDesignFront) {
      const frontSizePrice = selectedSizeFront === 'A3' ? mockup.price_a3 :
                           selectedSizeFront === 'A4' ? mockup.price_a4 :
                           selectedSizeFront === 'A5' ? mockup.price_a5 :
                           mockup.price_a6;
      designPrice += frontSizePrice;
    }

    if (selectedDesignBack) {
      const backSizePrice = selectedSizeBack === 'A3' ? mockup.price_a3 :
                          selectedSizeBack === 'A4' ? mockup.price_a4 :
                          selectedSizeBack === 'A5' ? mockup.price_a5 :
                          mockup.price_a6;
      designPrice += backSizePrice;
    }

    // Calculate text prices
    if (textContentFront) {
      textPrice += mockup.text_price_front;
    }
    if (textContentBack) {
      textPrice += mockup.text_price_back;
    }

    return basePrice + designPrice + textPrice;
  }, [product, mockup, selectedDesignFront, selectedDesignBack, selectedSizeFront, selectedSizeBack, textContentFront, textContentBack]);

  const handleLotteryToggle = (lotteryId: string) => {
    setSelectedLotteries(prev => {
      if (prev.includes(lotteryId)) {
        return prev.filter(id => id !== lotteryId);
      } else {
        return [...prev, lotteryId];
      }
    });
    setShowLotteryError(false);
  };

  const hasTwoSides = mockup?.svg_back_url ? true : false;

  if (isLoadingProduct) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow mt-16 pb-20">
          <div className="container mx-auto px-4 py-20 text-center">
            <LoadingSpinner />
            <p className="mt-4 text-white/60">Chargement du produit...</p>
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
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Produit non trouvé</h1>
            <p className="text-white/60 mb-8">Le produit que vous recherchez n'existe pas.</p>
            <Button onClick={() => navigate('/products')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux produits
            </Button>
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
        <div className="container mx-auto px-4 py-10">
          <Button
            variant="ghost"
            onClick={() => navigate('/products')}
            className="mb-6 text-white hover:text-white/80"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux produits
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-6">
              <GlassCard className="p-6">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-auto rounded-lg"
                />
              </GlassCard>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  {product.tickets_offered > 0 && (
                    <Badge variant="default" className="bg-gradient-to-r from-winshirt-purple to-winshirt-blue">
                      <Award className="w-3 h-3 mr-1" />
                      {product.tickets_offered} ticket{product.tickets_offered > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                <p className="text-lg text-white/80 mb-6">{product.description}</p>
                <div className="text-3xl font-bold text-green-400 mb-6">
                  {calculateTotalPrice()}€
                </div>
              </div>

              {/* Lottery Selection */}
              {product.tickets_offered > 0 && (
                <GlassCard className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Sélection des loteries *
                  </h3>
                  <p className="text-white/70 mb-4">
                    Ce produit offre {product.tickets_offered} ticket{product.tickets_offered > 1 ? 's' : ''} de loterie. 
                    Sélectionnez au moins une loterie pour participer.
                  </p>
                  
                  <LotterySelectionRequired show={showLotteryError} />
                  
                  {isLoadingLotteries ? (
                    <div className="text-center py-4">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
                      {lotteries && Array.isArray(lotteries) && lotteries.map((lottery) => (
                        <div
                          key={lottery.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedLotteries.includes(lottery.id)
                              ? 'border-winshirt-purple bg-winshirt-purple/10'
                              : 'border-white/20 hover:border-white/40'
                          }`}
                          onClick={() => handleLotteryToggle(lottery.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{lottery.title}</h4>
                              <p className="text-sm text-white/60">Valeur: {lottery.value}€</p>
                            </div>
                            <div className={`w-4 h-4 rounded border ${
                              selectedLotteries.includes(lottery.id)
                                ? 'bg-winshirt-purple border-winshirt-purple'
                                : 'border-white/40'
                            }`}>
                              {selectedLotteries.includes(lottery.id) && (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              )}

              {/* Product Options */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold mb-4">Options du produit</h3>
                
                <div className="space-y-4">
                  {/* Color Selection */}
                  {product.available_colors && product.available_colors.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Couleur</label>
                      <Select value={selectedColor} onValueChange={setSelectedColor}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une couleur" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.available_colors.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Size Selection */}
                  {product.available_sizes && product.available_sizes.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Taille</label>
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une taille" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.available_sizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantité</label>
                    <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </GlassCard>

              {/* Customization */}
              {product.is_customizable && (
                <GlassCard className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Personnalisation
                  </h3>
                  <p className="text-white/70 mb-4">
                    Ajoutez vos propres designs, textes et couleurs à ce produit.
                  </p>
                  <Button
                    onClick={() => setShowCustomization(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <Palette className="mr-2 h-4 w-4" />
                    Personnaliser le produit
                  </Button>
                </GlassCard>
              )}

              {/* Add to Cart */}
              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-winshirt-purple to-winshirt-blue hover:opacity-90 text-white font-semibold py-3"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Ajouter au panier - {calculateTotalPrice()}€
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Customization Modal */}
      {showCustomization && (
        <ModalPersonnalisation
          open={showCustomization}
          onClose={() => setShowCustomization(false)}
          currentViewSide={currentViewSide}
          onViewSideChange={setCurrentViewSide}
          productName={product.name}
          productImageUrl={product.image_url}
          productAvailableColors={product.available_colors}
          mockup={mockup}
          selectedMockupColor={selectedMockupColor}
          onMockupColorChange={setSelectedMockupColor}
          selectedDesignFront={selectedDesignFront}
          selectedDesignBack={selectedDesignBack}
          onSelectDesign={onSelectDesign}
          onFileUpload={onFileUpload}
          onAIImageGenerated={onAIImageGenerated}
          onRemoveBackground={onRemoveBackground}
          isRemovingBackground={isRemovingBackground}
          svgColorFront={svgColorFront}
          svgColorBack={svgColorBack}
          svgContentFront={svgContentFront}
          svgContentBack={svgContentBack}
          onSvgColorChange={onSvgColorChange}
          onSvgContentChange={onSvgContentChange}
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
          onTextContentChange={onTextContentChange}
          onTextFontChange={onTextFontChange}
          onTextColorChange={onTextColorChange}
          onTextStylesChange={onTextStylesChange}
          onTextTransformChange={onTextTransformChange}
          designTransformFront={designTransformFront}
          designTransformBack={designTransformBack}
          selectedSizeFront={selectedSizeFront}
          selectedSizeBack={selectedSizeBack}
          onDesignTransformChange={onDesignTransformChange}
          onSizeChange={onSizeChange}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
