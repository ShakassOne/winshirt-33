
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

// Initialize Stripe with publishable key
const stripePromise = loadStripe("pk_test_51P3irOBWoiPvO6s6vmw6UvY5QFnLJDquPxXQPzTtZgAq9pVaxilriRsa7pZe9hUhz9lUs37o3m9A0iNLOQXdNBI000Ry5AneRS");

interface OrderSummaryProps {
  product: any;
  customization?: {
    color?: string;
    text?: string;
    textColor?: string;
    textFont?: string;
    designImage?: string;
    designPosition?: string;
    textPosition?: string;
  };
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [customization, setCustomization] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get data from location state
    if (location.state?.product) {
      setProduct(location.state.product);
      setCustomization(location.state.customization || {});
    } else {
      setError("No product information found. Please go back and select a product.");
    }
  }, [location]);

  const handleBackToProduct = () => {
    navigate(-1);
  };

  const handleCheckout = async () => {
    if (!product) return;
    
    setLoading(true);
    
    try {
      // Save order details to Supabase first
      const orderDetails = {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        total_amount: product.price, // Add total_amount field
        customization: customization,
        status: "pending",
      };
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderDetails)
        .select()
        .single();
        
      if (orderError) throw new Error(orderError.message);
      
      // Call our Stripe checkout endpoint
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          orderId: order.id,
          productId: product.id,
          price: product.price,
          productName: product.name,
          customization
        }
      });

      if (error) throw new Error(error.message);
      
      if (data?.url) {
        // Redirect to Stripe
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received from Stripe");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error("Payment failed", {
        description: err.message || "There was an issue processing your payment"
      });
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="bg-background/60 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-xl">Checkout Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
            <Button onClick={() => navigate('/products')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="bg-background/60 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-xl">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-4 flex items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackToProduct}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="bg-background/60 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your order details</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderSummary product={product} customization={customization} />
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-between items-center">
                <div className="text-2xl font-bold">{product.price.toFixed(2)} €</div>
                <Button 
                  onClick={handleCheckout} 
                  disabled={loading} 
                  className="bg-gradient-purple"
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" /> Proceed to Payment
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="bg-background/60 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Test Card Details</CardTitle>
              <CardDescription>Use these for testing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="space-y-2">
                  <p className="font-medium">Card Number</p>
                  <p className="font-mono bg-background/50 p-2 rounded">4242 4242 4242 4242</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-medium">Expiry</p>
                    <p className="font-mono bg-background/50 p-2 rounded">Any future date</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">CVC</p>
                    <p className="font-mono bg-background/50 p-2 rounded">Any 3 digits</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Order summary component with customization preview
const OrderSummary = ({ product, customization = {} }: OrderSummaryProps) => {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="w-20 h-20 overflow-hidden rounded-md flex-shrink-0 bg-slate-100">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-muted-foreground text-sm">{product.category}</p>
          <p className="text-sm mt-1">Price: {product.price.toFixed(2)} €</p>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-3">Customizations Preview</h3>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 relative aspect-square">
            {/* Base mockup image */}
            <div className="relative w-full h-full">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
              
              {/* Display text overlay if present */}
              {customization?.text && (
                <div 
                  className="absolute" 
                  style={{
                    top: customization.textPosition === 'top' ? '20%' : 
                         customization.textPosition === 'bottom' ? '70%' : '45%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: customization.textColor || 'black',
                    fontFamily: customization.textFont || 'Arial',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    maxWidth: '80%',
                    wordBreak: 'break-word'
                  }}
                >
                  {customization.text}
                </div>
              )}
              
              {/* Display custom design if present */}
              {customization?.designImage && (
                <div 
                  className="absolute w-1/2 h-1/2" 
                  style={{
                    top: customization.designPosition === 'top' ? '10%' : 
                         customization.designPosition === 'bottom' ? '50%' : '25%',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                  }}
                >
                  <img 
                    src={customization.designImage} 
                    alt="Custom design" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />
      
      <div className="space-y-3">
        <h3 className="font-medium">Customization Details</h3>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          {customization?.color && (
            <>
              <div className="font-medium">Color:</div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border" 
                  style={{ backgroundColor: customization.color }}
                />
                {customization.color}
              </div>
            </>
          )}
          
          {customization?.text && (
            <>
              <div className="font-medium">Text:</div>
              <div>{customization.text}</div>
              
              {customization?.textColor && (
                <>
                  <div className="font-medium">Text Color:</div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border" 
                      style={{ backgroundColor: customization.textColor }}
                    />
                    {customization.textColor}
                  </div>
                </>
              )}
              
              {customization?.textFont && (
                <>
                  <div className="font-medium">Text Font:</div>
                  <div>{customization.textFont}</div>
                </>
              )}
              
              {customization?.textPosition && (
                <>
                  <div className="font-medium">Text Position:</div>
                  <div className="capitalize">{customization.textPosition}</div>
                </>
              )}
            </>
          )}
          
          {customization?.designPosition && (
            <>
              <div className="font-medium">Design Position:</div>
              <div className="capitalize">{customization.designPosition}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
