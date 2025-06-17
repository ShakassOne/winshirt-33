import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Product as ProductType, Mockup as MockupType, MockupWithColors, CartItem, Lottery } from '@/types/supabase.types';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from "@/components/ui/slider"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { ColorPalette } from '@/components/product/ColorPalette';
import { SizeSelector } from '@/components/product/SizeSelector';
import { CustomizationForm } from '@/components/product/CustomizationForm';
import { captureProductionFiles } from '@/services/api.service';
import { Product3DViewer } from '@/components/product/Product3DViewer';
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ReloadIcon } from "@radix-ui/react-icons"

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [mockup, setMockup] = useState<MockupWithColors | null>(null);
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<{ name: string; color_code: string; front_image_url: string; back_image_url: string; } | null>(null);
  const [customization, setCustomization] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMockupLoading, setIsMockupLoading] = useState(true);
  const [hasCustomization, setHasCustomization] = useState(false);

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
        setHasCustomization(productData?.is_customizable || false);

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

        setMockup(mockupData as MockupWithColors);
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
    if (!product || !mockup) return;

    try {
      setIsAdding(true);
      
      let capturedCustomization = customization;
      
      if (hasCustomization) {
        console.log('🎯 [ProductDetail] Capturing HD visuals before adding to cart');
        try {
          const enrichedCustomization = await captureProductionFiles(
            product.id,
            mockup.id,
            customization,
            selectedColor?.name || product.color,
            selectedSize
          );
          capturedCustomization = enrichedCustomization;
          console.log('✅ [ProductDetail] HD capture completed successfully');
        } catch (captureError) {
          console.error('❌ [ProductDetail] HD capture failed:', captureError);
          toast({
            variant: "destructive",
            title: "Erreur de capture",
            description: "Impossible de capturer les visuels haute définition. L'article sera ajouté sans optimisation."
          });
        }
      }

      const cartItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image_url: product.image_url,
        size: selectedSize,
        color: selectedColor?.name || product.color,
        available_sizes: product.available_sizes,
        available_colors: product.available_colors?.map(c => typeof c === 'string' ? c : c) || [],
        lotteries: (product.tickets_offered && product.tickets_offered > 0) ? lotteries : [], // Fix: use lotteries array instead of strings
        customization: capturedCustomization
      };

      await addToCart(cartItem);
      
      toast({
        title: "Produit ajouté au panier",
        description: `${product.name} a été ajouté à votre panier.`,
      });
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
    return <div className="text-center">Chargement du produit...</div>;
  }

  if (!product) {
    return <div className="text-center">Produit non trouvé.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image or 3D Viewer */}
        <div>
          {product.use_3d_viewer ? (
            <Product3DViewer modelUrl={product.model_3d_url || ''} />
          ) : (
            <AspectRatio ratio={1 / 1} className="w-full">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg"
              />
            </AspectRatio>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xl font-semibold">{product.price.toFixed(2)} €</span>
              {product.tickets_offered && product.tickets_offered > 0 && (
                <Badge className="ml-2 bg-purple-500/20 text-purple-300 border-purple-500/50">
                  {product.tickets_offered} tickets offerts
                </Badge>
              )}
            </div>
          </div>

          {/* Color Palette */}
          {product.available_colors && product.available_colors.length > 0 && (
            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700 mb-2">Couleur:</Label>
              <ColorPalette
                colors={product.available_colors}
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />
            </div>
          )}

          {/* Size Selector */}
          {product.available_sizes && product.available_sizes.length > 0 && (
            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700 mb-2">Taille:</Label>
              <SizeSelector
                sizes={product.available_sizes}
                selectedSize={selectedSize}
                onSizeSelect={setSelectedSize}
              />
            </div>
          )}

          {/* Quantity Input */}
          <div className="mb-6">
            <Label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">Quantité:</Label>
            <Input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              min="1"
              className="w-24"
            />
          </div>

          {/* Customization Form */}
          {hasCustomization && mockup && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Personnalisation</h2>
              <CustomizationForm
                product={product}
                mockup={mockup}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onCustomizationChange={setCustomization}
              />
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full"
          >
            {isAdding ? (
              <><ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Ajout au panier...</>
            ) : (
              "Ajouter au panier"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
