
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
    const { orderId, trackingNumber, carrierName = "Colissimo" } = await req.json();

    if (!orderId) {
      throw new Error("Order ID is required");
    }

    console.log(`Envoi notification expédition pour commande ${orderId}`);

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

    // Récupérer la commande
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      throw new Error(`Commande non trouvée: ${orderError?.message}`);
    }

    // Récupérer le template
    const { data: template, error: templateError } = await supabaseAdmin
      .from("email_templates")
      .select("*")
      .eq("type", "shipping_notification")
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
    const variables = {
      customer_name: `${order.shipping_first_name || ''} ${order.shipping_last_name || ''}`.trim() || 'Client',
      order_number: order.id.substring(0, 8).toUpperCase(),
      shipping_date: new Date().toLocaleDateString('fr-FR'),
      tracking_number: trackingNumber || '',
      carrier_name: carrierName,
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

    // Gérer les conditions dans le template (ex: {{#if tracking_number}})
    if (trackingNumber) {
      htmlContent = htmlContent.replace(/{{#if tracking_number}}(.*?){{\/if}}/gs, '$1');
    } else {
      htmlContent = htmlContent.replace(/{{#if tracking_number}}(.*?){{\/if}}/gs, '');
    }

    // Configurer nodemailer
    const transporter = nodemailer.createTransporter({
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

    console.log(`Notification expédition envoyée avec succès à ${order.shipping_email}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Notification d'expédition envoyée",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erreur envoi notification expédition:", error);

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
