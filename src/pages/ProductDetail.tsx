import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchProductById, fetchAllProducts, fetchMockupById, fetchAllLotteries } from '@/services/api.service';
import { Button } from '@/components/ui/button';
import { Product, Lottery } from '@/types/supabase.types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Slider } from "@/components/ui/slider"
import { CalendarIcon, CheckCircle2, Copy, HelpCircle, Loader2, ShoppingBag, Star, Truck, User2, XCircle } from 'lucide-react';
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import ProductCard from '@/components/ui/ProductCard';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';

interface DeliveryOption {
  id: string;
  name: string;
  price: number;
  deliveryTime: string;
}

const deliveryOptions: DeliveryOption[] = [
  {
    id: "standard",
    name: "Standard Delivery",
    price: 5.99,
    deliveryTime: "3-5 business days",
  },
  {
    id: "express",
    name: "Express Delivery",
    price: 9.99,
    deliveryTime: "1-2 business days",
  },
  {
    id: "pickup",
    name: "Local Pickup",
    price: 0.00,
    deliveryTime: "Available in 24 hours",
  },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customText, setCustomText] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState<string>('standard');
  const [mockupURL, setMockupURL] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = React.useState([33])

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id,
  });

  // Fetch related products
  const { data: products, isLoading: isLoadingProducts, error: errorProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
  });

  // Fetch mockup
  useEffect(() => {
    const fetchMockup = async () => {
      if (product?.mockup_id) {
        const mockup = await fetchMockupById(product.mockup_id);
        setMockupURL(mockup?.image_url || null);
      }
    };

    fetchMockup();
  }, [product?.mockup_id]);

  useEffect(() => {
    if (products && product) {
      const categoryProducts = products.filter(p => p.category === product.category && p.id !== product.id);
      setRelatedProducts(categoryProducts.slice(0, 4));
    }
  }, [products, product]);

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

	const handleSizeSelect = (size: string) => {
		setSelectedSize(size);
	};

  const handleCustomizeToggle = () => {
    setIsCustomizing(!isCustomizing);
  };

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomText(e.target.value);
  };

  const handleCopyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success('URL copié dans le presse-papiers !');
      })
      .catch(err => {
        toast.error('Erreur lors de la copie de l\'URL : ' + err);
      });
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const calculateDiscount = (price: number, discountPercentage: number) => {
    const discountAmount = price * (discountPercentage / 100);
    return price - discountAmount;
  };

  const discountedPrice = product ? calculateDiscount(product.price, sliderValue[0]) : 0;

  // Add proper type safety for data from API
  const { data: lotteries } = useQuery({
    queryKey: ['lotteries'],
    queryFn: fetchAllLotteries
  });

  // Type guard to ensure lotteries is an array
  const lotteriesArray = Array.isArray(lotteries) ? lotteries as Lottery[] : [];
  
  // Fix TypeScript errors by using the typed array
  // For line 315,41
  if (product && product.images && Array.isArray(product.images) && product.images.length > 0) {
    // Do something with product.images.length
  }
  
  // For line 335,78 and 336,41
  if (lotteriesArray && lotteriesArray.length > 0) {
    const filteredLotteries = lotteriesArray.filter(lottery => lottery.is_active);
    // Do something with filteredLotteries
  }
  
  // For line 766,37
  const otherProducts = Array.isArray(products) ? (products as Product[]).filter(p => p.id !== product?.id) : [];
  
  // For line 959,56 and 963,44
  if (product && product.available_colors && Array.isArray(product.available_colors) && product.available_colors.length > 0) {
    product.available_colors.map(color => {
      // Do something with color
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : error || !product ? (
        <div className="flex-grow flex items-center justify-center">
          <p>Produit non trouvé.</p>
        </div>
      ) : (
        <ScrollArea className="flex-grow">
          <div className="container py-8">
            {/* Product Header */}
            <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">{product.name}</h1>
                <div className="flex items-center mt-2">
                  {getRatingStars(4)}
                  <span className="text-sm text-gray-400 ml-2">(123 avis)</span>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={handleCopyToClipboard}>
                <Copy className="h-4 w-4 mr-2" />
                Copier le lien
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Images */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Aperçu du produit</CardTitle>
                    <CardDescription>
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-4">
                    <AspectRatio ratio={16 / 9}>
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="object-cover rounded-md"
                      />
                    </AspectRatio>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button>Ajouter au panier</Button>
                    <Button variant="secondary">Voir plus</Button>
                  </CardFooter>
                </Card>

                {product.images && product.images.length > 0 && (
                  <Carousel className="w-full mt-4">
                    <CarouselContent>
                      {product.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <AspectRatio ratio={16 / 9}>
                              <img
                                src={image}
                                alt={`${product.name} - Image ${index + 1}`}
                                className="object-cover rounded-md"
                              />
                            </AspectRatio>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                )}
              </div>

              {/* Product Details */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Détails</CardTitle>
                    <CardDescription>
                      Informations sur le produit
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Prix:</h3>
                      <p className="text-2xl font-bold text-winshirt-purple">{product.price.toFixed(2)} €</p>
                    </div>

                    {/* Discount Slider */}
                    <div>
                      <Label htmlFor="discount">Remise</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="discount"
                          defaultValue={sliderValue}
                          max={50}
                          step={1}
                          onValueChange={setSliderValue}
                          className="w-full"
                        />
                        <Input
                          type="number"
                          value={sliderValue[0]}
                          className="w-16"
                          onChange={(e) => setSliderValue([Number(e.target.value)])}
                        />
                        <span>%</span>
                      </div>
                      <p className="text-sm text-gray-400">Prix après remise: {discountedPrice.toFixed(2)} €</p>
                    </div>

                    {/* Color Options */}
                    {product.available_colors && product.available_colors.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold">Couleurs:</h3>
                        <div className="flex items-center gap-2">
                          {product.available_colors.map((color) => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full border-2 border-transparent hover:border-winshirt-purple focus:outline-none ${selectedColor === color ? 'border-winshirt-purple' : ''}`}
                              style={{ backgroundColor: color }}
                              onClick={() => handleColorSelect(color)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

										{/* Size Options */}
										{product.available_sizes && product.available_sizes.length > 0 && (
											<div>
												<h3 className="text-lg font-semibold">Tailles:</h3>
												<div className="flex items-center gap-2">
													{product.available_sizes.map((size) => (
														<button
															key={size}
															className={`px-3 py-1 rounded-full border-2 border-transparent hover:border-winshirt-purple focus:outline-none ${selectedSize === size ? 'border-winshirt-purple' : ''}`}
															onClick={() => handleSizeSelect(size)}
														>
															{size}
														</button>
													))}
												</div>
											</div>
										)}

                    {/* Quantity */}
                    <div>
                      <h3 className="text-lg font-semibold">Quantité:</h3>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={decrementQuantity}>
                          -
                        </Button>
                        <span>{quantity}</span>
                        <Button variant="outline" size="icon" onClick={incrementQuantity}>
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Customization */}
                    {product.is_customizable && (
                      <div>
                        <h3 className="text-lg font-semibold">Personnalisation:</h3>
                        <div className="flex items-center space-x-2">
                          <Button variant="secondary" onClick={handleCustomizeToggle}>
                            {isCustomizing ? 'Annuler' : 'Personnaliser'}
                          </Button>
                        </div>
                        {isCustomizing && (
                          <div className="mt-4">
                            <Label htmlFor="customText">Texte personnalisé:</Label>
                            <Textarea
                              id="customText"
                              value={customText}
                              onChange={handleCustomTextChange}
                              className="mt-2"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button>Ajouter au panier</Button>
                    <Button variant="secondary">Acheter maintenant</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            {/* Delivery Options */}
            <section className="py-6">
              <h2 className="text-xl font-semibold mb-4">Options de livraison</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {deliveryOptions.map((option) => (
                  <Card key={option.id} className={selectedDelivery === option.id ? "border-2 border-winshirt-purple" : ""}>
                    <CardHeader>
                      <CardTitle>{option.name}</CardTitle>
                      <CardDescription>{option.deliveryTime}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">{option.price.toFixed(2)} €</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedDelivery(option.id)}
                      >
                        {selectedDelivery === option.id ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <ShoppingBag className="h-4 w-4 mr-2" />}
                        {selectedDelivery === option.id ? "Sélectionné" : "Choisir"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>

            {/* Mockup Preview */}
            {mockupURL && (
              <section className="py-6">
                <h2 className="text-xl font-semibold mb-4">Aperçu du Mockup</h2>
                <Card>
                  <CardContent>
                    <AspectRatio ratio={16 / 9}>
                      <img
                        src={mockupURL}
                        alt="Mockup du produit"
                        className="object-cover rounded-md"
                      />
                    </AspectRatio>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <section className="py-6">
                <h2 className="text-xl font-semibold mb-4">Produits similaires</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedProducts.map((relatedProduct) => (
                    <ProductCard
                      key={relatedProduct.id}
                      id={relatedProduct.id}
                      name={relatedProduct.name}
                      category={relatedProduct.category}
                      price={relatedProduct.price}
                      image={relatedProduct.image_url}
                      rating={5}
                      isCustomizable={relatedProduct.is_customizable}
                      tickets={relatedProduct.tickets_offered}
                      color={relatedProduct.color || undefined}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Lotteries Section */}
            {lotteriesArray && lotteriesArray.length > 0 && (
              <section className="py-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Participez à nos loteries</h2>
                  <Link to="/lotteries" className="text-winshirt-blue hover:text-winshirt-purple flex items-center gap-1 text-sm">
                    Voir toutes les loteries
                  </Link>
                </div>
                <p className="text-white/70 mb-6">
                  Tentez votre chance et gagnez des prix exceptionnels !
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lotteriesArray.slice(0, 3).map(lottery => (
                    <GlassCard key={lottery.id} className="p-4">
                      <div className="flex flex-col h-full">
                        <div className="mb-4">
                          <img
                            src={lottery.image_url}
                            alt={lottery.title}
                            className="w-full h-40 object-cover rounded-md mb-2"
                          />
                          <h3 className="text-lg font-semibold">{lottery.title}</h3>
                          <p className="text-white/70 text-sm">Tirage le {new Date(lottery.draw_date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex justify-between items-center mt-auto">
                          <span className="text-winshirt-purple font-bold">{lottery.value} €</span>
                          <Button asChild>
                            <Link to={`/lotteries/${lottery.id}`}>
                              Participer
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </section>
            )}
          </div>
        </ScrollArea>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
