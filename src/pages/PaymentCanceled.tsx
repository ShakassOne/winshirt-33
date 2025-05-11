
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const PaymentCanceled = () => {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <Card className="bg-background/60 backdrop-blur-md border-white/10">
        <CardHeader className="flex items-center pb-2">
          <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-center">Payment Canceled</h1>
          <p className="text-muted-foreground text-center mt-2">
            Your payment process was canceled
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
            <p className="mb-4">
              No charges were made to your account.
            </p>
            <p className="text-muted-foreground text-sm">
              If you encountered any issues during checkout, please try again or contact our support team for assistance.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return Home
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto bg-gradient-purple">
            <Link to="/products">
              <ShoppingCart className="mr-2 h-4 w-4" /> Return to Shopping
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentCanceled;
