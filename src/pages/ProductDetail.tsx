
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '@/services/api.service';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import CustomizationAccordion from '@/components/product/CustomizationAccordion';
import { useCart } from '@/contexts/CartContext';
import Layout from '@/components/layout/Layout';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState<any>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
    meta: { 
      onError: (err: Error) => toast.error(`Error loading product: ${err.message}`)
    }
  });

  useEffect(() => {
    // Reset selections when product changes
    if (product) {
      setSelectedColor(product.available_colors?.length > 0 ? product.available_colors[0] : null);
      setSelectedSize(product.available_sizes?.length > 0 ? product.available_sizes[0] : null);
      setCustomization(null);
    }
  }, [product]);

  const handleCustomizationChange = (customizationData: any) => {
    setCustomization(customizationData);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      color: selectedColor,
      size: selectedSize,
      image_url: product.image_url,
      customization: customization,
      lotteries: product.tickets_offered > 0 ? ['some-lottery-id'] : undefined, // In a real app, you'd get actual lottery IDs
    };

    addToCart(cartItem);
    setAddedToCart(true);
    
    // Reset after 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  if (isLoading) return <Layout><div className="container mx-auto py-12 text-center">Loading...</div></Layout>;
  if (error || !product) return <Layout><div className="container mx-auto py-12 text-center">Error loading product</div></Layout>;

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-lg text-muted-foreground mt-1">{product.category}</p>

            <div className="border-t border-white/10 my-6 pt-6">
              <p className="text-3xl font-bold mb-6">{product.price.toFixed(2)} €</p>

              <div className="space-y-6">
                {product.available_colors && product.available_colors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">Couleur</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.available_colors.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 ${
                            selectedColor === color
                              ? 'border-primary'
                              : 'border-white/30'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {product.available_sizes && product.available_sizes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">Taille</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.available_sizes.map((size) => (
                        <button
                          key={size}
                          className={`px-3 py-1 border rounded-md ${
                            selectedSize === size
                              ? 'border-primary bg-primary/10 text-white'
                              : 'border-white/30 text-white/70 hover:border-white/50'
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium mb-3">Quantité</h3>
                  <div className="flex items-center">
                    <button
                      className="w-8 h-8 border border-white/30 rounded-l-md flex items-center justify-center text-lg"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <div className="w-12 h-8 border-t border-b border-white/30 flex items-center justify-center">
                      {quantity}
                    </div>
                    <button
                      className="w-8 h-8 border border-white/30 rounded-r-md flex items-center justify-center text-lg"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {product.is_customizable && (
                  <CustomizationAccordion>
                    {/* Customization content goes here */}
                    <p className="text-muted-foreground">
                      Personnalisez votre produit selon vos préférences.
                    </p>
                    {/* This is where you would add your customization UI components */}
                  </CustomizationAccordion>
                )}

                <div className="pt-4">
                  <Button 
                    onClick={handleAddToCart} 
                    className="w-full bg-gradient-purple"
                    size="lg"
                    disabled={addedToCart}
                  >
                    {addedToCart ? (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Ajouté au panier
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Ajouter au panier
                      </>
                    )}
                  </Button>
                </div>

                {product.tickets_offered > 0 && (
                  <div className="bg-winshirt-blue/10 border border-winshirt-blue/30 rounded-md p-3 text-center text-sm">
                    <p className="font-medium">🎟️ Bonus: {product.tickets_offered} ticket(s) de loterie offert(s) avec ce produit!</p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-white/10 my-6 pt-6">
              <h2 className="text-lg font-medium mb-4">Description</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
