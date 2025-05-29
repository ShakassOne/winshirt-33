
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const { orderId, paymentIntentId, status } = await req.json();

    if (!orderId || !paymentIntentId || !status) {
      throw new Error("Missing required parameters");
    }

    console.log(`Updating order ${orderId} payment status to ${status}`);

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

    // Update order status
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: status,
        payment_intent_id: paymentIntentId,
        status: status === 'paid' ? 'processing' : 'pending',
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Error updating order status:", updateError);
      throw updateError;
    }

    console.log(`Order ${orderId} payment status updated successfully`);

    // Generate lottery entries if payment is successful
    if (status === 'paid') {
      try {
        const { error: lotteryError } = await supabaseAdmin.rpc(
          'generate_lottery_entries_for_order',
          { order_id_param: orderId }
        );

        if (lotteryError) {
          console.error("Error generating lottery entries:", lotteryError);
        } else {
          console.log(`Lottery entries generated for order ${orderId}`);
        }
      } catch (lotteryErr) {
        console.error("Exception generating lottery entries:", lotteryErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: orderId,
        status: status,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating order payment:", error);
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
