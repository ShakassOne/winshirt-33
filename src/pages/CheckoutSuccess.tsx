
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Get the order ID from query params
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('orderId');
  
  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !orderId) {
        setLoading(false);
        return;
      }
      
      try {
        // Call the verify-payment edge function to confirm payment and update order status
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: {
            sessionId,
            orderId
          }
        });
        
        if (error) {
          console.error('Payment verification error:', error);
          return;
        }
        
        if (data?.verified) {
          // Fetch the order details
          const { data: orderData } = await supabase
            .from('orders')
            .select(`
              *,
              order_items:order_items(*)
            `)
            .eq('id', orderId)
            .single();
          
          setOrderDetails(orderData);
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
      } finally {
        setLoading(false);
      }
    };
    
    verifyPayment();
  }, [sessionId, orderId]);
  
  return (
    <div className="container max-w-4xl mx-auto py-16 px-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Merci pour votre commande!</h1>
        
        {loading ? (
          <p className="text-muted-foreground mb-8">Vérification de votre paiement...</p>
        ) : orderDetails ? (
          <>
            <p className="text-muted-foreground mb-4">
              Votre commande #{orderDetails.id.substring(0, 8)} a été confirmée et sera traitée rapidement.
            </p>
            
            <p className="text-muted-foreground mb-8">
              Un email de confirmation a été envoyé à l'adresse associée à votre commande.
            </p>
            
            <div className="border-t border-white/10 py-6 my-6">
              <h2 className="font-medium text-lg mb-4">Résumé de la commande</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4">
                <div className="space-y-4">
                  {orderDetails.order_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.quantity}x</span>
                        <span className="text-muted-foreground"> Produit #{item.product_id.substring(0, 6)}</span>
                      </div>
                      <span>{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="flex justify-between font-bold mb-2">
                    <span>Total</span>
                    <span>{orderDetails.total_amount.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground mb-8">
            Nous n'avons pas pu vérifier les détails de votre commande, mais votre paiement a bien été reçu. 
            Veuillez contacter notre service client si vous avez des questions.
          </p>
        )}
        
        <Button onClick={() => navigate('/')} variant="outline" className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Button>
        
        <Button onClick={() => navigate('/products')}>
          Continuer vos achats
        </Button>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
