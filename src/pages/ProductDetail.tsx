
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchProductById, fetchAllLotteries, fetchDesigns, fetchMockupById } from '@/services/api.service';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, Upload, Image } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Mockup } from '@/types/supabase.types';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showCustomizationPanel, setShowCustomizationPanel] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [designTab, setDesignTab] = useState<string>('animaux');
  const [selectedLotteries, setSelectedLotteries] = useState<string[]>([]);
  const [mockupData, setMockupData] = useState<Mockup | null>(null);
  
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

  // Fetch mockup data if product has a mockup_id
  useEffect(() => {
    const fetchMockup = async () => {
      if (product?.mockup_id) {
        try {
          const mockup = await fetchMockupById(product.mockup_id);
          setMockupData(mockup);
          console.log("Mockup data loaded:", mockup);
        } catch (error) {
          console.error("Error fetching mockup:", error);
        }
      }
    };

    fetchMockup();
  }, [product]);

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

    // Vérifier si des loteries sont sélectionnées quand le produit offre des tickets
    if (product?.tickets_offered && product.tickets_offered > 0 && selectedLotteries.length === 0) {
      toast.error("Veuillez sélectionner au moins une loterie");
      return;
    }

    // Créer l'objet pour le panier
    const cartItem = {
      productId: product?.id,
      name: product?.name,
      price: product?.price,
      quantity,
      color: selectedColor,
      size: selectedSize,
      design: selectedDesign,
      lotteries: selectedLotteries,
    };

    console.log("Produit ajouté au panier:", cartItem);
    toast.success("Produit ajouté au panier");
  };

  const toggleCustomizationPanel = () => {
    setShowCustomizationPanel(!showCustomizationPanel);
  };

  const handleDesignSelect = (designId: string) => {
    setSelectedDesign(designId);
    toast.success("Design sélectionné");
  };

  const handleLotterySelect = (lotteryId: string) => {
    // Si la loterie est déjà sélectionnée, la désélectionner
    if (selectedLotteries.includes(lotteryId)) {
      setSelectedLotteries(selectedLotteries.filter(id => id !== lotteryId));
    } else {
      // Vérifier si on a atteint le nombre max de tickets/loteries
      if (selectedLotteries.length < (product?.tickets_offered || 0)) {
        setSelectedLotteries([...selectedLotteries, lotteryId]);
      } else {
        toast.error(`Vous ne pouvez sélectionner que ${product?.tickets_offered} loterie(s)`);
      }
    }
  };

  const filterDesignsByCategory = (category: string) => {
    if (!designs) return [];
    return designs.filter(design => design.category.toLowerCase() === category.toLowerCase());
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
      '#ffffff': 'Blanc',
      'black': 'Noir',
      '#000000': 'Noir',
      'blue': 'Bleu',
      '#0000ff': 'Bleu',
      'red': 'Rouge',
      '#ff0000': 'Rouge',
      'gray': 'Gris',
      '#808080': 'Gris',
      'navy': 'Bleu marine',
      '#000080': 'Bleu marine',
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
                  {mockupData?.svg_back_url && (
                    <CarouselItem>
                      <div className="aspect-square relative overflow-hidden rounded-xl">
                        <img 
                          src={mockupData.svg_back_url}
                          alt={`${product.name} - Vue arrière`}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </CarouselItem>
                  )}
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
                    <Tabs defaultValue="animaux" value={designTab} onValueChange={setDesignTab}>
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="animaux">Animaux</TabsTrigger>
                        <TabsTrigger value="abstrait">Abstrait</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="animaux" className="space-y-4">
                        <h3 className="text-lg font-medium mb-2">Choisissez un visuel pour le recto</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {filterDesignsByCategory('animaux').map(design => (
                            <div 
                              key={design.id} 
                              className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border ${
                                selectedDesign === design.id ? 'border-2 border-winshirt-purple' : 'border-white/20'
                              }`}
                              onClick={() => handleDesignSelect(design.id)}
                            >
                              <img 
                                src={design.image_url} 
                                alt={design.name} 
                                className="w-full h-full object-cover"
                              />
                              {selectedDesign === design.id && (
                                <div className="absolute top-2 right-2 bg-winshirt-purple rounded-full w-5 h-5 flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="mt-4">
                          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                            <Upload size={16} />
                            Upload
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="abstrait" className="space-y-4">
                        <h3 className="text-lg font-medium mb-2">Choisissez un visuel pour le recto</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {filterDesignsByCategory('abstrait').map(design => (
                            <div 
                              key={design.id} 
                              className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border ${
                                selectedDesign === design.id ? 'border-2 border-winshirt-purple' : 'border-white/20'
                              }`}
                              onClick={() => handleDesignSelect(design.id)}
                            >
                              <img 
                                src={design.image_url} 
                                alt={design.name} 
                                className="w-full h-full object-cover"
                              />
                              {selectedDesign === design.id && (
                                <div className="absolute top-2 right-2 bg-winshirt-purple rounded-full w-5 h-5 flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="mt-4">
                          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                            <Upload size={16} />
                            Upload
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
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
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          selectedSize === size
                            ? 'bg-winshirt-purple border-winshirt-purple text-white'
                            : 'border border-white/20 bg-white/5 hover:bg-white/10'
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

              {eligibleLotteries && eligibleLotteries.length > 0 && product.tickets_offered > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">
                    Choisissez vos loteries ({selectedLotteries.length}/{product.tickets_offered})
                  </h3>
                  <GlassCard className="p-4">
                    <p className="text-white/70 mb-3">
                      Avec ce produit, participez aux loteries suivantes:
                    </p>
                    
                    {eligibleLotteries.map((lottery, index) => (
                      <div 
                        key={lottery.id} 
                        onClick={() => handleLotterySelect(lottery.id)}
                        className={`flex items-center p-3 rounded-lg cursor-pointer mb-3 border ${
                          selectedLotteries.includes(lottery.id) 
                            ? 'border-winshirt-purple bg-white/10' 
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="mr-2 flex items-center justify-center">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            selectedLotteries.includes(lottery.id) 
                              ? 'border-winshirt-purple bg-winshirt-purple' 
                              : 'border-white/40'
                          }`}>
                            {selectedLotteries.includes(lottery.id) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                        
                        <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                          <img 
                            src={lottery.image_url} 
                            alt={lottery.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium">
                            Ticket {index+1}: {lottery.title}
                          </h4>
                          <p className="text-sm text-white/70">Valeur: {lottery.value.toFixed(2)} €</p>
                          <div className="w-full bg-white/20 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-winshirt-blue h-1.5 rounded-full" 
                              style={{ width: `${Math.min((lottery.participants / lottery.goal) * 100, 100)}%` }} 
                            />
                          </div>
                          <p className="text-xs text-white/50 mt-1">
                            {lottery.participants} / {lottery.goal} participants
                          </p>
                        </div>
                      </div>
                    ))}
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
