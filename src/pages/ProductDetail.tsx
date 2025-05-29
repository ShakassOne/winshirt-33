
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SocialShareSection from '@/components/SocialShareSection';
import CustomizationAccordion from '@/components/product/CustomizationAccordion';
import AIImageGallery from '@/components/product/AIImageGallery';
import AIImageGenerator from '@/components/product/AIImageGenerator';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, Star, Award } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [customization, setCustomization] = useState<any>({});

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          mockups (
            name,
            svg_front_url,
            svg_back_url,
            print_areas,
            colors
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    // Validation des sélections requises
    if (product.available_colors?.length > 0 && !selectedColor) {
      toast({
        title: "Couleur requise",
        description: "Veuillez sélectionner une couleur",
        variant: "destructive",
      });
      return;
    }
    
    if (product.available_sizes?.length > 0 && !selectedSize) {
      toast({
        title: "Taille requise",
        description: "Veuillez sélectionner une taille",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1,
      color: selectedColor,
      size: selectedSize,
      customization: customization
    });

    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} a été ajouté à votre panier`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center mt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-winshirt-blue mx-auto mb-4"></div>
            <p className="text-lg">Chargement du produit...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center mt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
            <p className="text-gray-600">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentUrl = window.location.href;
  const shareTitle = `Découvrez ${product.name} sur WinShirt`;
  const shareDescription = product.description;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Images du produit */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Galerie d'images AI si le produit est personnalisable */}
              {product.is_customizable && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Inspirations IA</h3>
                  <AIImageGallery />
                </div>
              )}
            </div>

            {/* Informations du produit */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  {product.tickets_offered > 0 && (
                    <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500">
                      <Award className="h-3 w-3 mr-1" />
                      {product.tickets_offered} ticket{product.tickets_offered > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-winshirt-blue">
                    {product.price.toFixed(2)} €
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">(4.8)</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">{product.description}</p>
              </div>

              {/* Sélection des options */}
              <div className="space-y-4">
                {/* Couleurs */}
                {product.available_colors && product.available_colors.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Couleur {selectedColor && `- ${selectedColor}`}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.available_colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-2 rounded-md border text-sm transition-colors ${
                            selectedColor === color
                              ? 'border-winshirt-blue bg-winshirt-blue/20 text-winshirt-blue'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tailles */}
                {product.available_sizes && product.available_sizes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Taille {selectedSize && `- ${selectedSize}`}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.available_sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-2 rounded-md border text-sm transition-colors ${
                            selectedSize === size
                              ? 'border-winshirt-blue bg-winshirt-blue/20 text-winshirt-blue'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton d'ajout au panier */}
              <Button 
                onClick={handleAddToCart}
                size="lg" 
                className="w-full bg-gradient-to-r from-winshirt-blue to-winshirt-purple hover:opacity-90"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Ajouter au panier
              </Button>

              {/* Section de partage social */}
              <SocialShareSection 
                url={currentUrl}
                title={shareTitle}
                description={shareDescription}
              />
            </div>
          </div>

          {/* Personnalisation */}
          {product.is_customizable && product.mockups && (
            <div className="mt-12">
              <CustomizationAccordion 
                mockup={product.mockups}
                onCustomizationChange={setCustomization}
              />
            </div>
          )}

          {/* Générateur d'images IA */}
          {product.is_customizable && (
            <div className="mt-12">
              <AIImageGenerator />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
