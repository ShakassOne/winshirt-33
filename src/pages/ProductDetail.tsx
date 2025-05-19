import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getProductById,
  fetchAllDesigns,
  fetchAllLotteries,
  fetchMockupById,
} from '@/services/api.service';
import { Design, Lottery, Product } from '@/types/supabase.types';
import { ExtendedCartItem } from '@/types/cart.types';
import { MockupWithColors } from '@/types/mockup.types';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from '@/hooks/use-cart';
import { toast } from '@/components/ui/use-toast';
import { Plus, Minus, ShoppingCart, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { UploadButton } from "@/components/ui/upload-button"
import { useToast as useSonner } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useSonner();

  const [product, setProduct] = useState<Product | null>(null);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [mockup, setMockup] = useState<MockupWithColors | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [customDesign, setCustomDesign] = useState<Design | null>(null);
  const [customText, setCustomText] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [textFont, setTextFont] = useState('Arial');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCustomizationEnabled, setIsCustomizationEnabled] = useState(false);
  const [designUrl, setDesignUrl] = useState<string | null>(null);
  const [designName, setDesignName] = useState<string | null>(null);
  const [textPriceFront, setTextPriceFront] = useState<number>(0);
  const [textPriceBack, setTextPriceBack] = useState<number>(0);
	const [printAreaScale, setPrintAreaScale] = useState(100);
  const [selectedPrintArea, setSelectedPrintArea] = useState<any | null>(null);
  const [isAddingLottery, setIsAddingLottery] = useState(false);
  const [selectedLotteries, setSelectedLotteries] = useState<string[]>([]);
  const [isMockupFront, setIsMockupFront] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("Product ID is missing");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const productData = await getProductById(id);
        if (productData) {
          setProduct(productData);
          setSelectedColor(productData.color || null);
          setSelectedSize(productData.available_sizes?.[0] || null);

          // Fetch related data only if the product is customizable
          if (productData.is_customizable && productData.mockup_id) {
            const [designsData, lotteriesData, mockupData] = await Promise.all([
              fetchAllDesigns(),
              fetchAllLotteries(),
              fetchMockupById(productData.mockup_id),
            ]);

            setDesigns(designsData);
            setLotteries(lotteriesData);

            if (mockupData) {
              setMockup(mockupData);
            }
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (mockup) {
      setTextPriceFront(mockup.text_price_front);
      setTextPriceBack(mockup.text_price_back);
    }
  }, [mockup]);

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      setQuantity(prevQuantity => prevQuantity + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleDesignSelect = (design: Design) => {
    setCustomDesign(design);
    setDesignUrl(design.image_url);
    setDesignName(design.name);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomText(e.target.value);
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value);
  };

  const handleTextFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTextFont(e.target.value);
  };

	const handlePrintAreaScale = (values: number[]) => {
		setPrintAreaScale(values[0]);
	};

  const toggleLotterySelection = (lotteryId: string) => {
    setSelectedLotteries(prev =>
      prev.includes(lotteryId) ? prev.filter(id => id !== lotteryId) : [...prev, lotteryId]
    );
  };

  const handleAddToCart = (item: ExtendedCartItem) => {
    addItem(item);
    toast({
      title: "Ajouté au panier",
      description: "Ce produit a été ajouté à votre panier.",
    });
  };

  const prepareCustomization = () => {
    if (!product) return null;

    const customization = {
      designId: customDesign?.id,
      designUrl: designUrl,
      designName: designName,
      customText: customText,
      textColor: textColor,
      textFont: textFont,
    };

    return customization;
  };

  const calculateTotalPrice = () => {
    let basePrice = product?.price || 0;
    let customizationPrice = 0;

    if (isCustomizationEnabled) {
      if (customDesign) {
        basePrice += 5; // Example design price
      }
      if (customText) {
        basePrice += isMockupFront ? (mockup?.text_price_front || 2) : (mockup?.text_price_back || 2); // Example text price
      }
    }

    return basePrice * quantity;
  };

  const handleToggleMockupView = () => {
    setIsMockupFront(prev => !prev);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="spinner"></div>
            <p className="mt-4">Chargement des détails du produit...</p>
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
        <div className="container mx-auto px-4 py-8 mt-16 flex-grow">
          <div className="max-w-3xl mx-auto glass-card p-8 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Une erreur est survenue</h1>
            <p className="mb-6">{error || "Impossible de récupérer les détails du produit."}</p>
            <Button onClick={() => navigate('/products')}>
              Retourner à la liste des produits
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 mt-16 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image and Mockup */}
          <div className="relative">
            {product.is_customizable && mockup ? (
              <>
                <div className="relative rounded-lg overflow-hidden glass-card">
                  <AspectRatio ratio={1 / 1}>
                    <img
                      src={isMockupFront ? mockup.svg_front_url : mockup.svg_back_url}
                      alt={product.name}
                      className="object-contain absolute inset-0 w-full h-full"
                    />
                  </AspectRatio>
                </div>
                <Button
                  variant="outline"
                  className="absolute top-2 left-2 bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
                  onClick={handleToggleMockupView}
                >
                  Voir {isMockupFront ? 'le dos' : 'le devant'}
                </Button>
              </>
            ) : (
              <div className="relative rounded-lg overflow-hidden glass-card">
                <AspectRatio ratio={1 / 1}>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="object-contain absolute inset-0 w-full h-full"
                  />
                </AspectRatio>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <GlassCard className="p-6">
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-400 mb-6">{product.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-semibold">{formatCurrency(calculateTotalPrice())}</div>
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" onClick={() => handleQuantityChange('decrease')}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    className="w-16 text-center rounded-md border border-gray-700 bg-gray-800/50 focus-visible:ring-2 focus-visible:ring-winshirt-purple focus-visible:border-winshirt-purple shadow-sm"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    min="1"
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleQuantityChange('increase')}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {product.available_colors && product.available_colors.length > 0 && (
                <div className="mb-4">
                  <Label className="block text-sm font-medium mb-2">Couleur:</Label>
                  <RadioGroup defaultValue={selectedColor || undefined} className="flex gap-2">
                    {product.available_colors.map((color) => (
                      <div className="flex items-center space-x-2" key={color}>
                        <RadioGroupItem value={color} id={`color-${color}`} className="peer h-5 w-5 rounded-full border-2 border-gray-500 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-winshirt-purple checked:bg-winshirt-purple checked:border-winshirt-purple" onClick={() => handleColorChange(color)} />
                        <Label htmlFor={`color-${color}`} className="text-sm font-medium capitalize peer-checked:font-semibold">
                          {color}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {product.available_sizes && product.available_sizes.length > 0 && (
                <div className="mb-6">
                  <Label className="block text-sm font-medium mb-2">Taille:</Label>
                  <div className="flex gap-2">
                    {product.available_sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        onClick={() => handleSizeChange(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {product.is_customizable && mockup && (
                <Accordion type="single" collapsible className="w-full mb-4">
                  <AccordionItem value="customization">
                    <AccordionTrigger>Personnalisation</AccordionTrigger>
                    <AccordionContent>
                      <div className="py-4">
                        <div className="mb-4">
                          <Label className="inline-flex items-center space-x-2">
                            <Checkbox id="is_customizable" checked={isCustomizationEnabled} onCheckedChange={setIsCustomizationEnabled} />
                            <span className="text-sm font-medium leading-none">Activer la personnalisation</span>
                          </Label>
                        </div>

                        {isCustomizationEnabled && (
                          <>
                            <div className="mb-4">
                              <Label className="block text-sm font-medium mb-2">Ajouter un motif:</Label>
                              <div className="flex flex-wrap gap-2">
                                {designs.map((design) => (
                                  <Button
                                    key={design.id}
                                    variant={customDesign?.id === design.id ? "default" : "outline"}
                                    onClick={() => handleDesignSelect(design)}
                                  >
                                    {design.name}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            <div className="mb-4">
                              <Label htmlFor="customText" className="block text-sm font-medium mb-2">Ajouter un texte:</Label>
                              <Input
                                type="text"
                                id="customText"
                                placeholder="Votre texte ici"
                                value={customText}
                                onChange={handleTextChange}
                              />
                            </div>

                            <div className="mb-4">
                              <Label htmlFor="textColor" className="block text-sm font-medium mb-2">Couleur du texte:</Label>
                              <Input
                                type="color"
                                id="textColor"
                                value={textColor}
                                onChange={handleTextColorChange}
                              />
                            </div>

                            <div className="mb-4">
                              <Label htmlFor="textFont" className="block text-sm font-medium mb-2">Police du texte:</Label>
                              <Select onValueChange={setTextFont} defaultValue={textFont}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Sélectionner une police" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Arial">Arial</SelectItem>
                                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                  <SelectItem value="Courier New">Courier New</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

														<div className="mb-4">
															<Label className="block text-sm font-medium mb-2">Taille de la zone d'impression:</Label>
															<Slider
																defaultValue={[printAreaScale]}
																max={200}
																min={50}
																step={1}
																onValueChange={handlePrintAreaScale}
															/>
															<p className="text-sm text-gray-500 mt-1">
																Taille: {printAreaScale}%
															</p>
														</div>

                            <div className="mb-4">
                              <Label className="block text-sm font-medium mb-2">Télécharger votre propre motif:</Label>
                              <UploadButton
                                endpoint="/api/uploadthing"
                                onClientUploadComplete={(res) => {
                                  // Do something with the response
                                  console.log("Files: ", res);
                                  if (res) {
                                    setDesignUrl(res[0].url);
                                    setDesignName(res[0].name);
                                    toast({
                                      title: "Téléchargement réussi",
                                      description: "Votre motif a été téléchargé avec succès.",
                                    });
                                  }
                                  // alert("Upload Completed!");
                                }}
                                onUploadError={(error: Error) => {
                                  // Do something with the error.
                                  alert(`ERROR! ${error?.message}`);
                                }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  const customization = prepareCustomization();
                  const totalPrice = calculateTotalPrice();

                  const cartItem: ExtendedCartItem = {
                    productId: product.id,
                    name: product.name,
                    price: totalPrice,
                    quantity: quantity,
                    image_url: product.image_url,
                    color: selectedColor,
                    size: selectedSize,
                    customization: customization,
                    // lotteries: selectedLotteries,
                  };

                  handleAddToCart(cartItem);
                }}
              >
                Ajouter au panier <ShoppingCart className="ml-2 h-4 w-4" />
              </Button>
            </GlassCard>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
