
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Unauthorized: Missing authorization header');
    }

    const { orderId, amount, currency, checkoutData } = await req.json();

    // Input validation
    if (!orderId || !amount || !currency || !checkoutData) {
      throw new Error("Missing required parameters");
    }

    // Validate amount (should be positive and reasonable)
    if (typeof amount !== 'number' || amount <= 0 || amount > 100000000) { // Max 1M EUR in cents
      throw new Error("Invalid amount");
    }

    // Validate currency
    if (currency !== 'eur') {
      throw new Error("Unsupported currency");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(checkoutData.email)) {
      throw new Error("Invalid email format");
    }

    console.log(`Creating payment intent for order ${orderId}, amount: ${amount}`);

    // Initialize Stripe with error handling
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Payment service not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Initialize Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Server configuration error");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    });

    // Verify the order exists and has correct amount
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("total_amount, payment_status, user_id")
      .eq("id", orderId)
      .single();

    if (orderError || !orderData) {
      throw new Error("Order not found or access denied");
    }

    // Verify the amount matches the order total (convert to cents)
    const expectedAmount = Math.round(orderData.total_amount * 100);
    if (Math.abs(amount - expectedAmount) > 1) { // Allow 1 cent tolerance for rounding
      throw new Error("Amount mismatch with order total");
    }

    // Check if payment is already processed
    if (orderData.payment_status === 'paid') {
      throw new Error("Order already paid");
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: orderId,
        customerEmail: checkoutData.email,
      },
      receipt_email: checkoutData.email,
      shipping: {
        name: `${checkoutData.firstName} ${checkoutData.lastName}`,
        address: {
          line1: checkoutData.address,
          city: checkoutData.city,
          postal_code: checkoutData.postalCode,
          country: checkoutData.country,
        },
      },
    });

    console.log(`Payment intent created: ${paymentIntent.id}`);

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating payment intent:", error);
    
    // Don't expose internal error details to clients
    const clientError = error.message.includes('Unauthorized') ||
                       error.message.includes('Missing required') ||
                       error.message.includes('Invalid') ||
                       error.message.includes('Unsupported') ||
                       error.message.includes('not found') ||
                       error.message.includes('access denied') ||
                       error.message.includes('mismatch') ||
                       error.message.includes('already paid')
      ? error.message 
      : 'Failed to create payment intent';
    
    return new Response(
      JSON.stringify({
        error: clientError,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
