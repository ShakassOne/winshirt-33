import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchProductById } from '@/services/api.service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CustomizationAccordion from '@/components/product/CustomizationAccordion';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Plus, Minus, Package, Award, CheckCircle, Upload } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [customization, setCustomization] = useState<any>(null);
  const [designImage, setDesignImage] = useState<string | null>(null);
  const [showCustomizeToast, setShowCustomizeToast] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Fetch product data
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id,
  });

  // Reset states when product changes
  useEffect(() => {
    if (product) {
      if (product.available_sizes && product.available_sizes.length > 0) {
        setSelectedSize(product.available_sizes[0]);
      }
      
      if (product.available_colors && product.available_colors.length > 0) {
        setSelectedColor(product.available_colors[0]);
      } else if (product.color) {
        setSelectedColor(product.color);
      }
    }
  }, [product]);

  // Handle quantity changes
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;

    // Validate customization if product is customizable
    if (product.is_customizable && !customization) {
      setShowCustomizeToast(true);
      toast({
        title: "Personnalisation requise",
        description: "Veuillez personnaliser votre produit avant de l'ajouter au panier",
        variant: "destructive"
      });
      return;
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image_url,
      size: selectedSize,
      color: selectedColor,
      customization: customization,
      tickets: product.tickets_offered || 0
    };

    addToCart(cartItem);
    
    toast({
      title: "Produit ajouté",
      description: `${product.name} a été ajouté au panier`,
      action: (
        <Button variant="outline" size="sm" onClick={() => navigate('/cart')}>
          Voir le panier
        </Button>
      ),
    });
  };

  const handleFileUpload = (file: File) => {
    // Create a URL for the file to preview it
    const imageUrl = URL.createObjectURL(file);
    setDesignImage(imageUrl);
    
    // Update customization data with the file
    setCustomization(prev => ({
      ...prev,
      designImage: file,
      designImageUrl: imageUrl
    }));
  };

  // Helper to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
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
        <main className="flex-grow flex items-center justify-center p-4">
          <p>Produit non trouvé ou une erreur est survenue.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative">
            <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-lg rounded-lg">
              <AspectRatio ratio={1}>
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover" 
                />
              </AspectRatio>
              
              {/* Tickets badge */}
              {product.tickets_offered > 0 && (
                <div className="absolute top-4 right-4 bg-winshirt-purple text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                  {product.tickets_offered} {product.tickets_offered > 1 ? 'tickets' : 'ticket'}
                </div>
              )}
            </Card>
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-xl font-semibold mb-4">
                {formatPrice(product.price)}
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
              </div>
            </div>
            
            {/* Color Selection */}
            {product.available_colors && product.available_colors.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Couleur</h3>
                <div className="flex flex-wrap gap-2">
                  {product.available_colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2",
                        selectedColor === color 
                          ? "border-winshirt-blue ring-2 ring-winshirt-blue ring-opacity-50" 
                          : "border-gray-300"
                      )}
                      style={{ backgroundColor: color }}
                      aria-label={`Couleur ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Size Selection */}
            {product.available_sizes && product.available_sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Taille</h3>
                <div className="flex flex-wrap gap-2">
                  {product.available_sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "px-3 py-1 border rounded-md",
                        selectedSize === size 
                          ? "border-winshirt-blue bg-winshirt-blue text-white" 
                          : "border-gray-300"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity */}
            <div>
              <h3 className="text-lg font-medium mb-2">Quantité</h3>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="h-8 w-8"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="px-4 py-1 border rounded-md min-w-[40px] text-center">
                  {quantity}
                </span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={increaseQuantity}
                  className="h-8 w-8"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {/* Customization */}
            {product.is_customizable && (
              <CustomizationAccordion onFileUpload={handleFileUpload}>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Téléchargez votre design</h4>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('designUpload')?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Choisir un fichier
                      </Button>
                      {designImage && <CheckCircle className="h-5 w-5 text-green-500" />}
                      
                      <input 
                        id="designUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                      />
                    </div>
                    
                    {designImage && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-2">Aperçu du design:</p>
                        <div className="w-24 h-24 border rounded overflow-hidden">
                          <img src={designImage} alt="Design aperçu" className="w-full h-full object-contain" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CustomizationAccordion>
            )}
            
            {/* Add to Cart Button */}
            <Button 
              onClick={handleAddToCart}
              className="w-full py-6 text-lg bg-gradient-purple hover:opacity-90"
            >
              Ajouter au panier
            </Button>
            
            {/* Benefits */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-3 mt-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-winshirt-blue" />
                <span>Livraison rapide</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-winshirt-purple" />
                <span>Qualité premium</span>
              </div>
              
              {product.tickets_offered > 0 && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Participe aux loteries ({product.tickets_offered} {product.tickets_offered > 1 ? 'tickets' : 'ticket'})</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
