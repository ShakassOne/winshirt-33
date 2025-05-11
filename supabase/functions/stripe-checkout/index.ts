
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Helper function for logging
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
    
    // Get Stripe key
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    logStep("Stripe key verified");
    
    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Parse request body
    const { orderId, items, customerEmail } = await req.json();
    
    if (!orderId || !items || !items.length) {
      throw new Error("Missing required parameters");
    }
    logStep("Request parameters validated", { orderId, itemsCount: items.length });
    
    // Create Supabase client using the anon key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get authenticated user if available
    const authHeader = req.headers.get("Authorization");
    let userId;
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      
      if (!userError && userData.user) {
        userId = userData.user.id;
        logStep("User authenticated", { userId });
      }
    }
    
    // Prepare line items for Stripe checkout
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          description: item.customization ? "Produit personnalisé" : undefined,
          images: [item.customization?.designUrl || item.image_url],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));
    
    logStep("Line items prepared", { count: lineItems.length });
    
    // Get the origin for success and cancel URLs
    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
      cancel_url: `${origin}/checkout-canceled`,
      client_reference_id: orderId,
      customer_email: customerEmail,
      metadata: {
        orderId,
      },
    });
    
    logStep("Checkout session created", { sessionId: session.id });
    
    // Return the checkout session URL
    return new Response(
      JSON.stringify({ url: session.url }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in stripe-checkout:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
