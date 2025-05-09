
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchProductById, fetchAllLotteries, fetchDesigns, fetchMockupById } from '@/services/api.service';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, Upload, Image, Circle, ArrowLeft, ArrowRight, Move, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CartItem, Design, Mockup } from '@/types/supabase.types';
import { Slider } from '@/components/ui/slider';

// Prix par taille d'impression
const PRINT_SIZES_PRICES = {
  'a6': 5.00,
  'a5': 8.00,
  'a4': 10.00,
  'a3': 15.00
};

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
  const [selectedPrintPosition, setSelectedPrintPosition] = useState<'front' | 'back'>('front');
  const [selectedPrintSize, setSelectedPrintSize] = useState<'a4'>('a4');
  const [currentDesignView, setCurrentDesignView] = useState<'browse' | 'upload'>('browse');
  const [uploadedDesignUrl, setUploadedDesignUrl] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // État pour la manipulation du design
  const [designPosition, setDesignPosition] = useState({ x: 0, y: 0 });
  const [designScale, setDesignScale] = useState(1);
  const [designRotation, setDesignRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [customizationPrice, setCustomizationPrice] = useState(0);
  
  // Référence à la div contenant l'aperçu pour manipulation
  const previewContainerRef = useRef<HTMLDivElement>(null);
  
  // Calcul du prix total incluant personnalisation
  const calculateTotalPrice = () => {
    if (!product) return 0;
    
    let basePrice = product.price * quantity;
    
    // Ajouter le prix de personnalisation si un design est sélectionné
    if ((selectedDesign || uploadedDesignUrl) && selectedPrintSize) {
      basePrice += PRINT_SIZES_PRICES[selectedPrintSize as keyof typeof PRINT_SIZES_PRICES] * quantity;
    }
    
    return basePrice;
  };
  
  // Chargement du produit
  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id,
  });

  // Chargement des loteries
  const { data: lotteries, isLoading: lotteriesLoading } = useQuery({
    queryKey: ['lotteries'],
    queryFn: fetchAllLotteries,
  });

  // Chargement des designs
  const { data: designs, isLoading: designsLoading } = useQuery({
    queryKey: ['designs'],
    queryFn: fetchDesigns,
    enabled: showCustomizationPanel,
  });

  // Récupération du mockup si le produit en a un
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

  // Récupération du panier depuis localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart from localStorage:", e);
      }
    }
  }, []);
  
  // Mettre à jour le prix de personnalisation quand la taille change
  useEffect(() => {
    if (selectedPrintSize) {
      setCustomizationPrice(PRINT_SIZES_PRICES[selectedPrintSize as keyof typeof PRINT_SIZES_PRICES]);
    }
  }, [selectedPrintSize]);

  // Sauvegarde du panier dans localStorage
  const saveCart = (newCart: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  // Filtrage des loteries éligibles
  const eligibleLotteries = lotteries?.filter(lottery => lottery.is_active).slice(0, product?.tickets_offered || 0);

  // Récupération du design sélectionné
  const getSelectedDesignDetails = () => {
    if (!selectedDesign || !designs) return null;
    
    return designs.find(design => design.id === selectedDesign);
  };
  
  const selectedDesignDetails = getSelectedDesignDetails();
  
  // Gestion du drag & drop pour repositionner le design
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewContainerRef.current) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - designPosition.x,
      y: e.clientY - designPosition.y
    });
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setDesignPosition({
      x: newX,
      y: newY
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleZoomIn = () => {
    setDesignScale(prev => Math.min(prev + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setDesignScale(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const handleRotate = () => {
    setDesignRotation(prev => prev + 15);
  };
  
  const resetDesignTransform = () => {
    setDesignPosition({ x: 0, y: 0 });
    setDesignScale(1);
    setDesignRotation(0);
  };

  // Ajout au panier
  const handleAddToCart = () => {
    if (!product) return;
    
    // Validation des données de personnalisation
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

    // Calculer le prix total avec la personnalisation
    const totalPrice = calculateTotalPrice();

    // Créer l'objet pour le panier
    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: totalPrice / quantity, // Prix unitaire incluant personnalisation
      quantity,
      color: selectedColor,
      size: selectedSize,
      image_url: product.image_url,
      customization: selectedDesign || uploadedDesignUrl ? {
        designId: selectedDesign || 'custom',
        designName: selectedDesignDetails?.name || 'Design personnalisé',
        designUrl: currentDesignView === 'upload' ? uploadedDesignUrl! : selectedDesignDetails?.image_url || '',
        printPosition: selectedPrintPosition,
        printSize: selectedPrintSize,
        transform: {
          position: designPosition,
          scale: designScale,
          rotation: designRotation
        }
      } : undefined,
      lotteries: selectedLotteries.length > 0 ? selectedLotteries : undefined,
    };

    // Ajouter au panier
    const newCart = [...cart, cartItem];
    saveCart(newCart);
    
    console.log("Produit ajouté au panier:", cartItem);
    toast.success("Produit ajouté au panier");
    
    // Redirection optionnelle vers le panier
    // navigate('/cart');
  };

  // Affichage/masquage du panneau de personnalisation
  const toggleCustomizationPanel = () => {
    setShowCustomizationPanel(!showCustomizationPanel);
  };

  // Sélection d'un design
  const handleDesignSelect = (designId: string) => {
    setSelectedDesign(designId);
    setCurrentDesignView('browse');
    resetDesignTransform();
    toast.success("Design sélectionné");
  };

  // Sélection d'une loterie
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

  // Filtrage des designs par catégorie
  const filterDesignsByCategory = (category: string) => {
    if (!designs) return [];
    return designs.filter(design => design.category.toLowerCase() === category.toLowerCase());
  };
  
  // Simulation de l'upload d'un design (dans une vraie application, cela ferait appel à une API)
  const handleDesignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Vérifications sur le type et la taille du fichier
    if (!file.type.includes('image/')) {
      toast.error("Veuillez sélectionner un fichier image");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB max
      toast.error("Le fichier est trop volumineux (maximum 5MB)");
      return;
    }
    
    // Simuler un upload avec un délai
    toast.info("Upload en cours...");
    
    // Création d'une URL pour l'aperçu de l'image
    const fileUrl = URL.createObjectURL(file);
    setUploadedDesignUrl(fileUrl);
    
    setTimeout(() => {
      // Dans une vraie application, nous recevrions l'URL depuis le serveur
      setSelectedDesign('custom');
      setCurrentDesignView('upload');
      resetDesignTransform();
      toast.success("Design uploadé avec succès");
    }, 1500);
  };

  // Conversion d'un code couleur en nom
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 py-12">
        <div className="container mx-auto px-4">
          {/* En-tête du produit - Visible sur mobile uniquement */}
          <div className="md:hidden mb-6">
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
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold">{product.price.toFixed(2)} €</span>
              {(selectedDesign || uploadedDesignUrl) && (
                <span className="ml-2 text-sm text-white/70">
                  + {customizationPrice.toFixed(2)} € (personnalisation)
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Section gauche: Aperçu du produit et personnalisation */}
            <div>
              {/* Aperçu du produit */}
              <div className="bg-gradient-to-br from-black to-gray-800 rounded-xl p-4">
                <div
                  ref={previewContainerRef}
                  className={`relative aspect-square overflow-hidden rounded-lg flex items-center justify-center bg-black/50 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {/* Produit de base */}
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-contain" 
                  />
                  
                  {/* Design appliqué */}
                  {previewMode && (selectedDesign || uploadedDesignUrl) && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        pointerEvents: isDragging ? 'none' : 'auto'
                      }}
                    >
                      <img 
                        src={currentDesignView === 'upload' ? uploadedDesignUrl! : designs?.find(d => d.id === selectedDesign)?.image_url || ''}
                        alt="Selected Design"
                        className="object-contain transition-transform duration-200"
                        style={{ 
                          opacity: 0.9,
                          maxWidth: '60%',
                          maxHeight: '60%',
                          transform: `translate(${designPosition.x}px, ${designPosition.y}px) scale(${designScale}) rotate(${designRotation}deg)`,
                          transformOrigin: 'center center'
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Contrôles de manipulation du design */}
                {previewMode && (selectedDesign || uploadedDesignUrl) && (
                  <div className="flex justify-center mt-4 space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleZoomIn}
                      className="bg-black/30 hover:bg-black/50"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleZoomOut}
                      className="bg-black/30 hover:bg-black/50"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRotate}
                      className="bg-black/30 hover:bg-black/50"
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetDesignTransform}
                      className="bg-black/30 hover:bg-black/50 text-xs"
                    >
                      Réinitialiser
                    </Button>
                  </div>
                )}
              </div>

              {/* Position du design (avant/arrière) */}
              {product.is_customizable && (selectedDesign || uploadedDesignUrl) && (
                <div className="flex justify-center mt-4">
                  <div className="inline-flex border rounded-md overflow-hidden">
                    <Button 
                      variant={selectedPrintPosition === 'front' ? "default" : "ghost"} 
                      size="sm"
                      className="rounded-none"
                      onClick={() => setSelectedPrintPosition('front')}
                    >
                      Avant
                    </Button>
                    <Button 
                      variant={selectedPrintPosition === 'back' ? "default" : "ghost"} 
                      size="sm"
                      className="rounded-none"
                      onClick={() => setSelectedPrintPosition('back')}
                    >
                      Arrière
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Personnalisation - Mode compact */}
              {product.is_customizable && (
                <div className="mt-6">
                  <Tabs defaultValue={showCustomizationPanel ? "designs" : "info"} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      <TabsTrigger value="info">Infos</TabsTrigger>
                      <TabsTrigger 
                        value="designs" 
                        onClick={() => setShowCustomizationPanel(true)}
                      >
                        Designs
                      </TabsTrigger>
                      <TabsTrigger 
                        value="upload"
                        onClick={() => {
                          setShowCustomizationPanel(true);
                          setCurrentDesignView('upload');
                        }}
                      >
                        Upload
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="info">
                      <GlassCard className="p-4">
                        <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                        <p className="text-white/70 mb-4">{product.description}</p>
                        <div className="flex items-center justify-between">
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
                      </GlassCard>
                    </TabsContent>
                    
                    <TabsContent value="designs">
                      <GlassCard className="p-4">
                        <Tabs defaultValue="animaux" value={designTab} onValueChange={setDesignTab}>
                          <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="animaux">Animaux</TabsTrigger>
                            <TabsTrigger value="abstrait">Abstrait</TabsTrigger>
                          </TabsList>
                          
                          {designsLoading ? (
                            <div className="text-center py-4">Chargement des designs...</div>
                          ) : (
                            <>
                              <TabsContent value="animaux">
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
                              </TabsContent>
                              
                              <TabsContent value="abstrait">
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
                              </TabsContent>
                            </>
                          )}
                        </Tabs>
                      </GlassCard>
                    </TabsContent>
                    
                    <TabsContent value="upload">
                      <GlassCard className="p-4">
                        <div className="space-y-4">
                          <div className={`border-2 border-dashed border-white/30 rounded-lg p-6 text-center ${uploadedDesignUrl ? 'bg-white/5' : ''}`}>
                            {uploadedDesignUrl ? (
                              <div className="space-y-4">
                                <img 
                                  src={uploadedDesignUrl} 
                                  alt="Uploaded design" 
                                  className="mx-auto h-40 object-contain"
                                />
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => {
                                    setUploadedDesignUrl(null);
                                    setSelectedDesign(null);
                                  }}
                                >
                                  Supprimer
                                </Button>
                              </div>
                            ) : (
                              <>
                                <Image className="w-12 h-12 mx-auto mb-4 text-white/40" />
                                <p className="mb-2 text-white/70">Cliquez pour choisir un fichier ou glissez-déposez</p>
                                <p className="text-sm text-white/50 mb-4">PNG, JPG ou SVG (max. 5MB)</p>
                                <input
                                  type="file"
                                  id="fileUpload"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleDesignUpload}
                                />
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => document.getElementById('fileUpload')?.click()}
                                >
                                  Sélectionner un fichier
                                </Button>
                              </>
                            )}
                          </div>
                          
                          {uploadedDesignUrl && (
                            <div className="pt-4">
                              <h4 className="text-sm font-medium mb-2">Taille d'impression</h4>
                              <Select 
                                value={selectedPrintSize} 
                                onValueChange={(val) => setSelectedPrintSize(val as 'a4')}
                              >
                                <SelectTrigger className="w-full bg-white/5">
                                  <SelectValue placeholder="Choisir une taille" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="a3">A3 - Grand (+15.00€)</SelectItem>
                                  <SelectItem value="a4">A4 - Moyen (+10.00€)</SelectItem>
                                  <SelectItem value="a5">A5 - Petit (+8.00€)</SelectItem>
                                  <SelectItem value="a6">A6 - Très petit (+5.00€)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </GlassCard>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>

            {/* Section droite: Information produit et options */}
            <div>
              {/* En-tête du produit - Masqué sur mobile */}
              <div className="hidden md:block">
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
                  <span className="text-2xl font-bold">{calculateTotalPrice().toFixed(2)} €</span>
                  {(selectedDesign || uploadedDesignUrl) && (
                    <span className="ml-2 text-sm text-white/70">
                      (inclus personnalisation: +{customizationPrice.toFixed(2)} €)
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {product.available_sizes.length > 0 && (
                  <div>
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
                  <div>
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

                <div>
                  <h3 className="text-sm font-medium mb-2">Quantité</h3>
                  <div className="flex items-center">
                    <button
                      className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-l-md border-y border-l border-white/20"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <div className="w-14 h-10 flex items-center justify-center bg-white/5 border-y border-white/20 text-lg">
                      {quantity}
                    </div>
                    <button
                      className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-r-md border-y border-r border-white/20"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Affichage mobile du total */}
                <div className="md:hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold">{calculateTotalPrice().toFixed(2)} €</span>
                  </div>
                </div>

                {eligibleLotteries && eligibleLotteries.length > 0 && product.tickets_offered > 0 && (
                  <div>
                    <GlassCard className="p-4">
                      <h3 className="text-sm font-medium mb-2">
                        Choisissez vos loteries ({selectedLotteries.length}/{product.tickets_offered})
                      </h3>
                      
                      {lotteriesLoading ? (
                        <div className="text-center py-4">Chargement des loteries...</div>
                      ) : (
                        <div className="space-y-3">
                          {eligibleLotteries.map((lottery, index) => (
                            <div 
                              key={lottery.id} 
                              onClick={() => handleLotterySelect(lottery.id)}
                              className={`flex items-center p-3 rounded-lg cursor-pointer border ${
                                selectedLotteries.includes(lottery.id) 
                                  ? 'border-winshirt-purple bg-white/10' 
                                  : 'border-white/10 bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <div className="mr-3 flex items-center justify-center">
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
                        </div>
                      )}
                    </GlassCard>
                  </div>
                )}
                
                {/* Récapitulatif de personnalisation */}
                {(selectedDesign || selectedColor || selectedSize) && (
                  <div className="md:hidden">
                    <GlassCard className="p-4">
                      <h3 className="text-sm font-medium mb-2">Récapitulatif</h3>
                      <ul className="space-y-2 text-white/80 text-sm">
                        {selectedSize && (
                          <li className="flex justify-between">
                            <span>Taille:</span>
                            <span className="font-medium">{selectedSize}</span>
                          </li>
                        )}
                        {selectedColor && (
                          <li className="flex justify-between items-center">
                            <span>Couleur:</span>
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: selectedColor }}></div>
                              <span className="font-medium">{getColorName(selectedColor)}</span>
                            </div>
                          </li>
                        )}
                        {(selectedDesign || uploadedDesignUrl) && (
                          <>
                            <li className="flex justify-between">
                              <span>Design:</span>
                              <span className="font-medium">
                                {currentDesignView === 'upload' ? 'Custom upload' : selectedDesignDetails?.name || 'Design'}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Position:</span>
                              <span className="font-medium">{selectedPrintPosition === 'front' ? 'Avant' : 'Arrière'}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Taille d'impression:</span>
                              <span className="font-medium">{selectedPrintSize.toUpperCase()}</span>
                            </li>
                          </>
                        )}
                        {selectedLotteries.length > 0 && (
                          <li className="flex justify-between">
                            <span>Loteries:</span>
                            <span className="font-medium">{selectedLotteries.length} sélectionnée(s)</span>
                          </li>
                        )}
                      </ul>
                    </GlassCard>
                  </div>
                )}

                <Button 
                  className="w-full bg-gradient-purple"
                  size="lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Ajouter au panier • {calculateTotalPrice().toFixed(2)} €
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
