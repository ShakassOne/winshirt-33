
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Product as ProductType, Mockup as MockupType, CartItem, Lottery } from '@/types/supabase.types';
import { MockupWithColors, MockupColor } from '@/types/mockup.types';
import { useCart } from '@/context/CartContext';
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
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ReloadIcon } from "@radix-ui/react-icons"

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [mockup, setMockup] = useState<MockupWithColors | null>(null);
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<MockupColor | null>(null);
  const [customization, setCustomization] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMockupLoading, setIsMockupLoading] = useState(true);
  const [hasCustomization, setHasCustomization] = useState(false);

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

        // Transform the mockup data to match MockupWithColors interface
        const transformedMockup: MockupWithColors = {
          ...mockupData,
          colors: validateMockupColors(mockupData.colors),
          print_areas: Array.isArray(mockupData.print_areas) 
            ? mockupData.print_areas 
            : []
        };

        setMockup(transformedMockup);
        
        // Set default color if available
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
      
      const cartItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image_url: product.image_url,
        size: selectedSize,
        color: selectedColor?.name || product.color,
        available_sizes: product.available_sizes,
        available_colors: product.available_colors,
        lotteries: (product.tickets_offered && product.tickets_offered > 0) ? lotteries : [],
        customization: customization
      };

      await addItem(cartItem);
      
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
        {/* Product Image */}
        <div>
          <AspectRatio ratio={1 / 1} className="w-full">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg"
            />
          </AspectRatio>
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

          {/* Color Selector */}
          {mockup && mockup.colors && mockup.colors.length > 0 && (
            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700 mb-2">Couleur:</Label>
              <div className="flex gap-2">
                {mockup.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 border rounded ${
                      selectedColor?.name === color.name 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector - Fallback to product colors */}
          {(!mockup || !mockup.colors || mockup.colors.length === 0) && product.available_colors && product.available_colors.length > 0 && (
            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700 mb-2">Couleur:</Label>
              <div className="flex gap-2">
                {product.available_colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor({ name: color, color_code: color, front_image_url: '', back_image_url: '' })}
                    className={`px-3 py-1 border rounded ${
                      selectedColor?.name === color 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.available_sizes && product.available_sizes.length > 0 && (
            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700 mb-2">Taille:</Label>
              <div className="flex gap-2">
                {product.available_sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 border rounded ${
                      selectedSize === size 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
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
