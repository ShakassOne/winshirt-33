
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchProductById, fetchAllDesigns, fetchMockupById } from '@/services/api.service';
import GlassCard from '@/components/ui/GlassCard';
import { Heart, ShoppingCart, Star, Upload, Palette, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import CustomizationAccordion from '@/components/product/CustomizationAccordion';
import AIImageGenerator from '@/components/product/AIImageGenerator';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedDesign, setSelectedDesign] = useState<any>(null);
  const [customizations, setCustomizations] = useState<any>({});
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);

  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id,
  });

  const { data: designs } = useQuery({
    queryKey: ['designs'],
    queryFn: fetchAllDesigns,
  });

  const { data: mockup } = useQuery({
    queryKey: ['mockup', product?.mockup_id],
    queryFn: () => fetchMockupById(product?.mockup_id as string),
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
        title: "Couleur requise",
        description: "Veuillez sélectionner une couleur",
        variant: "destructive"
      });
      return;
    }
    
    if (product.available_sizes && product.available_sizes.length > 0 && !selectedSize) {
      toast({
        title: "Taille requise", 
        description: "Veuillez sélectionner une taille",
        variant: "destructive"
      });
      return;
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1,
      color: selectedColor,
      size: selectedSize,
      customization: Object.keys(customizations).length > 0 ? customizations : undefined,
      available_colors: product.available_colors,
      available_sizes: product.available_sizes
    };

    addItem(cartItem);
    toast({
      title: "Produit ajouté",
      description: `${product.name} a été ajouté à votre panier`,
      variant: "default"
    });
  };

  const handleDesignSelect = (design: any) => {
    setSelectedDesign(design);
    setCustomizations(prev => ({
      ...prev,
      selectedDesign: design
    }));
  };

  const handleCustomizationChange = (newCustomizations: any) => {
    setCustomizations(newCustomizations);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const customDesign = {
          id: 'custom_' + Date.now(),
          name: file.name,
          image_url: result,
          category: 'custom'
        };
        handleDesignSelect(customDesign);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIImageGenerated = (imageUrl: string) => {
    const aiDesign = {
      id: 'ai_' + Date.now(),
      name: 'Image générée par IA',
      image_url: imageUrl,
      category: 'ai_generated'
    };
    handleDesignSelect(aiDesign);
  };

  if (productLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow mt-16 flex items-center justify-center">
          <p>Chargement du produit...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow mt-16 flex items-center justify-center">
          <p>Produit non trouvé ou une erreur est survenue.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    maximumFractionDigits: 2
  }).format(product.price);

  const availableDesigns = designs?.filter(design => design.category === product.category && design.is_active);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="mt-16 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image & Customizer */}
            <div className="space-y-6">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover" 
                />
                {/* Design overlay if selected */}
                {selectedDesign && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={selectedDesign.image_url}
                      alt={selectedDesign.name}
                      className="max-w-[60%] max-h-[60%] object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="mb-4">
                  {product.category}
                </Badge>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-white/60">(128 avis)</span>
                </div>
                <p className="text-2xl font-bold text-winshirt-blue mb-4">{formattedPrice}</p>
                <p className="text-white/80 mb-6">{product.description}</p>
              </div>

              {/* Color Selection */}
              {product.available_colors && product.available_colors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Couleur</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.available_colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "default" : "outline"}
                        onClick={() => setSelectedColor(color)}
                        className="capitalize"
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.available_sizes && product.available_sizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Taille</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.available_sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        onClick={() => setSelectedSize(size)}
                        className="uppercase"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tickets Info */}
              {product.tickets_offered > 0 && (
                <div className="bg-gradient-to-r from-winshirt-purple to-winshirt-blue p-4 rounded-lg">
                  <p className="text-white font-semibold">
                    🎫 {product.tickets_offered} ticket{product.tickets_offered > 1 ? 's' : ''} de loterie offert{product.tickets_offered > 1 ? 's' : ''} !
                  </p>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-gradient-purple hover:opacity-90 text-lg py-6"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Ajouter au panier
              </Button>

              {/* Customization Section */}
              {product.is_customizable && (
                <CustomizationAccordion>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Designs disponibles</h3>
                    
                    {/* Design Action Buttons */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('design-file-input')?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Importer
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setIsAIGeneratorOpen(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-winshirt-purple/20 to-winshirt-blue/20 border-winshirt-purple/50"
                      >
                        <Sparkles className="h-4 w-4" />
                        Générer IA
                      </Button>
                      <input
                        id="design-file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Design Grid */}
                    {availableDesigns && availableDesigns.length > 0 && (
                      <div className="grid grid-cols-3 gap-3">
                        {availableDesigns.map((design) => (
                          <div
                            key={design.id}
                            className={`cursor-pointer border-2 rounded-lg p-2 transition-colors ${
                              selectedDesign?.id === design.id
                                ? 'border-winshirt-blue bg-winshirt-blue/20'
                                : 'border-white/20 hover:border-white/40'
                            }`}
                            onClick={() => handleDesignSelect(design)}
                          >
                            <img
                              src={design.image_url}
                              alt={design.name}
                              className="w-full h-20 object-cover rounded"
                            />
                            <p className="text-xs text-center mt-1 truncate">{design.name}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Selected Design Preview */}
                    {selectedDesign && (
                      <div className="mt-4 p-3 border border-white/20 rounded-lg bg-background/20">
                        <p className="text-sm font-medium mb-2">Design sélectionné:</p>
                        <div className="flex items-center gap-2">
                          <img
                            src={selectedDesign.image_url}
                            alt={selectedDesign.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <span className="text-sm">{selectedDesign.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CustomizationAccordion>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* AI Image Generator Dialog */}
      <AIImageGenerator
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
        onImageGenerated={handleAIImageGenerated}
      />
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
