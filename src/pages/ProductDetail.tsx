
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Product as ProductType, Lottery } from '@/types/supabase.types';
import { fetchProductById, fetchMockupById, fetchAllLotteries, fetchAllDesigns } from '@/services/api.service';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from "@/components/ui/separator"
import { useHDCaptureOnAddToCart } from '@/hooks/useHDCaptureOnAddToCart';
import { enrichCustomizationWithHD } from '@/services/hdCapture.service';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from "@/components/ui/skeleton"
import { HDVisualCapture } from '@/components/product/HDVisualCapture';

interface ProductDetailProps {}

const ProductDetail: React.FC<ProductDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [mockup, setMockup] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedLotteries, setSelectedLotteries] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [designs, setDesigns] = useState<any[]>([]);
  const [customization, setCustomization] = useState<any>({});

  const { captureForProduction } = useHDCaptureOnAddToCart();

  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id,
  });

  const { data: lotteriesData, isLoading: isLoadingLotteries } = useQuery({
    queryKey: ['lotteries'],
    queryFn: fetchAllLotteries,
  });

  const { data: mockupData, isLoading: isLoadingMockup } = useQuery({
    queryKey: ['mockup', product?.mockup_id],
    queryFn: () => fetchMockupById(product?.mockup_id as string),
    enabled: !!product?.mockup_id,
  });

  const { data: designsData, isLoading: isLoadingDesigns } = useQuery({
    queryKey: ['designs'],
    queryFn: fetchAllDesigns,
  });

  // Handle product data changes
  useEffect(() => {
    if (productData) {
      setProduct(productData);
      setSelectedColor(productData?.available_colors?.[0] || '');
      setSelectedSize(productData?.available_sizes?.[0] || '');
    }
  }, [productData]);

  // Handle lotteries data changes
  useEffect(() => {
    if (lotteriesData) {
      setLotteries(lotteriesData);
    }
  }, [lotteriesData]);

  // Handle mockup data changes
  useEffect(() => {
    if (mockupData) {
      setMockup(mockupData);
    }
  }, [mockupData]);

  // Handle designs data changes
  useEffect(() => {
    if (designsData) {
      setDesigns(designsData);
    }
  }, [designsData]);

  // Set selected lotteries when product and lotteries are loaded
  useEffect(() => {
    if (product && lotteries.length > 0) {
      // For now, just select the first lottery - adjust logic as needed
      setSelectedLotteries([lotteries[0]?.id].filter(Boolean));
    }
  }, [product, lotteries]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleLotterySelect = (lotteryId: string) => {
    setSelectedLotteries(prev => {
      if (prev.includes(lotteryId)) {
        return prev.filter(id => id !== lotteryId);
      } else {
        return [...prev, lotteryId];
      }
    });
  };

  const calculatePrice = () => {
    let basePrice = product?.price || 0;
    if (selectedLotteries.length > 0) {
      basePrice += selectedLotteries.length * 5;
    }
    return basePrice;
  };

  const handleAddToCart = async () => {
    if (!product || !selectedSize || isAdding) return;

    try {
      setIsAdding(true);
      
      // Préparer les données de base
      const baseCustomization = {
        ...(customization.frontDesign && { frontDesign: customization.frontDesign }),
        ...(customization.backDesign && { backDesign: customization.backDesign }),
        ...(customization.frontText && { frontText: customization.frontText }),
        ...(customization.backText && { backText: customization.backText }),
      };

      // Vérifier s'il y a une personnalisation
      const hasCustomization = Object.keys(baseCustomization).length > 0;
      
      let finalCustomization = baseCustomization;

      // Tenter la capture HD uniquement s'il y a une personnalisation
      if (hasCustomization && product.is_customizable) {
        console.log('🎨 [ProductDetail] Personnalisation détectée, génération des fichiers HD...');
        
        try {
          // Tenter la capture HD sans bloquer l'ajout au panier
          const hdData = await captureForProduction();
          
          // Enrichir avec les données HD (même si vides)
          finalCustomization = await enrichCustomizationWithHD(baseCustomization, hdData);
        } catch (hdError) {
          console.warn('⚠️ [ProductDetail] Erreur capture HD, on continue sans:', hdError);
          // Ajouter juste un timestamp pour indiquer qu'on a essayé
          finalCustomization = {
            ...baseCustomization,
            hdCaptureTimestamp: new Date().toISOString()
          };
        }
      }

      // Calculer le prix final
      const finalPrice = calculatePrice();

      // Ajouter l'article au panier
      await addToCart({
        productId: product.id,
        name: product.name,
        price: finalPrice,
        quantity: 1,
        color: selectedColor,
        size: selectedSize,
        image_url: product.image_url,
        lotteries: selectedLotteries,
        customization: Object.keys(finalCustomization).length > 0 ? finalCustomization : undefined
      });

      // Afficher le succès
      toast({
        title: "Produit ajouté au panier",
        description: `${product.name} (${selectedColor}, ${selectedSize}) ajouté au panier`,
      });

    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow mt-16 pb-20">
          <div className="container mx-auto px-4 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Skeleton className="w-full aspect-square rounded-lg" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
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
          <div className="container mx-auto px-4 py-10 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Produit non trouvé</h1>
            <p className="text-white/60">Le produit que vous recherchez n'existe pas.</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images Section */}
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Pas d'image disponible
                  </div>
                )}
              </div>
              
              {/* HD Capture elements for customization */}
              {product.is_customizable && (
                <>
                  <HDVisualCapture 
                    side="recto" 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className="text-center">
                      {customization.frontDesign && (
                        <img 
                          src={customization.frontDesign.designUrl} 
                          alt="Front design"
                          className="max-w-32 max-h-32 object-contain mx-auto"
                        />
                      )}
                      {customization.frontText && (
                        <div 
                          className="mt-2"
                          style={{ 
                            color: customization.frontText.color,
                            fontFamily: customization.frontText.font
                          }}
                        >
                          {customization.frontText.content}
                        </div>
                      )}
                    </div>
                  </HDVisualCapture>
                  
                  <HDVisualCapture 
                    side="verso" 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className="text-center">
                      {customization.backDesign && (
                        <img 
                          src={customization.backDesign.designUrl} 
                          alt="Back design"
                          className="max-w-32 max-h-32 object-contain mx-auto"
                        />
                      )}
                      {customization.backText && (
                        <div 
                          className="mt-2"
                          style={{ 
                            color: customization.backText.color,
                            fontFamily: customization.backText.font
                          }}
                        >
                          {customization.backText.content}
                        </div>
                      )}
                    </div>
                  </HDVisualCapture>
                </>
              )}
            </div>

            {/* Product Info and Options Section */}
            <div className="space-y-6">
              {/* Product Info */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
                <p className="text-white/60 mb-4">{product.description}</p>
                <div className="text-2xl font-bold text-white">
                  {calculatePrice()}€
                </div>
              </div>

              {/* Color Selection */}
              {product.available_colors && product.available_colors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Couleur</h3>
                  <div className="flex gap-2">
                    {product.available_colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`px-4 py-2 rounded-md border transition-colors ${
                          selectedColor === color
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 text-white hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.available_sizes && product.available_sizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Taille</h3>
                  <div className="flex gap-2">
                    {product.available_sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`px-4 py-2 rounded-md border transition-colors ${
                          selectedSize === size
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 text-white hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lottery Selection */}
              {lotteries.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Loteries disponibles</h3>
                  <div className="space-y-2">
                    {lotteries.map((lottery) => (
                      <label key={lottery.id} className="flex items-center space-x-2 text-white">
                        <input
                          type="checkbox"
                          checked={selectedLotteries.includes(lottery.id)}
                          onChange={() => handleLotterySelect(lottery.id)}
                          className="rounded"
                        />
                        <span>{lottery.title} (+5€)</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-4" />

              {/* Basic customization placeholder */}
              {product.is_customizable && (
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Personnalisation</h3>
                  <p className="text-white/60">
                    La personnalisation avancée sera disponible bientôt.
                  </p>
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                className="w-full mt-6"
                disabled={isAdding || !selectedSize}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isAdding ? 'Ajout en cours...' : 'Ajouter au panier'}
                {!selectedSize && (
                  <Badge variant="destructive" className="ml-2">
                    Taille requise
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
