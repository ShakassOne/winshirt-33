
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  fetchProductById,
  fetchRelatedProducts,
  fetchAllDesigns,
  fetchMockupById
} from '@/services/api.service';
import { Product, Design, Mockup } from '@/types/supabase.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GlassCard from '@/components/ui/GlassCard';
import { ShoppingCart, CheckCircle, Truck, RotateCcw, Share2, Heart, Check } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { UploadButton } from '@/components/ui/upload-button';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useSession } from '@/hooks/use-session';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CustomizationAccordion from '@/components/product/CustomizationAccordion';

interface DesignOption {
  value: string;
  label: string;
  imageUrl: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [designs, setDesigns] = useState<Design[] | null>(null);
  const [mockup, setMockup] = useState<Mockup | null>(null);
  const [selectedFrontDesign, setSelectedFrontDesign] = useState<string | null>(null);
  const [selectedBackDesign, setSelectedBackDesign] = useState<string | null>(null);
  const [frontDesignUrl, setFrontDesignUrl] = useState<string | null>(null);
  const [backDesignUrl, setBackDesignUrl] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [frontTextSize, setFrontTextSize] = useState(5);
  const [backTextSize, setBackTextSize] = useState(5);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  const { addItem } = useCart();
  const { toast } = useToast();
  const { session } = useSession();

  // Check if on mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set share link
  useEffect(() => {
    setShareLink(window.location.href);
  }, []);

  // Fetch product data
  useEffect(() => {
    const loadProductData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setIsError(false);
      
      try {
        // Fetch product details
        const productData = await fetchProductById(id);
        if (!productData) {
          setIsError(true);
          throw new Error('Product not found');
        }
        
        setProduct(productData);
        setIsCustomizable(productData.is_customizable);
        
        if (productData.available_colors?.length > 0) {
          setSelectedColor(productData.available_colors[0]);
        }
        
        if (productData.available_sizes?.length > 0) {
          setSelectedSize(productData.available_sizes[0]);
        }
        
        // Fetch related products
        const relatedData = await fetchRelatedProducts(id);
        setRelatedProducts(relatedData || []);
        
        // Fetch mockup if customizable
        if (productData.is_customizable && productData.mockup_id) {
          const mockupData = await fetchMockupById(productData.mockup_id);
          setMockup(mockupData);
        }
        
        // Fetch available designs
        const designsData = await fetchAllDesigns();
        setDesigns(designsData);
        
      } catch (error) {
        console.error('Error loading product:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProductData();
  }, [id]);

  // Handle design selection
  const handleDesignSelect = (designId: string, position: 'front' | 'back') => {
    if (!designs) return;
    
    const selectedDesign = designs.find(design => design.id === designId);
    if (!selectedDesign) return;
    
    if (position === 'front') {
      setSelectedFrontDesign(designId);
      setFrontDesignUrl(selectedDesign.image_url);
    } else {
      setSelectedBackDesign(designId);
      setBackDesignUrl(selectedDesign.image_url);
    }
  };
  
  // Add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    try {
      const customizationData = isCustomizable ? {
        id: uuidv4(),
        frontDesign: selectedFrontDesign ? {
          designId: selectedFrontDesign,
          designUrl: frontDesignUrl || '',
        } : null,
        backDesign: selectedBackDesign ? {
          designId: selectedBackDesign,
          designUrl: backDesignUrl || '',
        } : null,
        frontText: frontText || null,
        backText: backText || null,
        frontTextSize: frontTextSize,
        backTextSize: backTextSize,
      } : null;
      
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        color: selectedColor,
        size: selectedSize,
        image_url: product.image_url,
        customization: customizationData ? {
          designId: customizationData.id,
          designUrl: (frontDesignUrl || backDesignUrl) || '',
          printPosition: frontDesignUrl ? 'front' : 'back',
          printSize: 'medium',
          text: frontText || backText ? {
            content: frontText || backText || '',
            font: 'Arial',
            color: '#000000',
            printPosition: frontText ? 'front' : 'back',
          } : undefined,
        } : undefined,
      });
      
      toast({
        title: 'Produit ajouté au panier',
        description: `${product.name} a été ajouté à votre panier`,
        variant: 'default',
      });
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter ce produit au panier',
        variant: 'destructive',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  // Handle quantity change
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  // Copy share link
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-lg overflow-hidden">
              <Skeleton className="h-[400px] w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
              <div className="space-y-2 mt-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-10 w-full mt-6" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Error state
  if (isError || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Produit non trouvé</h1>
          <p className="mb-8">Nous n'avons pas pu trouver le produit que vous recherchez.</p>
          <Button onClick={() => navigate('/products')}>
            Voir tous les produits
          </Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Generate design options from designs
  const designOptions: DesignOption[] = designs?.map(design => ({
    value: design.id,
    label: design.name,
    imageUrl: design.image_url,
  })) || [];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10 p-2">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="ml-2"
                  onClick={() => setIsShareSheetOpen(true)}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xl font-bold text-winshirt-purple mt-2">
                {product.price.toFixed(2)} €
              </p>
              
              <div className="flex items-center mt-2">
                <Badge variant="outline" className="mr-2">
                  {product.category}
                </Badge>
                {product.tickets_offered > 0 && (
                  <Badge className="bg-winshirt-gold text-black">
                    {product.tickets_offered} tickets
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-white/80">{product.description}</p>
            </div>
            
            {/* Product Options */}
            <div className="space-y-4">
              {/* Colors */}
              {product.available_colors && product.available_colors.length > 0 && (
                <div>
                  <Label htmlFor="color">Couleur</Label>
                  <div className="flex gap-2 mt-2">
                    {product.available_colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-winshirt-purple ${
                          selectedColor === color ? 'ring-2 ring-winshirt-purple' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={color}
                      >
                        {selectedColor === color && (
                          <Check className="h-4 w-4 text-white mx-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Sizes */}
              {product.available_sizes && product.available_sizes.length > 0 && (
                <div>
                  <Label htmlFor="size">Taille</Label>
                  <Select 
                    value={selectedSize || ''} 
                    onValueChange={setSelectedSize}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une taille" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.available_sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Quantity */}
              <div>
                <Label htmlFor="quantity">Quantité</Label>
                <div className="flex items-center mt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="mx-4 font-medium w-8 text-center">{quantity}</span>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={incrementQuantity}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Customization Accordion */}
            {product.is_customizable && (
              <CustomizationAccordion>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="front-design">Design avant</Label>
                    <Select 
                      value={selectedFrontDesign || ''} 
                      onValueChange={(value) => handleDesignSelect(value, 'front')}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un design" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Aucun</SelectItem>
                        {designOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="back-design">Design arrière</Label>
                    <Select 
                      value={selectedBackDesign || ''} 
                      onValueChange={(value) => handleDesignSelect(value, 'back')}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un design" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Aucun</SelectItem>
                        {designOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="front-text">Texte avant</Label>
                    <Input
                      id="front-text"
                      value={frontText}
                      onChange={(e) => setFrontText(e.target.value)}
                      placeholder="Ajouter du texte sur l'avant"
                    />
                    {frontText && (
                      <div className="mt-2">
                        <Label htmlFor="front-text-size">Taille du texte</Label>
                        <Slider
                          id="front-text-size"
                          value={[frontTextSize]}
                          onValueChange={(values) => setFrontTextSize(values[0])}
                          max={10}
                          step={1}
                          className="mt-2"
                        />
                        <div className="flex justify-between text-xs text-white/50 mt-1">
                          <span>Petit</span>
                          <span>Grand</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="back-text">Texte arrière</Label>
                    <Input
                      id="back-text"
                      value={backText}
                      onChange={(e) => setBackText(e.target.value)}
                      placeholder="Ajouter du texte sur l'arrière"
                    />
                    {backText && (
                      <div className="mt-2">
                        <Label htmlFor="back-text-size">Taille du texte</Label>
                        <Slider
                          id="back-text-size"
                          value={[backTextSize]}
                          onValueChange={(values) => setBackTextSize(values[0])}
                          max={10}
                          step={1}
                          className="mt-2"
                        />
                        <div className="flex justify-between text-xs text-white/50 mt-1">
                          <span>Petit</span>
                          <span>Grand</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CustomizationAccordion>
            )}
            
            {/* Add to Cart Button */}
            <Button 
              className="w-full bg-gradient-purple" 
              size="lg" 
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <span>Ajout en cours...</span>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  <span>Ajouter au panier</span>
                </>
              )}
            </Button>
            
            {/* Product Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-winshirt-purple" />
                <span>Qualité premium</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-winshirt-purple" />
                <span>Livraison sous 2-4 jours</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-5 w-5 text-winshirt-purple" />
                <span>Retours sous 30 jours</span>
              </div>
              {product.tickets_offered > 0 && (
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-winshirt-gold" />
                  <span>{product.tickets_offered} tickets de loterie offerts</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <GlassCard key={relatedProduct.id} className="h-full">
                  <Link to={`/products/${relatedProduct.id}`} className="block h-full">
                    <div className="aspect-square rounded-t-lg overflow-hidden">
                      <img 
                        src={relatedProduct.image_url} 
                        alt={relatedProduct.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{relatedProduct.name}</h3>
                      <p className="text-white/70 text-sm">{relatedProduct.category}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold">{relatedProduct.price.toFixed(2)} €</span>
                        {relatedProduct.tickets_offered > 0 && (
                          <Badge className="bg-winshirt-gold text-black">
                            {relatedProduct.tickets_offered} tickets
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </main>
      
      {/* Share Sheet */}
      <Sheet open={isShareSheetOpen} onOpenChange={setIsShareSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Partager ce produit</SheetTitle>
            <SheetDescription>
              Copiez le lien ci-dessous pour partager ce produit avec vos amis.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <div className="flex items-center">
              <Input 
                readOnly 
                value={shareLink} 
                className="mr-2"
              />
              <Button onClick={copyShareLink}>
                {isCopied ? 'Copié !' : 'Copier'}
              </Button>
            </div>
            <div className="mt-6 space-y-4">
              <h4 className="text-sm font-medium">Partager sur les réseaux sociaux</h4>
              <div className="flex space-x-4">
                <Button variant="outline" className="flex-1" asChild>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`} target="_blank" rel="noopener noreferrer">
                    Facebook
                  </a>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
