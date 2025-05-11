
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Check, ChevronRight, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Extract the session_id from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get('session_id');
    
    if (sessionId) {
      fetchOrderDetails(sessionId);
    } else {
      setLoading(false);
    }
  }, [location]);
  
  const fetchOrderDetails = async (sessionId: string) => {
    try {
      // Verify payment and get order details
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });
      
      if (error) {
        console.error("Error verifying payment:", error);
      } else if (data?.order) {
        setOrderDetails(data.order);
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <Card className="bg-background/60 backdrop-blur-md border-white/10">
        <CardHeader className="flex items-center pb-2">
          <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-center">Payment Successful!</h1>
          <p className="text-muted-foreground text-center mt-2">
            Thank you for your order
          </p>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-center">
                <p>Loading order details...</p>
              </div>
            </div>
          ) : orderDetails ? (
            <div className="space-y-6">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="font-medium">Product:</div>
                  <div>{orderDetails.product_name}</div>
                  
                  <div className="font-medium">Order ID:</div>
                  <div className="font-mono text-xs">{orderDetails.id}</div>
                  
                  <div className="font-medium">Amount:</div>
                  <div>{orderDetails.price.toFixed(2)} €</div>
                  
                  <div className="font-medium">Status:</div>
                  <div className="text-green-500 font-medium">Paid</div>
                </div>
                
                {orderDetails.customization && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Customization Details</h3>
                    <p className="text-sm text-muted-foreground">
                      Your customization details have been saved and will be applied to your order.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-500/10 rounded-lg p-4">
                <h3 className="font-medium mb-2 text-blue-500">What's Next?</h3>
                <p className="text-sm">
                  We've received your order and will begin processing it right away. You will receive 
                  an email confirmation with your order details shortly.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-500/10 rounded-lg p-4">
              <h3 className="font-medium mb-2 text-yellow-500">Payment Verified</h3>
              <p className="text-sm">
                Your payment has been processed successfully, but we couldn't retrieve the full order details.
                Don't worry, your order has been placed. If you have any questions, please contact support.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> Return Home
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto bg-gradient-purple">
            <Link to="/products">
              <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
