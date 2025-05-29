
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
    const { sessionId, orderId } = await req.json();

    if (!sessionId || !orderId) {
      throw new Error("Missing sessionId or orderId");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log(`Verifying payment for session ${sessionId}, status: ${session.payment_status}`);

    if (session.payment_status === "paid") {
      // Update order status in database
      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "paid",
          payment_intent_id: session.payment_intent,
          status: "processing",
        })
        .eq("id", orderId);

      if (updateError) {
        console.error("Error updating order status:", updateError);
        throw updateError;
      }

      console.log(`Order ${orderId} marked as paid`);

      // Generate lottery entries for this order with the corrected function
      try {
        const { error: lotteryError } = await supabaseAdmin.rpc(
          'generate_lottery_entries_for_order',
          { order_id_param: orderId }
        );

        if (lotteryError) {
          console.error("Error generating lottery entries:", lotteryError);
          // Don't throw here - order is still valid even if lottery fails
        } else {
          console.log(`Lottery entries generated for order ${orderId} respecting user's lottery choices`);
        }
      } catch (lotteryErr) {
        console.error("Exception generating lottery entries:", lotteryErr);
        // Continue - order processing should not fail due to lottery issues
      }

      return new Response(
        JSON.stringify({
          success: true,
          paymentStatus: "paid",
          orderStatus: "processing",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          paymentStatus: session.payment_status,
          orderStatus: "pending",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("Error verifying Stripe payment:", error);
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
