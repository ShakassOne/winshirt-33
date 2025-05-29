
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, amount, currency, checkoutData } = await req.json();

    if (!orderId || !amount) {
      throw new Error("Missing required parameters: orderId and amount");
    }

    console.log(`Creating PaymentIntent for order ${orderId}, amount: ${amount}`);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency || 'eur',
      metadata: {
        orderId: orderId,
      },
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

    console.log(`PaymentIntent created: ${paymentIntent.id}`);

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
    console.error("Error creating PaymentIntent:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
