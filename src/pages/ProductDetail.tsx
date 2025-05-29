import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { fetchProductById } from '@/services/api.service';
import { Product } from '@/types/supabase.types';
import { SocialShareButton } from '@/components/SocialShareButton';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [customText, setCustomText] = useState<string>('');
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
  });

  useEffect(() => {
    if (product && product.available_sizes && product.available_sizes.length > 0) {
      setSelectedSize(product.available_sizes[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize) {
      toast({
        title: "Taille requise",
        description: "Veuillez sélectionner une taille avant d'ajouter au panier.",
        variant: "destructive",
      });
      return;
    }

    const cartItem = {
      ...product,
      quantity: 1,
      selectedSize: selectedSize,
      selectedColor: selectedColor,
      customText: customText,
    };

    addItem(cartItem);
    toast({
      title: "Produit ajouté",
      description: "Le produit a été ajouté à votre panier.",
    });
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
              {/* Left Column - Product Images */}
              <div className="space-y-6">
                <GlassCard className="p-4">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-auto rounded-lg"
                  />
                </GlassCard>
              </div>

              {/* Right Column - Product Info & Customization */}
              <div className="space-y-6">
                <GlassCard className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                      <p className="text-3xl font-bold text-winshirt-blue">{product.price}€</p>
                    </div>
                    <SocialShareButton
                      url={`/products/${product.id}`}
                      title={product.name}
                      description={product.description}
                      className="ml-4"
                    />
                  </div>
                  <p className="text-white/80 mb-6">{product.description}</p>

                  {product.is_customizable && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Personnalisation</h3>
                      <p className="text-white/60 mb-2">
                        Ajoutez un texte personnalisé à votre produit.
                      </p>
                      <input
                        type="text"
                        placeholder="Votre texte ici"
                        className="w-full p-2 border rounded-md bg-background text-white"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                      />
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tailles disponibles</h3>
                    <div className="flex space-x-2">
                      {product.available_sizes && product.available_sizes.map((size) => (
                        <Badge
                          key={size}
                          variant={selectedSize === size ? "default" : "secondary"}
                          onClick={() => setSelectedSize(size)}
                          className="cursor-pointer"
                        >
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {product.available_colors && product.available_colors.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Couleurs disponibles</h3>
                      <div className="flex space-x-2">
                        {product.available_colors.map((color) => (
                          <Badge
                            key={color}
                            variant={selectedColor === color ? "default" : "secondary"}
                            onClick={() => setSelectedColor(color)}
                            className="cursor-pointer"
                          >
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button className="w-full mt-6" onClick={handleAddToCart}>
                    Ajouter au panier
                  </Button>
                </GlassCard>

                {product.is_customizable && (
                  <GlassCard className="p-6">
                    <div className="space-y-4">
                      <h3
                        className="text-lg font-semibold cursor-pointer flex items-center justify-between"
                        onClick={() => setIsCustomizationOpen(!isCustomizationOpen)}
                      >
                        <span>Options d'IA</span>
                      </h3>
                    </div>
                  </GlassCard>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
