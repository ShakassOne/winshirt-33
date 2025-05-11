
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
    const { orderId, email } = await req.json();

    if (!orderId || !email) {
      throw new Error("Order ID and email are required");
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

    // Get the order with items
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError) {
      throw new Error(`Error fetching order: ${orderError.message}`);
    }

    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select(`
        *,
        products:product_id (*)
      `)
      .eq("order_id", orderId);

    if (itemsError) {
      throw new Error(`Error fetching order items: ${itemsError.message}`);
    }

    // In a real implementation, we would use a proper email service like Resend
    // For now, we're just logging the email we would send
    console.log(`Sending order confirmation email to: ${email}`);
    console.log(`Order details: ${JSON.stringify(order)}`);
    console.log(`Order items: ${JSON.stringify(orderItems)}`);
    
    // Format email content (this would normally be HTML template)
    let emailContent = `Confirmation de commande #${orderId}\n\n`;
    emailContent += `Date: ${new Date(order.created_at).toLocaleDateString()}\n`;
    emailContent += `Total: ${order.total_amount.toFixed(2)} €\n\n`;
    emailContent += `Articles commandés:\n`;
    
    orderItems.forEach((item: any) => {
      emailContent += `- ${item.products.name} (${item.quantity}x) - ${(item.price * item.quantity).toFixed(2)} €\n`;
    });
    
    emailContent += `\nMerci pour votre commande!`;
    
    console.log(emailContent);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email would be sent in a real implementation",
        emailContent,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending order confirmation:", error);
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
