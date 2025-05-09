
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchProductById, fetchAllLotteries, fetchDesigns } from '@/services/api.service';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showCustomizationPanel, setShowCustomizationPanel] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  
  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id,
  });

  const { data: lotteries } = useQuery({
    queryKey: ['lotteries'],
    queryFn: fetchAllLotteries,
  });

  const { data: designs } = useQuery({
    queryKey: ['designs'],
    queryFn: fetchDesigns,
    enabled: showCustomizationPanel,
  });

  const eligibleLotteries = lotteries?.filter(lottery => lottery.is_active).slice(0, product?.tickets_offered || 0);

  const handleAddToCart = () => {
    if (!selectedSize && product?.available_sizes.length > 0) {
      toast.error("Veuillez sélectionner une taille");
      return;
    }

    if (!selectedColor && product?.available_colors.length > 0) {
      toast.error("Veuillez sélectionner une couleur");
      return;
    }

    toast.success("Produit ajouté au panier");
  };

  const toggleCustomizationPanel = () => {
    setShowCustomizationPanel(!showCustomizationPanel);
  };

  const handleDesignSelect = (designId: string) => {
    setSelectedDesign(designId);
    toast.success("Design sélectionné");
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

  const getColorName = (colorCode: string) => {
    const colorMap: Record<string, string> = {
      'white': 'Blanc',
      'black': 'Noir',
      'blue': 'Bleu',
      'red': 'Rouge',
      'gray': 'Gris',
      'navy': 'Bleu marine',
    };
    return colorMap[colorCode] || colorCode;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Product Images */}
            <div>
              <Carousel className="w-full">
                <CarouselContent>
                  <CarouselItem>
                    <div className="aspect-square relative overflow-hidden rounded-xl">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover" 
                      />
                      {selectedDesign && designs && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img 
                            src={designs.find(d => d.id === selectedDesign)?.image_url || ''} 
                            alt="Selected Design"
                            className="w-1/2 h-1/2 object-contain opacity-80" 
                          />
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="aspect-square relative overflow-hidden rounded-xl bg-white/5">
                      <div className="absolute inset-0 flex items-center justify-center text-white/50">
                        Vue arrière (à venir)
                      </div>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="-left-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/10" />
                <CarouselNext className="-right-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/10" />
              </Carousel>

              {product.is_customizable && (
                <div className="mt-8">
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-medium mb-3">Personnalisation</h3>
                    <p className="text-white/70 mb-4">
                      Ce produit est personnalisable. Vous pouvez ajouter des designs après l'avoir ajouté au panier ou utiliser notre éditeur ci-dessous.
                    </p>
                    <Button 
                      className="bg-gradient-purple w-full"
                      onClick={toggleCustomizationPanel}
                    >
                      {showCustomizationPanel ? "Masquer l'éditeur" : "Personnaliser ce produit"}
                    </Button>
                  </GlassCard>
                </div>
              )}

              {showCustomizationPanel && (
                <div className="mt-6">
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-medium mb-3">Sélectionner un design</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                      {designs ? designs.map(design => (
                        <div 
                          key={design.id} 
                          className={`relative aspect-square rounded-md overflow-hidden cursor-pointer ${
                            selectedDesign === design.id ? 'ring-2 ring-winshirt-purple' : 'hover:opacity-80'
                          }`}
                          onClick={() => handleDesignSelect(design.id)}
                        >
                          <img 
                            src={design.image_url} 
                            alt={design.name} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                            <p className="text-white text-sm font-medium">{design.name}</p>
                          </div>
                          {selectedDesign === design.id && (
                            <div className="absolute top-2 right-2 bg-winshirt-purple rounded-full w-5 h-5 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      )) : (
                        <p>Chargement des designs...</p>
                      )}
                    </div>
                  </GlassCard>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">{product.category}</Badge>
                {product.is_customizable && (
                  <Badge className="bg-winshirt-purple">Personnalisable</Badge>
                )}
                {product.tickets_offered > 0 && (
                  <Badge className="bg-winshirt-blue">
                    {product.tickets_offered} {product.tickets_offered > 1 ? 'tickets' : 'ticket'}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center mb-6">
                <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-400 fill-yellow-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-white/70">(12 avis)</span>
                </div>
              </div>

              <p className="text-xl font-bold mb-6">{product.price.toFixed(2)} €</p>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Description</h3>
                <p className="text-white/70">{product.description}</p>
              </div>

              {product.available_sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Taille</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.available_sizes.map((size) => (
                      <button
                        key={size}
                        className={`px-3 py-1 rounded-md border transition-colors ${
                          selectedSize === size
                            ? 'bg-winshirt-purple border-winshirt-purple text-white'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.available_colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Couleur</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.available_colors.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full relative ${
                          selectedColor === color ? 'ring-2 ring-winshirt-blue ring-offset-2 ring-offset-black' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        title={getColorName(color)}
                      >
                        {selectedColor === color && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow-md" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Quantité</h3>
                <div className="flex items-center">
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-l-md border-y border-l border-white/20"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <div className="w-12 h-8 flex items-center justify-center bg-white/5 border-y border-white/20">
                    {quantity}
                  </div>
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-r-md border-y border-r border-white/20"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {eligibleLotteries && eligibleLotteries.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Loteries associées</h3>
                  <GlassCard className="p-4">
                    <p className="text-white/70 mb-3">
                      Avec ce produit, participez aux loteries suivantes:
                    </p>
                    <div className="space-y-2">
                      {eligibleLotteries.map(lottery => (
                        <div key={lottery.id} className="flex items-center p-2 rounded-lg bg-white/5 border border-white/10">
                          <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                            <img 
                              src={lottery.image_url} 
                              alt={lottery.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{lottery.title}</h4>
                            <p className="text-xs text-white/50">Valeur: {lottery.value.toFixed(2)} €</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              )}

              <Button 
                className="w-full bg-gradient-purple mb-3" 
                size="lg"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Ajouter au panier
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
