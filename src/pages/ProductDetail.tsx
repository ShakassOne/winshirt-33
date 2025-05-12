import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '@/services/api.service';
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
import { fetchRelatedProducts } from '@/services/api.service';

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
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    const customization = product.is_customizable 
      ? {
          text: customText ? {
            content: customText,
            color: customTextColor,
            font: customTextFont
          } : undefined
        }
      : undefined;
    
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
              
              {/* Additional Images (if available) */}
              {product.additional_images && product.additional_images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {product.additional_images.map((image, index) => (
                    <div key={index} className="glass-card overflow-hidden cursor-pointer">
                      <img 
                        src={image} 
                        alt={`${product.name} - Vue ${index + 1}`} 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
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
                          star <= (product.rating || 5) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        )} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-400">
                    {product.reviews_count || 0} avis
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">{product.price.toFixed(2)} €</span>
                  {product.original_price && (
                    <span className="ml-2 text-gray-400 line-through">
                      {product.original_price.toFixed(2)} €
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-300">{product.description}</p>
              
              {/* Product Customization */}
              <div className="space-y-4">
                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Couleur</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
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
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Taille</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
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
                
                {/* Product Features */}
                {product.features && product.features.length > 0 && (
                  <div className="space-y-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-winshirt-blue mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
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
                  {product.long_description && (
                    <div dangerouslySetInnerHTML={{ __html: product.long_description }} />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="specifications" className="glass-card p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Spécifications techniques</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100/10">
                      <span className="text-gray-400">{key}</span>
                      <span>{value as string}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="glass-card p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Avis clients</h2>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-100/10 pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{review.author}</p>
                            <div className="flex mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={cn(
                                    "h-3 w-3", 
                                    star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                  )} 
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-400">{review.date}</span>
                        </div>
                        <p className="mt-2">{review.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Aucun avis pour le moment.</p>
                )}
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
