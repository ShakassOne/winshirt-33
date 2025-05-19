// Early in the file, import the useCart hook
import { useCart } from '@/context/CartContext';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { CirclePicker } from 'react-color';
import { fetchProductById, fetchAllDesigns } from '@/services/api.service';
import { Product, Design, CartItem } from '@/types/supabase.types';
import { useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [customText, setCustomText] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [textFont, setTextFont] = useState('Arial');
  const navigate = useNavigate();
  
  const { addItem, isLoading: isCartLoading } = useCart();

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        setIsLoading(true);
        try {
          const productData = await fetchProductById(productId);
          setProduct(productData);
          setSelectedColor(productData.available_colors ? productData.available_colors[0] : null);
          setSelectedSize(productData.available_sizes ? productData.available_sizes[0] : null);
          setIsCustomizable(productData.is_customizable || false);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const designsData = await fetchAllDesigns();
        setDesigns(designsData);
      } catch (err: any) {
        console.error("Error fetching designs:", err);
      }
    };

    if (isCustomizable) {
      fetchDesigns();
    }
  }, [isCustomizable]);

  if (isLoading) {
    return <div>Loading product details...</div>;
  }

  if (error || !product) {
    return <div>Error: {error || 'Product not found'}</div>;
  }

  const calculatePrice = () => {
    let basePrice = product.price;
    if (selectedDesign) {
      basePrice += 5;
    }
    if (customText) {
      basePrice += 2;
    }
    return basePrice;
  };

  const handleAddToCart = async () => {
    const customization = selectedDesign
      ? {
          designId: selectedDesign.id,
          designUrl: selectedDesign.image_url,
          designName: selectedDesign.name,
          customText: customText,
          textColor: textColor,
          textFont: textFont,
        }
      : null;

    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: calculatePrice(),
      quantity: quantity,
      image_url: product.image_url,
      color: selectedColor,
      size: selectedSize,
      customization: customization
    };

    try {
      // Use the addItem function from CartContext
      await addItem(cartItem);
      toast({
        title: "Produit ajouté au panier",
        description: "Le produit a été ajouté à votre panier avec succès!",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout au panier.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <Card>
            <CardContent>
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-auto rounded-md"
              />
            </CardContent>
          </Card>
        </div>

        {/* Product Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price */}
              <div className="text-xl font-bold">{calculatePrice().toFixed(2)}€</div>

              {/* Color Options */}
              {product.available_colors && product.available_colors.length > 0 && (
                <div>
                  <Label htmlFor="color">Couleur</Label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une couleur" />
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

              {/* Size Options */}
              {product.available_sizes && product.available_sizes.length > 0 && (
                <div>
                  <Label htmlFor="size">Taille</Label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
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
                <Input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  min="1"
                  className="w-24"
                />
              </div>

              {/* Customization Options */}
              {isCustomizable && (
                <div className="space-y-4">
                  {/* Design Selection */}
                  <div>
                    <Label>Sélectionner un Design</Label>
                    <div className="flex gap-2 mt-2">
                      {designs.map((design) => (
                        <div
                          key={design.id}
                          className={`border-2 rounded-md p-1 cursor-pointer ${selectedDesign?.id === design.id ? 'border-blue-500' : 'border-transparent'}`}
                          onClick={() => setSelectedDesign(design)}
                        >
                          <img
                            src={design.image_url}
                            alt={design.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom Text Input */}
                  <div>
                    <Label htmlFor="customText">Texte Personnalisé</Label>
                    <Textarea
                      id="customText"
                      placeholder="Entrez votre texte ici"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                    />
                  </div>

                  {/* Text Color Selection */}
                  <div>
                    <Label>Couleur du Texte</Label>
                    <CirclePicker color={textColor} onChangeComplete={(color) => setTextColor(color.hex)} />
                  </div>

                  {/* Text Font Selection */}
                  <div>
                    <Label htmlFor="textFont">Police du Texte</Label>
                    <Select value={textFont} onValueChange={setTextFont}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner une police" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        {/* Add more font options as needed */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button className="w-full" onClick={handleAddToCart} disabled={isCartLoading}>
                {isCartLoading ? "Ajout au panier..." : "Ajouter au panier"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
