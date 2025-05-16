
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShoppingCart } from '@/context/ShoppingCartContext';
import { useToast } from '@/hooks/use-toast';
import { Product as ProductType, LotteryItem, Design } from '@/types/supabase.types';
import { fetchProductById, fetchAllLotteries, fetchAllDesigns } from '@/services/api.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { UploadButton } from "@/components/ui/upload-button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { ExternalLink } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItemToCart } = useShoppingCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [selectedLotteries, setSelectedLotteries] = useState<LotteryItem[]>([]);
  const [lotteries, setLotteries] = useState<LotteryItem[]>([]);
  const [isCustomizationEnabled, setIsCustomizationEnabled] = useState<boolean>(false);
  const [textFront, setTextFront] = useState<string>('');
  const [textBack, setTextBack] = useState<string>('');
  const [designId, setDesignId] = useState<string | null>(null);
  const [designUrl, setDesignUrl] = useState<string | null>(null);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isDesignUploaded, setIsDesignUploaded] = useState<boolean>(false);
  const [uploadedDesignUrl, setUploadedDesignUrl] = useState<string | null>(null);
  const [customDesignPrice, setCustomDesignPrice] = useState<number>(5);
  const [customTextPrice, setCustomTextPrice] = useState<number>(3);
  const [totalCustomizationPrice, setTotalCustomizationPrice] = useState<number>(0);
  const [isAddingDesignToCart, setIsAddingDesignToCart] = useState<boolean>(false);
  const [isAddingTextToCart, setIsAddingTextToCart] = useState<boolean>(false);
  const [isAddingLotteryToCart, setIsAddingLotteryToCart] = useState<boolean>(false);
  const [isAddingProductToCart, setIsAddingProductToCart] = useState<boolean>(false);
  const [isMockupAvailable, setIsMockupAvailable] = useState<boolean>(false);
  const [isDesignSelectionOpen, setIsDesignSelectionOpen] = useState<boolean>(false);
  const [isLotterySelectionOpen, setIsLotterySelectionOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const fetchedProduct = await fetchProductById(id);
          if (fetchedProduct) {
            setProduct(fetchedProduct);
            setAvailableColors(fetchedProduct.available_colors || []);
            setAvailableSizes(fetchedProduct.available_sizes || []);
            setIsCustomizationEnabled(fetchedProduct.is_customizable || false);
          } else {
            toast({
              title: "Erreur",
              description: "Produit non trouvé."
            });
            navigate('/products');
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Erreur lors du chargement du produit");
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement du produit."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, toast]);

  useEffect(() => {
    const fetchLotteries = async () => {
      try {
        const activeLotteries = await fetchAllLotteries();
        // Filter active lotteries
        const filteredLotteries = activeLotteries.filter(lottery => lottery.is_active);
        setLotteries(filteredLotteries || []);
      } catch (err) {
        console.error("Error fetching lotteries:", err);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des loteries."
        });
      }
    };

    fetchLotteries();
  }, [toast]);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const activeDesigns = await fetchAllDesigns();
        // Filter active designs
        const filteredDesigns = activeDesigns.filter(design => design.is_active);
        setDesigns(filteredDesigns || []);
      } catch (err) {
        console.error("Error fetching designs:", err);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des designs."
        });
      }
    };

    fetchDesigns();
  }, [toast]);

  useEffect(() => {
    if (product?.mockup_id) {
      setIsMockupAvailable(true);
    } else {
      setIsMockupAvailable(false);
    }
  }, [product?.mockup_id]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleLotterySelection = (lottery: LotteryItem) => {
    setSelectedLotteries(prev => {
      if (prev.find(l => l.id === lottery.id)) {
        return prev.filter(l => l.id !== lottery.id);
      } else {
        return [...prev, lottery];
      }
    });
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleTextFrontChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextFront(event.target.value);
  };

  const handleTextBackChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextBack(event.target.value);
  };

  const handleDesignSelection = (design: Design) => {
    setDesignId(design.id);
    setDesignUrl(design.image_url);
    setIsDesignSelectionOpen(false);
  };

  const handleDesignUpload = (url: string) => {
    setUploadedDesignUrl(url);
    setIsDesignUploaded(true);
  };

  const calculateTotalPrice = useCallback(() => {
    let basePrice = product ? product.price : 0;
    let customizationPrice = 0;

    if (isCustomizationEnabled) {
      if (designId || uploadedDesignUrl) {
        customizationPrice += customDesignPrice;
      }
      if (textFront) {
        customizationPrice += customTextPrice;
      }
      if (textBack) {
        customizationPrice += customTextPrice;
      }
    }

    return (basePrice + customizationPrice) * quantity;
  }, [product, quantity, isCustomizationEnabled, designId, uploadedDesignUrl, customDesignPrice, customTextPrice, textFront, textBack]);

  useEffect(() => {
    setTotalCustomizationPrice(calculateTotalPrice() - (product ? product.price * quantity : 0));
  }, [calculateTotalPrice, product?.price, quantity]);

  const handleAddToCart = async () => {
    if (!product) {
      toast({
        title: "Erreur",
        description: "Produit non trouvé."
      });
      return;
    }

    if (!selectedColor && availableColors.length > 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une couleur."
      });
      return;
    }

    if (!selectedSize && availableSizes.length > 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une taille."
      });
      return;
    }

    const customizationData = {
      text_front: textFront,
      text_back: textBack,
      design_id: designId,
      design_url: designUrl || uploadedDesignUrl,
      selectedLotteries: selectedLotteries.map(l => l.id)
    };

    setIsAddingProductToCart(true);

    try {
      await addItemToCart({
        productId: product.id,
        name: product.name,
        price: calculateTotalPrice(),
        quantity: quantity,
        color: selectedColor,
        size: selectedSize,
        image_url: product.image_url,
        customization: customizationData
      });

      toast({
        title: "Succès",
        description: "Produit ajouté au panier!"
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout au panier."
      });
    } finally {
      setIsAddingProductToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-primary animate-spin mb-4"></div>
          <p className="text-lg">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-xl font-semibold mb-4">Une erreur est survenue</h2>
        <p className="mb-8">{error || "Impossible de charger les détails du produit"}</p>
        <Button onClick={() => navigate('/products')}>Retourner aux produits</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img src={product.image_url} alt={product.name} className="w-full rounded-lg shadow-md" />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>

          {/* Price */}
          <div className="flex items-center mb-4">
            <span className="text-xl font-bold">{calculateTotalPrice().toFixed(2)} €</span>
            {totalCustomizationPrice > 0 && (
              <Badge className="ml-2">{totalCustomizationPrice.toFixed(2)} € Custom</Badge>
            )}
          </div>

          {/* Color Selection */}
          {availableColors.length > 0 && (
            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700 mb-2">Couleur:</Label>
              <RadioGroup defaultValue={selectedColor} className="flex items-center space-x-2">
                {availableColors.map((color) => (
                  <div key={color} className="flex items-center">
                    <RadioGroupItem value={color} id={`color-${color}`} className="sr-only" onClick={() => handleColorChange(color)} />
                    <Label htmlFor={`color-${color}`} className="cursor-pointer">
                      <div
                        className="w-6 h-6 rounded-full shadow-md"
                        style={{ backgroundColor: color }}
                      />
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Size Selection */}
          {availableSizes.length > 0 && (
            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700 mb-2">Taille:</Label>
              <Select onValueChange={handleSizeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sélectionner une taille" defaultValue={selectedSize} />
                </SelectTrigger>
                <SelectContent>
                  {availableSizes.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="mb-4">
            <Label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">Quantité:</Label>
            <Input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              className="w-24"
            />
          </div>

          {/* Customization Options */}
          {isCustomizationEnabled && (
            <div className="mb-6 p-4 rounded-md border">
              <h3 className="text-lg font-semibold mb-3">Personnalisation</h3>

              {/* Text Customization */}
              <div className="mb-4">
                <Label htmlFor="textFront" className="block text-sm font-medium text-gray-700 mb-2">Texte Avant:</Label>
                <Textarea
                  id="textFront"
                  value={textFront}
                  onChange={handleTextFrontChange}
                  placeholder="Ajouter un texte à l'avant"
                  className="w-full"
                />
                {textFront && <Badge className="mt-1">{customTextPrice.toFixed(2)} €</Badge>}
              </div>

              <div className="mb-4">
                <Label htmlFor="textBack" className="block text-sm font-medium text-gray-700 mb-2">Texte Arrière:</Label>
                <Textarea
                  id="textBack"
                  value={textBack}
                  onChange={handleTextBackChange}
                  placeholder="Ajouter un texte à l'arrière"
                  className="w-full"
                />
                {textBack && <Badge className="mt-1">{customTextPrice.toFixed(2)} €</Badge>}
              </div>

              {/* Design Selection */}
              <div className="mb-4">
                <Label className="block text-sm font-medium text-gray-700 mb-2">Design:</Label>
                <div className="flex items-center space-x-4">
                  {designUrl || uploadedDesignUrl ? (
                    <div className="relative">
                      <img
                        src={designUrl || uploadedDesignUrl}
                        alt="Selected Design"
                        className="w-20 h-20 rounded-md object-cover"
                      />
                      <Button variant="outline" size="icon" className="absolute top-0 right-0 h-6 w-6 p-0" onClick={() => { setDesignId(null); setDesignUrl(null); setUploadedDesignUrl(null); setIsDesignUploaded(false); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
                      </Button>
                    </div>
                  ) : (
                    <Dialog open={isDesignSelectionOpen} onOpenChange={setIsDesignSelectionOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">Sélectionner un design</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Sélectionner un design</DialogTitle>
                          <DialogDescription>
                            Choisissez un design existant.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          {designs.map((design) => (
                            <Button key={design.id} variant="ghost" className="justify-start" onClick={() => handleDesignSelection(design)}>
                              <img src={design.image_url} alt={design.name} className="w-10 h-10 rounded-md object-cover mr-2" />
                              {design.name}
                            </Button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {!designUrl && !uploadedDesignUrl && (
                    <>
                      <div className="shrink-0">
                        <UploadButton
                          onUpload={handleDesignUpload}
                          targetFolder="designs"
                          acceptTypes=".png,.jpg,.jpeg"
                        />
                      </div>
                    </>
                  )}
                  {(designId || uploadedDesignUrl) && <Badge>{customDesignPrice.toFixed(2)} €</Badge>}
                </div>
              </div>

              {/* Lottery Selection */}
              <div className="mb-4">
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionnez vos loteries:
                </Label>
                <Dialog open={isLotterySelectionOpen} onOpenChange={setIsLotterySelectionOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Sélectionner des loteries</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Sélectionner des lotteries</DialogTitle>
                      <DialogDescription>
                        Choisissez les lotteries auxquelles vous souhaitez participer.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {lotteries.map((lottery) => (
                        <div key={lottery.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`lottery-${lottery.id}`}
                            checked={!!selectedLotteries.find(l => l.id === lottery.id)}
                            onCheckedChange={() => handleLotterySelection(lottery)}
                          />
                          <Label htmlFor={`lottery-${lottery.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {lottery.title}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                {selectedLotteries.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedLotteries.map((lottery) => (
                      <Badge key={lottery.id}>{lottery.title}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={isAddingProductToCart}>
            {isAddingProductToCart ? 'Ajout au panier...' : 'Ajouter au panier'}
          </Button>

          {/* Mockup Preview */}
          {isMockupAvailable && (
            <Button variant="link" className="mt-4" onClick={() => navigate(`/mockup/${product.mockup_id}`)}>
              Voir la maquette <ExternalLink className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
