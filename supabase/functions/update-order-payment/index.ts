
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
    // Verify authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Unauthorized: Missing authorization header');
    }

    const { orderId, paymentIntentId, status } = await req.json();

    // Input validation
    if (!orderId || !paymentIntentId || !status) {
      throw new Error("Missing required parameters: orderId, paymentIntentId, or status");
    }

    // Validate status parameter
    const validStatuses = ['paid', 'failed', 'pending'];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status parameter");
    }

    console.log(`Updating order ${orderId} payment status to ${status}`);

    // Initialize Supabase admin client with proper error handling
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

    // Verify the order exists before updating
    const { data: existingOrder, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("id, payment_status, user_id")
      .eq("id", orderId)
      .single();

    if (fetchError || !existingOrder) {
      throw new Error("Order not found or access denied");
    }

    // Update order status with additional security checks
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
      throw new Error("Failed to update order status");
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

      // Mettre à jour les compteurs de participants des loteries
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
    
    // Don't expose internal error details to clients
    const clientError = error.message.includes('Unauthorized') ||
                       error.message.includes('Missing required') ||
                       error.message.includes('Invalid') ||
                       error.message.includes('not found') ||
                       error.message.includes('access denied')
      ? error.message 
      : 'Failed to update payment status';
    
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
