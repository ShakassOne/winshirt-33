
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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
    
    // Get Stripe key
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    
    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Parse request body
    const { sessionId, orderId } = await req.json();
    
    if (!sessionId || !orderId) {
      throw new Error("Missing sessionId or orderId");
    }
    logStep("Parameters validated", { sessionId, orderId });
    
    // Create Supabase client using the service role key to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });
    
    // Retrieve the Stripe checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      throw new Error("Checkout session not found");
    }
    
    logStep("Session retrieved", { status: session.payment_status });
    
    // Check if the session matches our order ID
    if (session.client_reference_id !== orderId) {
      throw new Error("Order ID does not match session reference");
    }
    
    // Check payment status
    const isPaid = session.payment_status === "paid";
    const orderStatus = isPaid ? "paid" : "pending";
    
    // Update order status in Supabase
    const { error: updateError } = await supabase
      .from("orders")
      .update({ 
        status: orderStatus,
        payment_details: {
          stripe_session_id: sessionId,
          payment_status: session.payment_status,
          payment_method: session.payment_method_types?.[0] || null,
          updated_at: new Date().toISOString()
        }
      })
      .eq("id", orderId);
    
    if (updateError) {
      console.error("Error updating order:", updateError);
      throw updateError;
    }
    
    logStep("Order updated", { orderId, status: orderStatus });
    
    // Get user email from order to send confirmation email
    const { data: orderData } = await supabase
      .from("orders")
      .select("shipping_address, user_id")
      .eq("id", orderId)
      .single();
    
    if (orderData && isPaid) {
      // Here you could trigger an email sending function or add code to send emails
      logStep("Ready to send confirmation email", { 
        email: orderData.shipping_address.email,
        userId: orderData.user_id 
      });
    }
    
    return new Response(
      JSON.stringify({ 
        verified: true,
        paid: isPaid,
        status: orderStatus,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in verify-payment:", error);
    
    return new Response(
      JSON.stringify({ 
        verified: false,
        error: error.message 
      }),
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
