
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Star, Palette, Shirt, Plus, Minus, ShoppingCart, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import CustomizationAccordion from '@/components/product/CustomizationAccordion';
import { fetchProductById, fetchMockupById } from '@/services/api.service';
import { SocialShareButton } from '@/components/SocialShareButton';
import { AddToCartDialog } from '@/components/cart/AddToCartDialog';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, isLoading: cartLoading } = useCart();
  
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAddToCartDialog, setShowAddToCartDialog] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  const { data: mockup } = useQuery({
    queryKey: ['mockup', product?.mockup_id],
    queryFn: () => fetchMockupById(product!.mockup_id!),
    enabled: !!product?.mockup_id,
  });

  useEffect(() => {
    if (product?.available_colors && product.available_colors.length > 0) {
      setSelectedColor(product.available_colors[0]);
    }
    if (product?.available_sizes && product.available_sizes.length > 0) {
      setSelectedSize(product.available_sizes[0]);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!product) return;

    const customization = product.is_customizable ? {
      customText: customText,
      textColor: textColor,
      textFont: selectedFont,
      designUrl: selectedImages.length > 0 ? selectedImages[0] : undefined,
    } : undefined;

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      color: selectedColor || null,
      size: selectedSize || null,
      image_url: product.image_url,
      available_colors: product.available_colors,
      available_sizes: product.available_sizes,
      customization
    };

    const success = await addItem(cartItem);
    if (success) {
      setShowAddToCartDialog(true);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex items-center justify-center mt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-winshirt-blue mx-auto mb-4"></div>
          <p>Chargement du produit...</p>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (error || !product) return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex items-center justify-center mt-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <Button onClick={() => navigate('/products')}>
            Retour aux produits
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/products')}
            className="mb-6 text-white/70 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Retour aux produits
          </Button>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <GlassCard className="overflow-hidden">
                <img
                  src={selectedImages[currentImageIndex] || product.image_url}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </GlassCard>
              
              {selectedImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                      currentImageIndex === 0 ? 'border-winshirt-blue' : 'border-transparent'
                    }`}
                    onClick={() => setCurrentImageIndex(0)}
                  />
                  {selectedImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Generated ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                        currentImageIndex === index + 1 ? 'border-winshirt-blue' : 'border-transparent'
                      }`}
                      onClick={() => setCurrentImageIndex(index + 1)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-white/60">(4.8/5)</span>
                  </div>
                </div>
                <SocialShareButton 
                  url={window.location.href}
                  title={product.name}
                  description={product.description}
                  className="ml-4"
                />
              </div>

              <p className="text-white/80 leading-relaxed">{product.description}</p>

              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-gradient">
                  {product.price.toFixed(2)} €
                </div>
                <Badge variant="secondary" className="bg-winshirt-blue/20">
                  {product.category}
                </Badge>
              </div>

              {product.available_colors && product.available_colors.length > 0 && (
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    <Palette className="h-4 w-4 inline mr-2" />
                    Couleur
                  </Label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une couleur" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.available_colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {product.available_sizes && product.available_sizes.length > 0 && (
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    <Shirt className="h-4 w-4 inline mr-2" />
                    Taille
                  </Label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une taille" />
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

              <div>
                <Label className="text-base font-medium mb-3 block">Quantité</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={cartLoading}
                className="w-full bg-gradient-purple hover:opacity-90 text-lg py-6"
              >
                {cartLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Ajout en cours...
                  </div>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Ajouter au panier
                  </>
                )}
              </Button>

              {product.tickets_offered > 0 && (
                <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-yellow-300">
                      <Sparkles className="h-5 w-5" />
                      <span className="font-medium">
                        +{product.tickets_offered} ticket{product.tickets_offered > 1 ? 's' : ''} de loterie offert{product.tickets_offered > 1 ? 's' : ''} !
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {product.is_customizable && (
            <div className="mt-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="customize">
                  <AccordionTrigger className="text-xl font-semibold">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-winshirt-blue" />
                      Commencer à personnaliser
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-6">
                    <div className="grid lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <CustomizationAccordion>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="custom-text">Texte personnalisé</Label>
                              <input
                                id="custom-text"
                                type="text"
                                value={customText}
                                onChange={(e) => setCustomText(e.target.value)}
                                placeholder="Votre texte ici..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <Label htmlFor="text-color">Couleur du texte</Label>
                              <input
                                id="text-color"
                                type="color"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                                className="w-full h-10 border border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <Label htmlFor="font-select">Police</Label>
                              <Select value={selectedFont} onValueChange={setSelectedFont}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choisir une police" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Arial">Arial</SelectItem>
                                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CustomizationAccordion>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </div>

        <AddToCartDialog 
          isOpen={showAddToCartDialog}
          onClose={() => setShowAddToCartDialog(false)}
          productName={product?.name || ''}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
