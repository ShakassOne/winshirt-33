
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

    // Envoyer l'email de confirmation de commande
    try {
      const { error: emailError } = await supabaseAdmin.functions.invoke(
        'send-order-confirmation',
        { body: { orderId: orderId } }
      );

      if (emailError) {
        console.error("Error sending order confirmation email:", emailError);
        // Ne pas faire échouer le paiement pour un problème d'email
      } else {
        console.log(`Order confirmation email sent for order ${orderId}`);
      }
    } catch (emailErr) {
      console.error("Exception sending order confirmation email:", emailErr);
      // Continue - payment processing should not fail due to email issues
    }

    // Generate lottery entries for this order using the corrected function
    try {
      const { error: lotteryError } = await supabaseAdmin.rpc(
        'generate_lottery_entries_for_order',
        { order_id_param: orderId }
      );

      if (lotteryError) {
        console.error("Error generating lottery entries:", lotteryError);
        // Don't throw here - order is still valid even if lottery fails
      } else {
        console.log(`Lottery entries generated for order ${orderId} with respect to chosen lotteries`);
      }
    } catch (lotteryErr) {
      console.error("Exception generating lottery entries:", lotteryErr);
      // Continue - order processing should not fail due to lottery issues
    }

    // Update lottery participant counters
    try {
      const { data: orderItems, error: itemsError } = await supabaseAdmin
        .from('order_items')
        .select('id')
        .eq('order_id', orderId);

      if (!itemsError && orderItems && orderItems.length > 0) {
        const itemIds = orderItems.map((it: any) => it.id);
        const { data: entries, error: entriesError } = await supabaseAdmin
          .from('lottery_entries')
          .select('lottery_id')
          .in('order_item_id', itemIds);

        if (!entriesError && entries) {
          const counts: Record<string, number> = {};
          entries.forEach((e: any) => {
            counts[e.lottery_id] = (counts[e.lottery_id] || 0) + 1;
          });

          for (const [lotteryId, increment] of Object.entries(counts)) {
            const { data: lotData, error: lotError } = await supabaseAdmin
              .from('lotteries')
              .select('participants')
              .eq('id', lotteryId)
              .single();
            if (lotError) {
              console.error(`Error fetching lottery ${lotteryId}:`, lotError);
              continue;
            }
            const newCount = (lotData?.participants || 0) + increment;
            const { error: updError } = await supabaseAdmin
              .from('lotteries')
              .update({ participants: newCount })
              .eq('id', lotteryId);
            if (updError) {
              console.error(`Error updating lottery ${lotteryId}:`, updError);
            } else {
              console.log(`Lottery ${lotteryId} participants -> ${newCount}`);
            }
          }
        }
      }
    } catch (partErr) {
      console.error('Error updating lottery participants:', partErr);
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
