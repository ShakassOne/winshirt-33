import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '@/services/api.service';
import { Button } from "@/components/ui/button";
import { Separator } from '@/components/ui/separator';
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import CustomizationForm from '@/components/product/CustomizationForm';
import { toast } from "@/components/ui/sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // Fetch product data
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    onError: (err: any) => {
      console.error('Error fetching product details:', err);
      setError('Failed to load product details. Please try again later.');
    }
  });

  const handleCheckout = (customization: any) => {
    if (!product) return;
    
    // Navigate to checkout with product and customization data
    navigate('/checkout', { 
      state: { 
        product,
        customization
      } 
    });
    
    // Show toast notification
    toast.success("Proceeding to checkout", {
      description: "Your customization has been saved"
    });
  };

  // Set page title
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | WinShirt`;
    } else {
      document.title = 'Product Details | WinShirt';
    }
  }, [product]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground" 
            asChild
          >
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-destructive mb-4">{error}</div>
            <Button onClick={() => navigate('/products')}>
              Return to Products
            </Button>
          </div>
        ) : product ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="bg-background/40 rounded-lg overflow-hidden backdrop-blur-sm">
                <div className="aspect-square">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
              
              {/* Product Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
                    {product.isCustomizable && (
                      <Badge className="bg-winshirt-purple text-white">
                        Customizable
                      </Badge>
                    )}
                  </div>
                  <div className="text-muted-foreground">{product.category}</div>
                </div>
                
                <div className="text-2xl font-bold">{product.price.toFixed(2)} €</div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h2 className="font-semibold">Description</h2>
                  <p className="text-muted-foreground">{product.description || "No description available for this product."}</p>
                </div>
                
                {/* Add rating, size selector, etc. here */}
                
                <Separator />
                
                {/* Customization section */}
                {product.isCustomizable ? (
                  <CustomizationForm product={product} onCheckout={handleCheckout} />
                ) : (
                  <div className="mt-4">
                    <Button 
                      onClick={() => handleCheckout({})}
                      className="w-full bg-gradient-purple"
                    >
                      Buy Now
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center py-12">
            <div>Product not found</div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
