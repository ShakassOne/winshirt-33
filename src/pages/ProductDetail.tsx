import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Minus, ShoppingCart, Palette } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { fetchProductById, fetchMockupById } from '@/services/api.service';
import { Product, Design } from '@/types/supabase.types';
import { MockupColor } from '@/types/mockup.types';
import { useCart } from '@/context/CartContext';
import { ModalPersonnalisation } from '@/components/product/ModalPersonnalisation';
import { LotterySelectionRequired } from '@/components/product/LotterySelectionRequired';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedDesignFront, setSelectedDesignFront] = useState<Design | null>(null);
  const [selectedDesignBack, setSelectedDesignBack] = useState<Design | null>(null);
  const [svgColorFront, setSvgColorFront] = useState('#000000');
  const [svgColorBack, setSvgColorBack] = useState('#000000');
  const [svgContentFront, setSvgContentFront] = useState('');
  const [svgContentBack, setSvgContentBack] = useState('');
  const [textContentFront, setTextContentFront] = useState('');
  const [textContentBack, setTextContentBack] = useState('');
  const [textFontFront, setTextFontFront] = useState('Arial');
  const [textFontBack, setTextFontBack] = useState('Arial');
  const [textColorFront, setTextColorFront] = useState('#000000');
  const [textColorBack, setTextColorBack] = useState('#000000');
  const [textStylesFront, setTextStylesFront] = useState({ bold: false, italic: false, underline: false });
  const [textStylesBack, setTextStylesBack] = useState({ bold: false, italic: false, underline: false });
  const [designTransformFront, setDesignTransformFront] = useState({ position: { x: 0, y: 0 }, scale: 1, rotation: 0 });
  const [designTransformBack, setDesignTransformBack] = useState({ position: { x: 0, y: 0 }, scale: 1, rotation: 0 });
  const [textTransformFront, setTextTransformFront] = useState({ position: { x: 0, y: 0 }, scale: 1, rotation: 0 });
  const [textTransformBack, setTextTransformBack] = useState({ position: { x: 0, y: 0 }, scale: 1, rotation: 0 });
  const [selectedSizeFront, setSelectedSizeFront] = useState('medium');
  const [selectedSizeBack, setSelectedSizeBack] = useState('medium');
  const [selectedMockupColor, setSelectedMockupColor] = useState<MockupColor | null>(null);
  const [currentViewSide, setCurrentViewSide] = useState<'front' | 'back'>('front');
  const [showLotteryModal, setShowLotteryModal] = useState(false);
  const [selectedLottery, setSelectedLottery] = useState<string | null>(null);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleDesignSelect = (design: Design) => {
    if (currentViewSide === 'front') {
      setSelectedDesignFront(design);
    } else {
      setSelectedDesignBack(design);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (currentViewSide === 'front') {
        setSvgContentFront(base64String);
        setSelectedDesignFront(null);
      } else {
        setSvgContentBack(base64String);
        setSelectedDesignBack(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAIImageGenerated = (imageUrl: string, imageName: string) => {
    if (currentViewSide === 'front') {
      setSvgContentFront(imageUrl);
      setSelectedDesignFront(null);
    } else {
      setSvgContentBack(imageUrl);
      setSelectedDesignBack(null);
    }
  };

  const handleRemoveBackground = async () => {
    setIsRemovingBackground(true);
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRemovingBackground(false);
    toast({
      title: "Fond supprimé",
      description: "Le fond de l'image a été supprimé (mock).",
    });
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

  const handleDesignTransformChange = (property: string, value: any) => {
    if (currentViewSide === 'front') {
      setDesignTransformFront(prev => ({ ...prev, [property]: value }));
    } else {
      setDesignTransformBack(prev => ({ ...prev, [property]: value }));
    }
  };

  const handleTextTransformChange = (property: string, value: any) => {
    if (currentViewSide === 'front') {
      setTextTransformFront(prev => ({ ...prev, [property]: value }));
    } else {
      setTextTransformBack(prev => ({ ...prev, [property]: value }));
    }
  };

  const handleSizeChange = (size: string) => {
    if (currentViewSide === 'front') {
      setSelectedSizeFront(size);
    } else {
      setSelectedSizeBack(size);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.tickets_offered > 0 && !selectedLottery) {
      setShowLotteryModal(true);
      return;
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity,
      size: selectedSize,
      color: selectedMockupColor?.name || selectedColor,
      available_sizes: product.available_sizes,
      available_colors: product.available_colors,
      customization: {
        frontDesign: selectedDesignFront,
        backDesign: selectedDesignBack,
        frontText: textContentFront,
        backText: textContentBack,
        frontTextFont: textFontFront,
        backTextFont: textFontBack,
        frontTextColor: textColorFront,
        backTextColor: textColorBack,
        frontTextStyles: textStylesFront,
        backTextStyles: textStylesBack,
        frontTextTransform: textTransformFront,
        backTextTransform: textTransformBack,
        frontDesignTransform: designTransformFront,
        backDesignTransform: designTransformBack,
        frontSvgColor: svgColorFront,
        backSvgColor: svgColorBack,
        frontSvgContent: svgContentFront,
        backSvgContent: svgContentBack,
        mockupColor: selectedMockupColor,
        mockup: mockup
      },
      lottery: selectedLottery,
      tickets: product.tickets_offered
    };

    addItem(cartItem);
    toast({
      title: "Produit ajouté",
      description: `${product.name} a été ajouté au panier`,
    });
  };

  const handleLotterySelect = (lottery: string) => {
    setSelectedLottery(lottery);
    setShowLotteryModal(false);
  };

  const handleCloseLotteryModal = () => {
    setShowLotteryModal(false);
  };

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string)
  });

  const { data: mockup } = useQuery({
    queryKey: ['mockup', product?.mockup_id],
    queryFn: () => fetchMockupById(product?.mockup_id as string),
    enabled: !!product?.mockup_id
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-10">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <LoadingSpinner />
            </div>
          ) : !product ? (
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
              <p className="text-muted-foreground">Le produit que vous recherchez n'existe pas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {/* Product Image */}
              <GlassCard className="p-6">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-auto rounded-lg object-cover aspect-square"
                />
              </GlassCard>

              {/* Product Info */}
              <div className="space-y-6">
                <GlassCard className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                      <p className="text-2xl font-bold text-green-400 mb-4">
                        {product.price}€
                      </p>
                      {product.tickets_offered > 0 && (
                        <Badge variant="secondary" className="mb-4">
                          +{product.tickets_offered} ticket{product.tickets_offered > 1 ? 's' : ''} de loterie
                        </Badge>
                      )}
                    </div>

                    <p className="text-muted-foreground">{product.description}</p>

                    {/* Size Selection */}
                    {product.available_sizes && product.available_sizes.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-lg font-medium">Taille</h4>
                        <div className="flex items-center gap-2">
                          {product.available_sizes.map((size) => (
                            <Button
                              key={size}
                              variant={selectedSize === size ? "default" : "outline"}
                              onClick={() => handleSizeSelect(size)}
                            >
                              {size}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Color Selection */}
                    {product.available_colors && product.available_colors.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-lg font-medium">Couleur</h4>
                        <div className="flex items-center gap-2">
                          {product.available_colors.map((color) => (
                            <Button
                              key={color}
                              variant={selectedColor === color ? "default" : "outline"}
                              onClick={() => handleColorSelect(color)}
                            >
                              {color}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity and Add to Cart */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">Quantité:</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={decreaseQuantity}
                            disabled={quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={increaseQuantity}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-3">
                        <AnimatedButton onClick={handleAddToCart} className="w-full">
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Ajouter au panier
                        </AnimatedButton>
                        
                        {product.is_customizable && (
                          <AnimatedButton onClick={() => setShowCustomization(true)} className="w-full">
                            <Palette className="h-5 w-5 mr-2" />
                            Personnaliser
                          </AnimatedButton>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Product Features */}
                <GlassCard className="p-6">
                  <h4 className="text-lg font-medium mb-2">Caractéristiques</h4>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>Livraison rapide</li>
                    <li>Paiement sécurisé</li>
                    <li>Satisfait ou remboursé</li>
                  </ul>
                </GlassCard>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />

      {/* Customization Modal */}
      <ModalPersonnalisation
        open={showCustomization}
        onClose={() => setShowCustomization(false)}
        currentViewSide={currentViewSide}
        onViewSideChange={setCurrentViewSide}
        productName={product?.name || ''}
        productImageUrl={product?.image_url}
        productAvailableColors={product?.available_colors}
        mockup={mockup}
        selectedMockupColor={selectedMockupColor}
        onMockupColorChange={setSelectedMockupColor}
        selectedDesignFront={selectedDesignFront}
        selectedDesignBack={selectedDesignBack}
        onSelectDesign={handleDesignSelect}
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
      />

      {/* Lottery Selection Modal */}
      <LotterySelectionRequired
        open={showLotteryModal}
        onClose={handleCloseLotteryModal}
        onLotterySelect={handleLotterySelect}
      />
    </div>
  );
};

export default ProductDetail;
