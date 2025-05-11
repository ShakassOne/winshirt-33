
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function for logging steps (useful for debugging)
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    // Get Stripe secret key from environment
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Create a Supabase client using anon key for verifying auth
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Extract the request body
    const { productId, productName, price, customization, orderId } = await req.json();
    logStep("Request body parsed", { productId, productName, orderId });

    // Create a Stripe instance with the secret key
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Format the line item details
    const lineItems = [{
      price_data: {
        currency: "eur",
        product_data: {
          name: productName,
          description: customization ? "Customized product" : "Standard product",
        },
        unit_amount: Math.round(price * 100), // Convert to cents
      },
      quantity: 1,
    }];
    
    // Get domain for success/cancel URLs
    const origin = req.headers.get("origin") || "http://localhost:5173";
    
    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-canceled`,
      metadata: {
        order_id: orderId,
        product_id: productId
      }
    });
    
    logStep("Checkout session created", { sessionId: session.id, url: session.url });
    
    // Return the checkout session URL
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    logStep("Error", { message: error.message });
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
