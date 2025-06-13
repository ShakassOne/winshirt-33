
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import * as nodemailer from "npm:nodemailer@6.9.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      throw new Error("Order ID is required");
    }

    console.log(`Envoi email confirmation pour commande ${orderId}`);

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

    // Récupérer la commande avec ses items
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (name, price)
        )
      `)
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      throw new Error(`Commande non trouvée: ${orderError?.message}`);
    }

    // Récupérer le template
    const { data: template, error: templateError } = await supabaseAdmin
      .from("email_templates")
      .select("*")
      .eq("type", "order_confirmation")
      .eq("is_active", true)
      .single();

    if (templateError || !template) {
      throw new Error(`Template non trouvé: ${templateError?.message}`);
    }

    // Récupérer les paramètres SMTP
    const { data: settings, error: settingsError } = await supabaseAdmin
      .from("email_settings")
      .select("*")
      .eq("is_active", true)
      .single();

    if (settingsError || !settings) {
      throw new Error(`Paramètres SMTP non configurés: ${settingsError?.message}`);
    }

    // Préparer les variables pour le template
    const orderItems = order.order_items.map((item: any) => 
      `<div style="border-bottom: 1px solid #eee; padding: 10px 0;">
        <strong>${item.products.name}</strong><br>
        Quantité: ${item.quantity} - Prix: ${item.price}€
        ${item.selected_size ? `<br>Taille: ${item.selected_size}` : ''}
        ${item.selected_color ? `<br>Couleur: ${item.selected_color}` : ''}
      </div>`
    ).join('');

    const variables = {
      customer_name: `${order.shipping_first_name || ''} ${order.shipping_last_name || ''}`.trim() || 'Client',
      order_number: order.id.substring(0, 8).toUpperCase(),
      order_date: new Date(order.created_at).toLocaleDateString('fr-FR'),
      total_amount: order.total_amount,
      order_items: orderItems,
      shipping_address: `${order.shipping_address}<br>${order.shipping_postal_code} ${order.shipping_city}<br>${order.shipping_country}`
    };

    // Remplacer les variables dans le template
    let htmlContent = template.html_content;
    let subject = template.subject;

    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      htmlContent = htmlContent.replace(regex, String(value));
      subject = subject.replace(regex, String(value));
    });

    // Configurer nodemailer
    const transporter = nodemailer.createTransport({
      host: settings.smtp_host,
      port: settings.smtp_port,
      secure: settings.smtp_secure,
      auth: {
        user: settings.smtp_user,
        pass: settings.smtp_password,
      },
    });

    // Envoyer l'email
    const mailOptions = {
      from: `${settings.from_name} <${settings.from_email}>`,
      to: order.shipping_email,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    // Logger l'envoi
    await supabaseAdmin
      .from("email_logs")
      .insert({
        template_id: template.id,
        recipient_email: order.shipping_email,
        recipient_name: variables.customer_name,
        subject: subject,
        status: 'sent',
        sent_at: new Date().toISOString(),
        order_id: orderId,
      });

    console.log(`Email confirmation envoyé avec succès à ${order.shipping_email}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email de confirmation envoyé",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erreur envoi email confirmation:", error);

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
