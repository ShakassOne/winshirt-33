import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Product as ProductType, Lottery } from '@/types/supabase.types';
import { fetchProductById, fetchMockupById, fetchAllLotteries, fetchAllDesigns } from '@/services/api.service';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductInfo from '@/components/product/ProductInfo';
import ProductImages from '@/components/product/ProductImages';
import ProductCustomization from '@/components/product/ProductCustomization';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from "@/components/ui/separator"
import { useHDCaptureOnAddToCart } from '@/hooks/useHDCaptureOnAddToCart';
import { enrichCustomizationWithHD } from '@/services/hdCapture.service';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from "@/components/ui/skeleton"

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
    onSuccess: (data) => {
      setProduct(data);
      setSelectedColor(data?.available_colors?.[0] || '');
      setSelectedSize(data?.available_sizes?.[0] || '');
    },
    onError: (error) => {
      console.error("Error fetching product:", error);
      toast({
        title: "Error",
        description: "Failed to load product details.",
        variant: "destructive",
      });
    },
    enabled: !!id,
  });

  const { data: lotteriesData, isLoading: isLoadingLotteries } = useQuery({
    queryKey: ['lotteries'],
    queryFn: fetchAllLotteries,
    onSuccess: (data) => {
      setLotteries(data);
    },
    onError: (error) => {
      console.error("Error fetching lotteries:", error);
      toast({
        title: "Error",
        description: "Failed to load lotteries.",
        variant: "destructive",
      });
    },
  });

  const { data: mockupData, isLoading: isLoadingMockup } = useQuery({
    queryKey: ['mockup', product?.mockup_id],
    queryFn: () => fetchMockupById(product?.mockup_id as string),
    onSuccess: (data) => {
      setMockup(data);
    },
    onError: (error) => {
      console.error("Error fetching mockup:", error);
      toast({
        title: "Error",
        description: "Failed to load mockup details.",
        variant: "destructive",
      });
    },
    enabled: !!product?.mockup_id,
  });

  const { data: designsData, isLoading: isLoadingDesigns } = useQuery({
    queryKey: ['designs'],
    queryFn: fetchAllDesigns,
    onSuccess: (data) => {
      setDesigns(data);
    },
    onError: (error) => {
      console.error("Error fetching designs:", error);
      toast({
        title: "Error",
        description: "Failed to load designs.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (product) {
      setSelectedLotteries(lotteries.filter(lottery => lottery.product_ids?.includes(product.id)).map(lottery => lottery.id));
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
            <ProductImages product={product} mockup={mockup} selectedColor={selectedColor} />

            {/* Product Info and Options Section */}
            <div>
              <ProductInfo
                product={product}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                selectedLotteries={selectedLotteries}
                lotteries={lotteries}
                onColorSelect={handleColorSelect}
                onSizeSelect={handleSizeSelect}
                onLotterySelect={handleLotterySelect}
                calculatePrice={calculatePrice}
              />

              <Separator className="my-4" />

              {/* Product Customization Section */}
              {product.is_customizable && (
                <ProductCustomization
                  product={product}
                  designs={designs}
                  onCustomizationChange={setCustomization}
                />
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
