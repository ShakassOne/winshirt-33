
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
      throw new Error('Missing authorization header');
    }

    const { sessionId, orderId } = await req.json();

    if (!sessionId || !orderId) {
      throw new Error("Missing sessionId or orderId");
    }

    // Initialize Stripe with error handling
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Initialize Supabase admin client with proper error handling
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase configuration missing");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    });

    // Verify the order exists and belongs to an authenticated user
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("user_id, payment_status")
      .eq("id", orderId)
      .single();

    if (orderError || !orderData) {
      throw new Error("Order not found or access denied");
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log(`Verifying payment for session ${sessionId}, status: ${session.payment_status}`);

    if (session.payment_status === "paid") {
      // Update order status in database with additional security checks
      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "paid",
          payment_intent_id: session.payment_intent,
          status: "processing",
        })
        .eq("id", orderId)
        .eq("payment_status", "pending"); // Only update if still pending

      if (updateError) {
        console.error("Error updating order status:", updateError);
        throw updateError;
      }

      console.log(`Order ${orderId} marked as paid`);

      // Generate lottery entries for this order with error handling
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

      // Update lotteries participant counters based on generated entries
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
    
    // Don't expose internal error details to clients
    const clientError = error.message.includes('Missing') || 
                       error.message.includes('not found') || 
                       error.message.includes('access denied')
      ? error.message 
      : 'Payment verification failed';
    
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
