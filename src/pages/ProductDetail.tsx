import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { getProductById } from '@/services/product.service';
import { Product, CartItem, Design } from '@/types/supabase.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { getDesigns } from '@/services/design.service';
import { getLotteries } from '@/services/lottery.service';
import { getMockupById } from '@/services/mockup.service';
import { MockupWithColors } from '@/types/mockup.types';
import { generateMockupImage } from '@/services/mockup.service';
import { createDesign } from '@/services/design.service';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Lottery } from '@/types/supabase.types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast: showToast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [activeTab, setActiveTab] = useState('product');
  const [mockup, setMockup] = useState<MockupWithColors | null>(null);
  const [customText, setCustomText] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [textSize, setTextSize] = useState(24);
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const [isGeneratingMockup, setIsGeneratingMockup] = useState(false);
  const [rectoMockupUrl, setRectoMockupUrl] = useState<string | null>(null);
  const [versoMockupUrl, setVersoMockupUrl] = useState<string | null>(null);
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [selectedLottery, setSelectedLottery] = useState<string | null>(null);
  const [isDesignDialogOpen, setIsDesignDialogOpen] = useState(false);
  const [isTextDialogOpen, setIsTextDialogOpen] = useState(false);
  const [isLotteryDialogOpen, setIsLotteryDialogOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedDesignTab, setSelectedDesignTab] = useState('gallery');
  const [uploadedDesignFile, setUploadedDesignFile] = useState<File | null>(null);
  const [uploadedDesignPreview, setUploadedDesignPreview] = useState<string | null>(null);
  const [isUploadingDesign, setIsUploadingDesign] = useState(false);
  const [uploadedDesignName, setUploadedDesignName] = useState('');
  const [isGeneratingDesign, setIsGeneratingDesign] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedDesignUrl, setGeneratedDesignUrl] = useState<string | null>(null);
  const [generatedDesignName, setGeneratedDesignName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fonts = [
    'Arial',
    'Verdana',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Palatino',
    'Garamond',
    'Comic Sans MS',
    'Impact'
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const productData = await getProductById(id);
        setProduct(productData);
        
        // Set default size and color if available
        if (productData?.available_sizes && productData.available_sizes.length > 0) {
          setSelectedSize(productData.available_sizes[0]);
        }
        
        if (productData?.available_colors && productData.available_colors.length > 0) {
          setSelectedColor(productData.available_colors[0]);
        }
        
        // Fetch mockup if product has mockup_id
        if (productData?.mockup_id) {
          const mockupData = await getMockupById(productData.mockup_id);
          setMockup(mockupData as MockupWithColors);
        }
        
        // Fetch designs
        const designsData = await getDesigns();
        setDesigns(designsData);
        
        // Fetch lotteries
        const lotteriesData = await getLotteries();
        setLotteries(lotteriesData);
        
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les détails du produit',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    // Check if size is required
    if (product.available_sizes && product.available_sizes.length > 0 && !selectedSize) {
      toast({
        title: 'Sélection requise',
        description: 'Veuillez sélectionner une taille',
        variant: 'destructive',
      });
      return;
    }
    
    // Check if color is required
    if (product.available_colors && product.available_colors.length > 0 && !selectedColor) {
      toast({
        title: 'Sélection requise',
        description: 'Veuillez sélectionner une couleur',
        variant: 'destructive',
      });
      return;
    }
    
    const item: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image_url: product.image_url,
      color: selectedColor,
      size: selectedSize,
      available_colors: product.available_colors,
      available_sizes: product.available_sizes,
    };
    
    addItem(item);
    toast({
      title: 'Produit ajouté',
      description: `${product.name} a été ajouté à votre panier`,
    });
  };
  
  const handleDesignSelect = (design: Design) => {
    setSelectedDesign(design);
    setIsDesignDialogOpen(true);
  };
  
  const handleAddDesignToCart = async (design: Design) => {
    if (!product) return;
    
    // Create proper Design object with required timestamps
    const designWithTimestamps = {
      ...design,
      created_at: design.created_at || new Date().toISOString(),
      updated_at: design.updated_at || new Date().toISOString(),
    };

    const item: CartItem = {
      productId: product.id,
      name: product.name,
      price: getCustomizationPrice(),
      quantity: 1,
      image_url: product.image_url,
      color: selectedColor,
      size: selectedSize,
      available_colors: product.available_colors,
      available_sizes: product.available_sizes,
      customization: {
        designId: designWithTimestamps.id,
        designUrl: designWithTimestamps.image_url,
        designName: designWithTimestamps.name,
        selectedSize: selectedSize,
        selectedColor: selectedColor,
        mockupRectoUrl: rectoMockupUrl,
        mockupVersoUrl: versoMockupUrl,
        lotteryName: selectedLottery
      }
    };
    
    setIsAddingToCart(true);
    try {
      await addItem(item);
      toast({
        title: 'Produit personnalisé ajouté',
        description: `${product.name} avec design "${design.name}" a été ajouté à votre panier`,
      });
      setIsDesignDialogOpen(false);
      setSelectedDesign(null);
      setRectoMockupUrl(null);
      setVersoMockupUrl(null);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter le produit au panier',
        variant: 'destructive',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const handleTextCustomization = () => {
    setIsTextDialogOpen(true);
  };
  
  const handleLotterySelect = (lotteryName: string) => {
    setSelectedLottery(lotteryName);
    setIsLotteryDialogOpen(true);
  };
  
  const handleGenerateMockup = async () => {
    if (!product || !mockup) return;
    
    setIsGeneratingMockup(true);
    try {
      let mockupData;
      
      if (selectedDesign) {
        // Generate mockup with design
        mockupData = await generateMockupImage({
          mockupId: mockup.id,
          designId: selectedDesign.id,
          color: selectedColor || undefined,
          customText: null,
          textColor: null,
          textFont: null,
          textSize: null,
        });
      } else if (customText) {
        // Generate mockup with text
        mockupData = await generateMockupImage({
          mockupId: mockup.id,
          designId: null,
          color: selectedColor || undefined,
          customText,
          textColor,
          textFont: selectedFont,
          textSize,
        });
      }
      
      if (mockupData) {
        setRectoMockupUrl(mockupData.rectoUrl);
        if (mockupData.versoUrl) {
          setVersoMockupUrl(mockupData.versoUrl);
        }
      }
    } catch (error) {
      console.error('Error generating mockup:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer l\'aperçu',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingMockup(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedDesignFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedDesignPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleUploadDesign = async () => {
    if (!uploadedDesignFile || !uploadedDesignName) {
      toast({
        title: 'Information manquante',
        description: 'Veuillez sélectionner un fichier et donner un nom au design',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUploadingDesign(true);
    try {
      // Upload file to storage
      const fileExt = uploadedDesignFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `designs/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, uploadedDesignFile);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;
      
      // Create design in database
      const newDesign = await createDesign({
        name: uploadedDesignName,
        image_url: publicUrl,
        user_id: user?.id || null,
        is_public: false,
        category: 'custom',
      });
      
      // Add to designs list and select it
      setDesigns([newDesign, ...designs]);
      setSelectedDesign(newDesign);
      
      // Reset upload form
      setUploadedDesignFile(null);
      setUploadedDesignPreview(null);
      setUploadedDesignName('');
      
      toast({
        title: 'Design téléchargé',
        description: 'Votre design a été téléchargé avec succès',
      });
      
      // Switch back to gallery tab
      setSelectedDesignTab('gallery');
    } catch (error) {
      console.error('Error uploading design:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de télécharger le design',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingDesign(false);
    }
  };
  
  const handleGenerateAIDesign = async () => {
    if (!aiPrompt) {
      toast({
        title: 'Prompt requis',
        description: 'Veuillez entrer une description pour générer un design',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGeneratingDesign(true);
    try {
      // Call AI generation service (mock for now)
      // In a real implementation, this would call an API endpoint
      setTimeout(() => {
        const mockUrl = 'https://placehold.co/600x400/png';
        setGeneratedDesignUrl(mockUrl);
        setGeneratedDesignName(`AI Design: ${aiPrompt.substring(0, 20)}...`);
      }, 2000);
      
    } catch (error) {
      console.error('Error generating AI design:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer le design',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingDesign(false);
    }
  };
  
  const handleSaveGeneratedDesign = async () => {
    if (!generatedDesignUrl || !generatedDesignName) return;
    
    try {
      // Create design in database
      const newDesign = await createDesign({
        name: generatedDesignName,
        image_url: generatedDesignUrl,
        user_id: user?.id || null,
        is_public: false,
        category: 'ai-generated',
      });
      
      // Add to designs list and select it
      setDesigns([newDesign, ...designs]);
      setSelectedDesign(newDesign);
      
      // Reset generation form
      setGeneratedDesignUrl(null);
      setGeneratedDesignName('');
      setAiPrompt('');
      
      toast({
        title: 'Design sauvegardé',
        description: 'Votre design généré a été sauvegardé',
      });
      
      // Switch back to gallery tab
      setSelectedDesignTab('gallery');
    } catch (error) {
      console.error('Error saving generated design:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder le design',
        variant: 'destructive',
      });
    }
  };
  
  const handleAddTextToCart = async () => {
    if (!product) return;

    const item: CartItem = {
      productId: product.id,
      name: product.name,
      price: getCustomizationPrice(),
      quantity: 1,
      image_url: product.image_url,
      color: selectedColor,
      size: selectedSize,
      available_colors: product.available_colors,
      available_sizes: product.available_sizes,
      customization: {
        customText: customText,
        textColor: textColor,
        textFont: selectedFont,
        selectedSize: selectedSize,
        selectedColor: selectedColor,
        mockupRectoUrl: rectoMockupUrl,
        mockupVersoUrl: versoMockupUrl,
        lotteryName: selectedLottery
      }
    };
    
    setIsAddingToCart(true);
    try {
      await addItem(item);
      toast({
        title: 'Produit personnalisé ajouté',
        description: `${product.name} avec texte personnalisé a été ajouté à votre panier`,
      });
      setIsTextDialogOpen(false);
      setCustomText('');
      setRectoMockupUrl(null);
      setVersoMockupUrl(null);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter le produit au panier',
        variant: 'destructive',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const handleAddLotteryToCart = async () => {
    if (!product || !selectedLottery) return;
    
    const item: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
      color: selectedColor,
      size: selectedSize,
      available_colors: product.available_colors,
      available_sizes: product.available_sizes,
      customization: {
        lotteryName: selectedLottery,
        selectedSize: selectedSize,
        selectedColor: selectedColor
      }
    };
    
    setIsAddingToCart(true);
    try {
      await addItem(item);
      toast({
        title: 'Produit personnalisé ajouté',
        description: `${product.name} avec loterie "${selectedLottery}" a été ajouté à votre panier`,
      });
      setIsLotteryDialogOpen(false);
      setSelectedLottery(null);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter le produit au panier',
        variant: 'destructive',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const handleAddGeneratedDesignToCart = async (design: Design) => {
    if (!product) return;
    
    // Create proper Design object with required timestamps
    const designWithTimestamps = {
      ...design,
      created_at: design.created_at || new Date().toISOString(),
      updated_at: design.updated_at || new Date().toISOString(),
    };

    const item: CartItem = {
      productId: product.id,
      name: product.name,
      price: getCustomizationPrice(),
      quantity: 1,
      image_url: product.image_url,
      color: selectedColor,
      size: selectedSize,
      available_colors: product.available_colors,
      available_sizes: product.available_sizes,
      customization: {
        designId: designWithTimestamps.id,
        designUrl: designWithTimestamps.image_url,
        designName: designWithTimestamps.name,
        selectedSize: selectedSize,
        selectedColor: selectedColor,
        mockupRectoUrl: rectoMockupUrl,
        mockupVersoUrl: versoMockupUrl,
        lotteryName: selectedLottery
      }
    };
    
    setIsAddingToCart(true);
    try {
      await addItem(item);
      toast({
        title: 'Produit personnalisé ajouté',
        description: `${product.name} avec design généré a été ajouté à votre panier`,
      });
      setGeneratedDesignUrl(null);
      setGeneratedDesignName('');
      setAiPrompt('');
      setSelectedDesignTab('gallery');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter le produit au panier',
        variant: 'destructive',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const getCustomizationPrice = () => {
    if (!product) return 0;
    
    let basePrice = product.price;
    
    // Add design or text customization price
    if (selectedDesign || customText) {
      basePrice += 5; // Example: add 5€ for customization
    }
    
    // Add lottery price if applicable
    if (selectedLottery) {
      basePrice += 2; // Example: add 2€ for lottery
    }
    
    return basePrice;
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="w-full h-[400px] rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="w-3/4 h-10" />
            <Skeleton className="w-1/2 h-6" />
            <Skeleton className="w-full h-32" />
            <div className="space-y-2">
              <Skeleton className="w-1/3 h-6" />
              <div className="flex gap-2">
                <Skeleton className="w-12 h-12 rounded-md" />
                <Skeleton className="w-12 h-12 rounded-md" />
                <Skeleton className="w-12 h-12 rounded-md" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="w-1/3 h-6" />
              <div className="flex gap-2">
                <Skeleton className="w-12 h-8 rounded-md" />
                <Skeleton className="w-12 h-8 rounded-md" />
                <Skeleton className="w-12 h-8 rounded-md" />
              </div>
            </div>
            <Skeleton className="w-full h-12" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold">Produit non trouvé</h2>
        <p className="mt-2">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
        <Button className="mt-4" onClick={() => navigate('/products')}>
          Retour aux produits
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
        
        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-xl font-semibold mt-2">{product.price.toFixed(2)} €</p>
          </div>
          
          <p className="text-gray-300">{product.description}</p>
          
          {/* Color Selection */}
          {product.available_colors && product.available_colors.length > 0 && (
            <div className="space-y-2">
              <Label>Couleur</Label>
              <div className="flex flex-wrap gap-2">
                {product.available_colors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? 'border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Couleur ${color}`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Size Selection */}
          {product.available_sizes && product.available_sizes.length > 0 && (
            <div className="space-y-2">
              <Label>Taille</Label>
              <div className="flex flex-wrap gap-2">
                {product.available_sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size 
                        ? 'bg-white text-black' 
                        : 'bg-transparent border-white/30'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity */}
          <div className="space-y-2">
            <Label>Quantité</Label>
            <div className="flex items-center w-32 border border-white/30 rounded-md">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-r-none"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center">{quantity}</div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-l-none"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <Button 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5" />
            Ajouter au panier
          </Button>
          
          {/* Customization Options */}
          {mockup && (
            <div className="space-y-4 pt-4">
              <Separator />
              <h3 className="text-xl font-semibold">Personnalisation</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="bg-black/30 border-white/10 hover:border-white/30 transition-all cursor-pointer" onClick={() => setIsDesignDialogOpen(true)}>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-32">
                    <div className="text-3xl mb-2">🎨</div>
                    <div className="font-medium">Ajouter un design</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/30 border-white/10 hover:border-white/30 transition-all cursor-pointer" onClick={handleTextCustomization}>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-32">
                    <div className="text-3xl mb-2">✏️</div>
                    <div className="font-medium">Ajouter du texte</div>
                  </CardContent>
                </Card>
                
                {lotteries.length > 0 && (
                  <Card className="bg-black/30 border-white/10 hover:border-white/30 transition-all cursor-pointer" onClick={() => setIsLotteryDialogOpen(true)}>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center h-32">
                      <div className="text-3xl mb-2">🎟️</div>
                      <div className="font-medium">Ajouter une loterie</div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Product Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="shipping">Livraison</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4 p-4 bg-black/30 rounded-md">
            <div className="prose prose-invert max-w-none">
              <p>{product.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="details" className="mt-4 p-4 bg-black/30 rounded-md">
            <div className="prose prose-invert max-w-none">
              <ul>
                <li>Matériau: {product.material || 'Non spécifié'}</li>
                <li>Poids: {product.weight ? `${product.weight}g` : 'Non spécifié'}</li>
                <li>Dimensions: {product.dimensions || 'Non spécifiées'}</li>
                <li>Origine: {product.origin || 'Non spécifiée'}</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="mt-4 p-4 bg-black/30 rounded-md">
            <div className="prose prose-invert max-w-none">
              <p>Livraison standard en 3-5 jours ouvrables.</p>
              <p>Livraison express disponible en 24-48h (supplément).</p>
              <p>Livraison gratuite pour les commandes de plus de 50€.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Design Selection Dialog */}
      <Dialog open={isDesignDialogOpen} onOpenChange={setIsDesignDialogOpen}>
        <DialogContent className="bg-black/50 backdrop-blur-xl border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choisir un design</DialogTitle>
            <DialogDescription>
              Sélectionnez un design à appliquer sur votre produit
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={selectedDesignTab} onValueChange={setSelectedDesignTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="gallery">Galerie</TabsTrigger>
              <TabsTrigger value="upload">Télécharger</TabsTrigger>
              <TabsTrigger value="generate">Générer avec IA</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gallery" className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {designs.map((design) => (
                  <div 
                    key={design.id} 
                    className={`relative aspect-square rounded-md overflow-hidden border-2 cursor-pointer ${
                      selectedDesign?.id === design.id ? 'border-white' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedDesign(design)}
                  >
                    <img 
                      src={design.image_url} 
                      alt={design.name} 
                      className="w-full h-full object-cover"
                    />
                    {selectedDesign?.id === design.id && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Badge variant="outline">Sélectionné</Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {designs.length === 0 && (
                <div className="text-center py-8">
                  <p>Aucun design disponible</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upload" className="mt-4 space-y-4">
              <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                
                {uploadedDesignPreview ? (
                  <div className="space-y-4">
                    <img 
                      src={uploadedDesignPreview} 
                      alt="Design preview" 
                      className="max-h-64 mx-auto"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setUploadedDesignFile(null);
                        setUploadedDesignPreview(null);
                      }}
                    >
                      Changer l'image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-white/70">Cliquez pour sélectionner une image ou glissez-déposez</p>
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Sélectionner un fichier
                    </Button>
                  </div>
                )}
              </div>
              
              {uploadedDesignPreview && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="design-name">Nom du design</Label>
                    <Input 
                      id="design-name" 
                      value={uploadedDesignName} 
                      onChange={(e) => setUploadedDesignName(e.target.value)}
                      placeholder="Mon design personnalisé"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleUploadDesign} 
                    disabled={isUploadingDesign || !uploadedDesignName}
                    className="w-full"
                  >
                    {isUploadingDesign ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Téléchargement...
                      </>
                    ) : (
                      'Télécharger et utiliser ce design'
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="generate" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-prompt">Décrivez le design que vous souhaitez</Label>
                <Textarea 
                  id="ai-prompt" 
                  value={aiPrompt} 
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Par exemple: Un chat avec des lunettes de soleil sur une planche de surf"
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={handleGenerateAIDesign} 
                disabled={isGeneratingDesign || !aiPrompt}
                className="w-full"
              >
                {isGeneratingDesign ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  'Générer un design avec IA'
                )}
              </Button>
              
              {generatedDesignUrl && (
                <div className="space-y-4 pt-4">
                  <div className="border border-white/30 rounded-lg p-4">
                    <img 
                      src={generatedDesignUrl} 
                      alt="Generated design" 
                      className="max-h-64 mx-auto"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="generated-design-name">Nom du design</Label>
                    <Input 
                      id="generated-design-name" 
                      value={generatedDesignName} 
                      onChange={(e) => setGeneratedDesignName(e.target.value)}
                      placeholder="Mon design généré"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setGeneratedDesignUrl(null);
                        setGeneratedDesignName('');
                      }}
                      className="flex-1"
                    >
                      Régénérer
                    </Button>
                    
                    <Button 
                      onClick={handleSaveGeneratedDesign} 
                      disabled={!generatedDesignName}
                      className="flex-1"
                    >
                      Utiliser ce design
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {selectedDesign && (
            <div className="mt-6 space-y-4">
              <Separator />
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <h4 className="font-medium mb-2">Design sélectionné</h4>
                  <div className="border border-white/30 rounded-lg p-2">
                    <img 
                      src={selectedDesign.image_url} 
                      alt={selectedDesign.name} 
                      className="max-h-48 mx-auto"
                    />
                    <p className="text-center mt-2">{selectedDesign.name}</p>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium mb-2">Aperçu</h4>
                  <div className="border border-white/30 rounded-lg p-2 h-full flex items-center justify-center">
                    {isGeneratingMockup ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                        <p>Génération de l'aperçu...</p>
                      </div>
                    ) : rectoMockupUrl ? (
                      <img 
                        src={rectoMockupUrl} 
                        alt="Mockup preview" 
                        className="max-h-48 mx-auto"
                      />
                    ) : (
                      <Button onClick={handleGenerateMockup}>
                        Générer un aperçu
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => handleAddDesignToCart(selectedDesign)}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ajout en cours...
                  </>
                ) : (
                  'Ajouter au panier avec ce design'
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Text Customization Dialog */}
      <Dialog open={isTextDialogOpen} onOpenChange={setIsTextDialogOpen}>
        <DialogContent className="bg-black/50 backdrop-blur-xl border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Personnaliser avec du texte</DialogTitle>
            <DialogDescription>
              Ajoutez votre texte personnalisé sur le produit
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-text">Votre texte</Label>
                <Textarea 
                  id="custom-text" 
                  value={customText} 
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Entrez votre texte ici"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="text-color">Couleur du texte</Label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    id="text-color" 
                    value={textColor} 
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-10 h-10 rounded-md border-0 cursor-pointer"
                  />
                  <span>{textColor}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="text-font">Police</Label>
                <Select value={selectedFont} onValueChange={setSelectedFont}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une police" />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map((font) => (
                      <SelectItem key={font} value={font}>
                        <span style={{ fontFamily: font }}>{font}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="text-size">Taille du texte: {textSize}px</Label>
                <Slider 
                  id="text-size"
                  min={12} 
                  max={72} 
                  step={1} 
                  value={[textSize]} 
                  onValueChange={(value) => setTextSize(value[0])}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Aperçu</h4>
              <div className="border border-white/30 rounded-lg p-4 h-64 flex items-center justify-center">
                {isGeneratingMockup ? (
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p>Génération de l'aperçu...</p>
                  </div>
                ) : rectoMockupUrl ? (
                  <img 
                    src={rectoMockupUrl} 
                    alt="Mockup preview" 
                    className="max-h-full mx-auto"
                  />
                ) : customText ? (
                  <Button onClick={handleGenerateMockup}>
                    Générer un aperçu
                  </Button>
                ) : (
                  <p className="text-white/50">Entrez du texte pour générer un aperçu</p>
                )}
              </div>
              
              <div className="pt-4">
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="font-medium mb-2">Aperçu du texte</div>
                  <div 
                    className="min-h-16 p-4 border border-white/20 rounded-md flex items-center justify-center"
                    style={{ 
                      color: textColor, 
                      fontFamily: selectedFont,
                      fontSize: `${textSize}px`
                    }}
                  >
                    {customText || 'Votre texte ici'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsTextDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleAddTextToCart} 
              disabled={!customText || isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                'Ajouter au panier avec ce texte'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Lottery Selection Dialog */}
      <Dialog open={isLotteryDialogOpen} onOpenChange={setIsLotteryDialogOpen}>
        <DialogContent className="bg-black/50 backdrop-blur-xl border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Choisir une loterie</DialogTitle>
            <DialogDescription>
              Sélectionnez une loterie à associer à votre produit
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <RadioGroup value={selectedLottery || ''} onValueChange={setSelectedLottery}>
              <div className="space-y-2">
                {lotteries.map((lottery) => (
                  <div
                    key={lottery.id}
                    className={`flex items-center space-x-2 rounded-lg border p-4 ${
                      selectedLottery === lottery.name 
                        ? 'border-white bg-white/10' 
                        : 'border-white/20'
                    }`}
                  >
                    <RadioGroupItem value={lottery.name} id={lottery.id} />
                    <Label htmlFor={lottery.id} className="flex-1 cursor-pointer">
                      <div className="font-medium">{lottery.name}</div>
                      <div className="text-sm text-white/70">{lottery.description}</div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            
            {lotteries.length === 0 && (
              <div className="text-center py-4">
                <p>Aucune loterie disponible</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLotteryDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleAddLotteryToCart} 
              disabled={!selectedLottery || isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                'Ajouter au panier avec cette loterie'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;
