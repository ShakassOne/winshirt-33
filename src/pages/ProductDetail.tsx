import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById, fetchRelatedProducts } from '@/services/api.service';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Heart, Share2, Star, Info, Check, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { Product } from '@/types/supabase.types';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/ui/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [customText, setCustomText] = useState('');
  const [customTextColor, setCustomTextColor] = useState('#ffffff');
  const [customTextFont, setCustomTextFont] = useState('Arial');
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id,
  });
  
  const { data: relatedProducts, isLoading: isLoadingRelated } = useQuery({
    queryKey: ['relatedProducts', product?.category],
    queryFn: () => fetchRelatedProducts(product?.category as string, id as string),
    enabled: !!product?.category,
  });
  
  // Set default color and size when product loads
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
    
    // Fixed customization object that matches the required structure
    const customization = product.is_customizable && customText ? {
      designId: 'placeholder-design-id',
      designUrl: 'placeholder-url',
      printPosition: 'front' as const,
      printSize: 'A4',
      text: {
        content: customText,
        color: customTextColor,
        font: customTextFont,
        printPosition: 'front' as const, // Added the missing printPosition property
      }
    } : undefined;
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      color: selectedColor,
      size: selectedSize,
      image_url: product.image_url,
      customization
    });
    
    toast.success("Produit ajouté au panier");
  };
  
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col product-detail-page">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Skeleton className="aspect-square w-full rounded-lg" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col product-detail-page">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
            <p className="mb-6">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
            <Button asChild>
              <Link to="/products">Retour aux produits</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Rating and review placeholders (since the product type doesn't have these)
  const rating = 5; // Default rating
  const reviewsCount = 0; // Default reviews count
  
  return (
    <div className="min-h-screen flex flex-col product-detail-page">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white">Accueil</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/products" className="hover:text-white">Produits</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">{product.name}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 product-mobile-layout">
            {/* Product Image */}
            <div className="product-image">
              <div className="glass-card overflow-hidden">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            {/* Product Info */}
            <div className="space-y-6 product-customization">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={cn(
                          "h-4 w-4", 
                          star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        )} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-400">
                    {reviewsCount} avis
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">{product.price.toFixed(2)} €</span>
                </div>
              </div>
              
              <p className="text-gray-300">{product.description}</p>
              
              {/* Product Customization */}
              <div className="space-y-4">
                {/* Color Selection */}
                {product.available_colors && product.available_colors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Couleur</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.available_colors.map((color) => (
                        <button
                          key={color}
                          className={cn(
                            "w-8 h-8 rounded-full border-2",
                            selectedColor === color ? "border-white" : "border-transparent"
                          )}
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
                  <div>
                    <h3 className="text-sm font-medium mb-2">Taille</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.available_sizes.map((size) => (
                        <button
                          key={size}
                          className={cn(
                            "px-3 py-1 rounded border",
                            selectedSize === size 
                              ? "bg-white text-black border-white" 
                              : "border-gray-600 hover:border-white"
                          )}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Custom Text (if customizable) */}
                {product.is_customizable && (
                  <div className="glass-card p-4 space-y-4">
                    <h3 className="font-medium">Personnalisation</h3>
                    
                    <div>
                      <Label htmlFor="customText">Texte personnalisé</Label>
                      <Textarea
                        id="customText"
                        placeholder="Entrez votre texte ici..."
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="textColor">Couleur du texte</Label>
                        <div className="flex mt-1">
                          <Input
                            id="textColor"
                            type="color"
                            value={customTextColor}
                            onChange={(e) => setCustomTextColor(e.target.value)}
                            className="w-10 h-10 p-1 rounded-l-md"
                          />
                          <Input
                            type="text"
                            value={customTextColor}
                            onChange={(e) => setCustomTextColor(e.target.value)}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="textFont">Police</Label>
                        <select
                          id="textFont"
                          value={customTextFont}
                          onChange={(e) => setCustomTextFont(e.target.value)}
                          className="w-full mt-1 rounded-md bg-white/5 border border-white/10 p-2"
                        >
                          <option value="Arial">Arial</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Courier New">Courier New</option>
                          <option value="Georgia">Georgia</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Quantity and Add to Cart */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-600 rounded-md">
                    <button
                      className="px-3 py-1 text-lg"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1">{quantity}</span>
                    <button
                      className="px-3 py-1 text-lg"
                      onClick={incrementQuantity}
                    >
                      +
                    </button>
                  </div>
                  
                  <Button 
                    className="flex-1" 
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Ajouter au panier
                  </Button>
                </div>
                
                {/* Additional Actions */}
                <div className="flex gap-4">
                  <Button variant="outline" size="sm">
                    <Heart className="mr-2 h-4 w-4" />
                    Favoris
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Partager
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Details Tabs */}
          <div className="mt-12 product-details">
            <Tabs defaultValue="description">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Spécifications</TabsTrigger>
                <TabsTrigger value="reviews">Avis</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="glass-card p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">À propos de ce produit</h2>
                <div className="prose prose-invert max-w-none">
                  <p>{product.description}</p>
                </div>
              </TabsContent>
              <TabsContent value="specifications" className="glass-card p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Spécifications techniques</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b border-gray-100/10">
                    <span className="text-gray-400">Catégorie</span>
                    <span>{product.category}</span>
                  </div>
                  {product.color && (
                    <div className="flex justify-between py-2 border-b border-gray-100/10">
                      <span className="text-gray-400">Couleur</span>
                      <span>{product.color}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-gray-100/10">
                    <span className="text-gray-400">Personnalisable</span>
                    <span>{product.is_customizable ? 'Oui' : 'Non'}</span>
                  </div>
                  {product.tickets_offered > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-100/10">
                      <span className="text-gray-400">Tickets offerts</span>
                      <span>{product.tickets_offered}</span>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="glass-card p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Avis clients</h2>
                <p>Aucun avis pour le moment.</p>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct: Product) => (
                  <ProductCard 
                    key={relatedProduct.id}
                    id={relatedProduct.id}
                    name={relatedProduct.name}
                    category={relatedProduct.category}
                    price={relatedProduct.price}
                    image={relatedProduct.image_url}
                    isCustomizable={relatedProduct.is_customizable}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
