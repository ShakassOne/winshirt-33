
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
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
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

    // Create a Supabase client using service role key for admin operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Extract the session ID from the request body
    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Session ID is required");
    logStep("Session ID received", { sessionId });

    // Create a Stripe instance with the secret key
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Retrieve the Stripe checkout session to verify payment status
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Retrieved Stripe session", { paymentStatus: session.payment_status });
    
    if (session.payment_status !== "paid") {
      return new Response(JSON.stringify({ verified: false, message: "Payment not completed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    // Get the order ID from the session metadata
    const orderId = session.metadata?.order_id;
    if (!orderId) {
      throw new Error("Order ID not found in session metadata");
    }
    
    // Update the order status in Supabase
    const { data: orderData, error: updateError } = await supabaseClient
      .from('orders')
      .update({ 
        status: "paid",
        stripe_session_id: sessionId,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();
      
    if (updateError) {
      logStep("Error updating order", { error: updateError });
      throw new Error(`Error updating order: ${updateError.message}`);
    }
    
    logStep("Order updated successfully", { orderId });
    
    // Return order details along with verification result
    return new Response(JSON.stringify({ 
      verified: true, 
      order: orderData
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    logStep("Error", { message: error.message });
    
    return new Response(JSON.stringify({ 
      verified: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
