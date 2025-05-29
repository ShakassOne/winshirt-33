import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '@/services/api.service';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, ShoppingCart, Star, Heart, Palette, Zap } from 'lucide-react';
import { Product, Mockup } from '@/types/supabase.types';
import CustomizationAccordion from '@/components/product/CustomizationAccordion';
import { useQuery as useMockupQuery } from '@tanstack/react-query';
import { fetchMockupById } from '@/services/api.service';
import { SocialShareSection } from '@/components/SocialShareSection';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  const { data: mockup } = useMockupQuery({
    queryKey: ['mockup', product?.mockup_id],
    queryFn: () => fetchMockupById(product!.mockup_id!),
    enabled: !!product?.mockup_id,
  });

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

  const handleAddToCart = () => {
    if (!product) return;

    if (product.available_colors && product.available_colors.length > 0 && !selectedColor) {
      toast({
        title: "Sélectionnez une couleur",
        description: "Veuillez choisir une couleur avant d'ajouter au panier.",
        variant: "destructive",
      });
      return;
    }

    if (product.available_sizes && product.available_sizes.length > 0 && !selectedSize) {
      toast({
        title: "Sélectionnez une taille",
        description: "Veuillez choisir une taille avant d'ajouter au panier.",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity,
      color: selectedColor,
      size: selectedSize,
      customization,
    });

    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
            <p>Chargement du produit...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Produit introuvable</h1>
            <Button onClick={() => navigate('/products')}>
              Retour aux produits
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16 flex-grow">
        <Button
          variant="ghost"
          onClick={() => navigate('/products')}
          className="mb-6 hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux produits
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.tickets_offered > 0 && (
                  <Badge variant="outline" className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20">
                    <Zap className="w-3 h-3 mr-1" />
                    {product.tickets_offered} ticket{product.tickets_offered > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-rose-500">
                  {product.price.toFixed(2)} €
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={isFavorite ? "text-red-500" : "text-gray-400"}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
              </div>

              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-600 ml-2">(4.8/5 - 124 avis)</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Color Selection */}
            {product.available_colors && product.available_colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Couleur: {selectedColor}</h3>
                <div className="flex gap-2">
                  {product.available_colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedColor === color
                          ? 'border-rose-500 bg-rose-50 text-rose-600'
                          : 'border-gray-300 hover:border-gray-400'
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
                <h3 className="font-semibold mb-3">Taille: {selectedSize}</h3>
                <div className="flex gap-2">
                  {product.available_sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedSize === size
                          ? 'border-rose-500 bg-rose-50 text-rose-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customization */}
            {product.is_customizable && mockup && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Personnalisation
                </h3>
                <Card>
                  <CardContent className="p-4">
                    <CustomizationAccordion
                      mockup={mockup}
                      onCustomizationChange={setCustomization}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Quantité</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    Total: {(product.price * quantity).toFixed(2)} €
                  </span>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Ajouter au panier
              </Button>
            </div>

            {/* Social Share Section */}
            <SocialShareSection
              url={currentUrl}
              title={product.name}
              description={product.description}
              className="border-t pt-6"
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
