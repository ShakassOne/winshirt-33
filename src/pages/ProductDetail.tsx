
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById, fetchAllProducts } from '@/services/api.service';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ShoppingCart, Heart, ArrowRight, Check, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ui/ProductCard';
import { cn } from '@/lib/utils';
import SocialShare from '@/components/ui/SocialShare';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const { toast } = useToast();
  const { addItem: addToCart } = useCart();

  // Get current URL for social sharing
  const productUrl = window.location.href;

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id,
  });

  const { data: allProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchAllProducts(),
  });

  // Filter related products from all products based on category
  const relatedProducts = React.useMemo(() => {
    if (!product || !allProducts) return [];
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, allProducts]);

  // Set default size and color when product loads
  useEffect(() => {
    if (product) {
      if (product.available_sizes && product.available_sizes.length > 0) {
        setSelectedSize(product.available_sizes[0]);
      }
      if (product.available_colors && product.available_colors.length > 0) {
        setSelectedColor(product.available_colors[0]);
      }
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.available_sizes && product.available_sizes.length > 0 && !selectedSize) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner une taille",
        variant: "destructive",
      });
      return;
    }

    if (product.available_colors && product.available_colors.length > 0 && !selectedColor) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner une couleur",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity,
      size: selectedSize,
      color: selectedColor,
      customization: null,
    });

    toast({
      title: "Produit ajouté",
      description: `${product.name} a été ajouté à votre panier`,
      action: (
        <Link to="/cart">
          <Button variant="outline" size="sm">
            Voir le panier
          </Button>
        </Link>
      ),
    });
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // Prepare product images for gallery
  const productImages = product?.image_url 
    ? [{ url: product.image_url }] 
    : [];

  if (isLoading) {
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

  if (error || !product) {
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
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground">Accueil</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-foreground">Produits</Link>
            <span className="mx-2">/</span>
            <Link to={`/products?category=${product.category}`} className="hover:text-foreground">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Product Gallery - left side */}
            <div>
              <div className="relative rounded-lg overflow-hidden mb-4">
                <AspectRatio ratio={1}>
                  <img
                    src={productImages[selectedImage]?.url || product.image_url}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
              </div>
              
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {productImages.map((image, index) => (
                    <div
                      key={index}
                      className={cn(
                        "cursor-pointer rounded-md overflow-hidden border-2",
                        selectedImage === index
                          ? "border-winshirt-blue"
                          : "border-transparent"
                      )}
                      onClick={() => setSelectedImage(index)}
                    >
                      <AspectRatio ratio={1}>
                        <img
                          src={image.url}
                          alt={`${product.name} - Vue ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </AspectRatio>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add Social Share buttons */}
              <div className="mt-8">
                <SocialShare 
                  title={product?.name || 'Produit Winshirt'} 
                  description={product?.description || 'Découvrez ce produit sur Winshirt'} 
                  url={productUrl}
                  image={product?.image_url}
                />
              </div>
            </div>

            {/* Product details - right side */}
            <div>
              <div className="mb-4">
                {product.is_active && (
                  <span className="inline-block bg-winshirt-blue text-white text-xs px-2 py-1 rounded-md mb-2">
                    Disponible
                  </span>
                )}
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    (0 avis)
                  </span>
                </div>
                <p className="text-2xl font-bold mb-4">
                  {product.price.toFixed(2)} €
                </p>
                <p className="text-muted-foreground mb-6">{product.description.substring(0, 100) + "..."}</p>
              </div>

              {/* Product options */}
              <div className="space-y-6 mb-6">
                {/* Sizes */}
                {product.available_sizes && product.available_sizes.length > 0 && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="size">Taille</Label>
                      <button className="text-sm text-winshirt-blue hover:underline">
                        Guide des tailles
                      </button>
                    </div>
                    <RadioGroup
                      id="size"
                      value={selectedSize || ""}
                      onValueChange={setSelectedSize}
                      className="flex flex-wrap gap-2"
                    >
                      {product.available_sizes.map((size) => (
                        <div key={size}>
                          <RadioGroupItem
                            value={size}
                            id={`size-${size}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`size-${size}`}
                            className="flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-white/5 peer-data-[state=checked]:bg-winshirt-blue peer-data-[state=checked]:text-white peer-data-[state=checked]:border-winshirt-blue cursor-pointer"
                          >
                            {size}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Colors */}
                {product.available_colors && product.available_colors.length > 0 && (
                  <div>
                    <Label htmlFor="color" className="block mb-2">
                      Couleur: {selectedColor}
                    </Label>
                    <RadioGroup
                      id="color"
                      value={selectedColor || ""}
                      onValueChange={setSelectedColor}
                      className="flex flex-wrap gap-2"
                    >
                      {product.available_colors.map((color) => (
                        <div key={color}>
                          <RadioGroupItem
                            value={color}
                            id={`color-${color}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`color-${color}`}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 cursor-pointer peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-winshirt-blue peer-data-[state=checked]:ring-offset-2 peer-data-[state=checked]:ring-offset-background"
                            style={{ backgroundColor: color.toLowerCase() }}
                          >
                            {selectedColor === color && (
                              <Check className="h-4 w-4 text-white" />
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <Label htmlFor="quantity" className="block mb-2">
                    Quantité
                  </Label>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-16 mx-2 text-center"
                    />
                    <Button variant="outline" size="icon" onClick={incrementQuantity}>
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Add to cart */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  className="flex-1 bg-gradient-to-r from-winshirt-purple to-winshirt-blue hover:opacity-90"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Ajouter au panier
                </Button>
                <Button variant="outline" className="flex-1">
                  <Heart className="mr-2 h-4 w-4" />
                  Ajouter aux favoris
                </Button>
              </div>

              {/* Product info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">En stock</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Livraison gratuite à partir de 50€</span>
                </div>
                {product.tickets_offered > 0 && (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-winshirt-blue" />
                    <span className="text-sm">
                      {product.tickets_offered} {product.tickets_offered > 1 ? 'tickets' : 'ticket'} de loterie inclus
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product details tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description">
              <TabsList className="w-full bg-white/5 backdrop-blur-lg border border-white/10">
                <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                <TabsTrigger value="specifications" className="flex-1">Caractéristiques</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">Avis</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-6">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6">
                  <p className="whitespace-pre-line">{product.description}</p>
                </div>
              </TabsContent>
              <TabsContent value="specifications" className="mt-6">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Détails du produit</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Matière</span>
                          <span>Non spécifié</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Poids</span>
                          <span>Non spécifié</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Dimensions</span>
                          <span>Non spécifié</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Informations supplémentaires</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Référence</span>
                          <span>{product.id.substring(0, 8)}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Catégorie</span>
                          <span>{product.category}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Personnalisable</span>
                          <span>{product.is_customizable ? 'Oui' : 'Non'}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-6">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6">
                  <div className="text-center py-8">
                    <h3 className="text-xl font-medium mb-2">Aucun avis pour le moment</h3>
                    <p className="text-muted-foreground mb-4">
                      Soyez le premier à donner votre avis sur ce produit
                    </p>
                    <Button>Laisser un avis</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Produits similaires</h2>
                <Link
                  to={`/products?category=${product.category}`}
                  className="text-winshirt-blue hover:text-winshirt-purple flex items-center"
                >
                  Voir plus <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <Carousel className="w-full">
                <CarouselContent>
                  {relatedProducts.map((relatedProduct) => (
                    <CarouselItem key={relatedProduct.id} className="md:basis-1/2 lg:basis-1/4">
                      <div className="p-1">
                        <ProductCard
                          id={relatedProduct.id}
                          name={relatedProduct.name}
                          category={relatedProduct.category}
                          price={relatedProduct.price}
                          image={relatedProduct.image_url}
                          rating={5}
                          isCustomizable={relatedProduct.is_customizable}
                          tickets={relatedProduct.tickets_offered}
                          color={relatedProduct.color}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-1" />
                <CarouselNext className="right-1" />
              </Carousel>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
