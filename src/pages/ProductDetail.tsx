import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from "@/components/ui/slider"
import { useToast } from '@/hooks/use-toast';
import { fetchProductById } from '@/services/api.service';
import { Product } from '@/types/supabase.types';
import { ShoppingCart, Palette } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import CaptureMockupButton from '@/components/product/CaptureMockupButton';
import { CustomizationModal } from '@/components/product/CustomizationModal';

interface ProductDetailProps {}

const ProductDetail: React.FC<ProductDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [currentSide, setCurrentSide] = useState<'front' | 'back'>('front');
  const [selectedDesign, setSelectedDesign] = useState<any>(null);
  const [customImage, setCustomImage] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [svgColor, setSvgColor] = useState<string>('#000000');
  const [svgContent, setSvgContent] = useState<string>('');
  const [designPosition, setDesignPosition] = useState({ x: 50, y: 50 });
  const [designSize, setDesignSize] = useState({ width: 100, height: 100 });
  const [mockupSettings, setMockupSettings] = useState({ backgroundColor: '#ffffff' });
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

  const mockupRef = useRef<HTMLDivElement>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string)
  });

  useEffect(() => {
    console.log('🎨 Design sélectionné:', selectedDesign);
  }, [selectedDesign]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      ...product,
      quantity,
      customizations: {
        side: currentSide,
        design: selectedDesign,
        customImage,
        customText,
        svgColor,
      },
    });

    toast({
      title: "Ajouté au panier",
      description: `${product.name} x${quantity} a été ajouté à votre panier.`,
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleDesignPositionChange = (axis: 'x' | 'y', value: number) => {
    setDesignPosition(prev => ({ ...prev, [axis]: value }));
  };

  const handleDesignSizeChange = (axis: 'width' | 'height', value: number) => {
    setDesignSize(prev => ({ ...prev, [axis]: value }));
  };

  const handleMockupBackgroundColorChange = (color: string) => {
    setMockupSettings(prev => ({ ...prev, backgroundColor: color }));
  };

  const handleCustomizationOpen = () => {
    setIsCustomizationOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        {isLoading ? (
          <div className="container mx-auto px-4 py-20 text-center">
            <LoadingSpinner />
            <p className="mt-4 text-white/60">Chargement du produit...</p>
          </div>
        ) : !product ? (
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Produit non trouvé</h1>
            <p className="text-white/60">Le produit que vous recherchez n'existe pas.</p>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Product Image and Mockup */}
              <div className="space-y-6">
                <GlassCard className="p-6">
                  <div className="space-y-4">
                    {/* Side Selection */}
                    <div className="flex justify-center">
                      <div className="flex bg-white/10 rounded-lg p-1">
                        <button
                          onClick={() => setCurrentSide('front')}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            currentSide === 'front'
                              ? 'bg-white text-black'
                              : 'text-white hover:bg-white/10'
                          }`}
                        >
                          Recto
                        </button>
                        <button
                          onClick={() => setCurrentSide('back')}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            currentSide === 'back'
                              ? 'bg-white text-black'
                              : 'text-white hover:bg-white/10'
                          }`}
                        >
                          Verso
                        </button>
                      </div>
                    </div>

                    {/* Mockup Display */}
                    <div 
                      ref={mockupRef}
                      className="relative bg-white/5 rounded-lg p-4 min-h-[400px] flex items-center justify-center"
                      style={{ backgroundColor: mockupSettings.backgroundColor }}
                    >
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                      />
                      
                      {selectedDesign && (
                        <div 
                          className="absolute"
                          style={{
                            top: `${designPosition.y}%`,
                            left: `${designPosition.x}%`,
                            transform: 'translate(-50%, -50%)',
                            width: `${designSize.width}px`,
                            height: `${designSize.height}px`,
                          }}
                        >
                          {svgContent ? (
                            <div dangerouslySetInnerHTML={{ __html: svgContent }} />
                          ) : (
                            <img
                              src={selectedDesign.image_url}
                              alt={selectedDesign.name}
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                      )}

                      {customImage && (
                        <div 
                          className="absolute"
                          style={{
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            maxWidth: '200px',
                            maxHeight: '200px',
                          }}
                        >
                          <img
                            src={customImage}
                            alt="Image personnalisée"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      )}

                      {customText && (
                        <div 
                          className="absolute text-center"
                          style={{
                            top: '70%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            maxWidth: '80%',
                          }}
                        >
                          <span className="text-black font-semibold text-lg">{customText}</span>
                        </div>
                      )}
                    </div>

                    {/* Customization Button */}
                    <Button
                      onClick={handleCustomizationOpen}
                      className="w-full bg-gradient-to-r from-winshirt-purple to-winshirt-blue hover:from-winshirt-purple/90 hover:to-winshirt-blue/90 text-white font-semibold py-3"
                      size="lg"
                    >
                      <Palette className="h-5 w-5 mr-2" />
                      Personnaliser votre produit
                    </Button>

                    {/* Capture Button */}
                    <CaptureMockupButton
                      targetId="mockup-container"
                      side={currentSide === 'front' ? 'recto' : 'verso'}
                      className="w-full"
                    />
                  </div>
                </GlassCard>
              </div>

              {/* Right Column - Product Details */}
              <div className="space-y-6">
                <GlassCard className="p-6 space-y-4">
                  <h1 className="text-3xl font-bold text-white">{product.name}</h1>
                  <p className="text-white/70">{product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-green-400">{product.price}€</h2>
                      <p className="text-sm text-white/60">Taxes incluses</p>
                    </div>
                    <Badge variant="secondary">
                      {product.category}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-white/80">Quantité</Label>
                    <Input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-winshirt-purple to-winshirt-blue hover:from-winshirt-purple/90 hover:to-winshirt-blue/90 text-white font-semibold py-3"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Ajouter au panier
                  </Button>
                </GlassCard>

                <GlassCard className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-white">Options de personnalisation</h3>
                  <p className="text-white/70">
                    Aperçu des options de personnalisation et réglages finaux.
                  </p>

                  {/* Design Position Controls */}
                  <div className="space-y-2">
                    <Label className="text-white/80">Position du design</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label htmlFor="design-x" className="text-sm text-white/60">X</Label>
                        <Slider
                          id="design-x"
                          min={0}
                          max={100}
                          step={1}
                          value={[designPosition.x]}
                          onValueChange={(value) => handleDesignPositionChange('x', value[0])}
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="design-y" className="text-sm text-white/60">Y</Label>
                        <Slider
                          id="design-y"
                          min={0}
                          max={100}
                          step={1}
                          value={[designPosition.y]}
                          onValueChange={(value) => handleDesignPositionChange('y', value[0])}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Design Size Controls */}
                  <div className="space-y-2">
                    <Label className="text-white/80">Taille du design</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label htmlFor="design-width" className="text-sm text-white/60">Largeur</Label>
                        <Slider
                          id="design-width"
                          min={50}
                          max={300}
                          step={1}
                          value={[designSize.width]}
                          onValueChange={(value) => handleDesignSizeChange('width', value[0])}
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="design-height" className="text-sm text-white/60">Hauteur</Label>
                        <Slider
                          id="design-height"
                          min={50}
                          max={300}
                          step={1}
                          value={[designSize.height]}
                          onValueChange={(value) => handleDesignSizeChange('height', value[0])}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mockup Background Color */}
                  <div className="space-y-2">
                    <Label className="text-white/80">Couleur de fond du mockup</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={mockupSettings.backgroundColor}
                        onChange={(e) => handleMockupBackgroundColorChange(e.target.value)}
                        className="w-10 h-10 rounded-lg border-2 border-white/30 bg-transparent cursor-pointer hover:border-winshirt-purple/60 transition-colors"
                      />
                      <Input
                        type="text"
                        value={mockupSettings.backgroundColor}
                        onChange={(e) => handleMockupBackgroundColorChange(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Customization Modal */}
      <CustomizationModal
        open={isCustomizationOpen}
        onOpenChange={setIsCustomizationOpen}
        productId={product?.id || ''}
        productName={product?.name || ''}
        currentSide={currentSide}
        onSideChange={setCurrentSide}
        selectedDesign={selectedDesign}
        onDesignSelect={setSelectedDesign}
        customImage={customImage}
        onCustomImageChange={setCustomImage}
        customText={customText}
        onCustomTextChange={setCustomText}
        svgColor={svgColor}
        onSvgColorChange={setSvgColor}
        onSvgContentChange={setSvgContent}
      />
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
