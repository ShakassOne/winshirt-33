
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS pre-flight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, paymentInfo } = await req.json();

    if (!orderId) {
      throw new Error("Order ID is required");
    }

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Get the order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError) {
      throw new Error(`Error fetching order: ${orderError.message}`);
    }

    // Simulate payment processing
    console.log(`Processing payment for order ${orderId}`);
    
    // In a real implementation, we would call Stripe or another payment API here
    // For now, we're just simulating a successful payment
    const paymentIntentId = `pi_${Math.random().toString(36).substr(2, 9)}`;
    
    // Update order with payment info
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "paid",
        payment_intent_id: paymentIntentId,
        status: "processing",
      })
      .eq("id", orderId);

    if (updateError) {
      throw new Error(`Error updating order: ${updateError.message}`);
    }

    // Generate lottery entries for this order
    try {
      const { error: lotteryError } = await supabaseAdmin.rpc(
        'generate_lottery_entries_for_order',
        { order_id_param: orderId }
      );

      if (lotteryError) {
        console.error("Error generating lottery entries:", lotteryError);
        // Don't throw here - order is still valid even if lottery fails
      } else {
        console.log(`Lottery entries generated for order ${orderId}`);
      }
    } catch (lotteryErr) {
      console.error("Exception generating lottery entries:", lotteryErr);
      // Continue - order processing should not fail due to lottery issues
    }

    // In a real implementation, we would send email confirmations here
    console.log(`Payment processed successfully for order ${orderId}`);
    console.log(`Email notification would be sent to: ${order.shipping_email}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment processed successfully",
        orderId,
        paymentIntentId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing payment:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
