
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
    const { recipientEmail, templateType } = await req.json();

    if (!recipientEmail || !templateType) {
      throw new Error("Email destinataire et type de template requis");
    }

    console.log(`Test email ${templateType} vers ${recipientEmail}`);

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

    // Récupérer le template
    const { data: template, error: templateError } = await supabaseAdmin
      .from("email_templates")
      .select("*")
      .eq("type", templateType)
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

    // Variables de test selon le type de template
    let variables: Record<string, any> = {};

    switch (templateType) {
      case 'order_confirmation':
        variables = {
          customer_name: 'Jean Dupont',
          order_number: 'TEST123',
          order_date: new Date().toLocaleDateString('fr-FR'),
          total_amount: '29.99',
          order_items: '<div style="border-bottom: 1px solid #eee; padding: 10px 0;"><strong>T-shirt Test</strong><br>Quantité: 1 - Prix: 29.99€<br>Taille: L<br>Couleur: Noir</div>',
          shipping_address: '123 Rue de Test<br>75001 Paris<br>France'
        };
        break;
      case 'shipping_notification':
        variables = {
          customer_name: 'Jean Dupont',
          order_number: 'TEST123',
          shipping_date: new Date().toLocaleDateString('fr-FR'),
          tracking_number: 'TEST123456789',
          carrier_name: 'Colissimo',
          shipping_address: '123 Rue de Test<br>75001 Paris<br>France'
        };
        break;
      case 'lottery_reminder':
        variables = {
          customer_name: 'Jean Dupont',
          lottery_list: '<div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;"><h4 style="margin: 0 0 10px 0; color: #333;">Loterie Test</h4><p style="margin: 5px 0;"><strong>Valeur:</strong> 100€</p><p style="margin: 5px 0;"><strong>Participants:</strong> 25/50</p><p style="margin: 5px 0;"><strong>Tirage le:</strong> 31/12/2024</p></div>',
          site_url: 'https://winshirt.fr'
        };
        break;
      default:
        variables = { customer_name: 'Test User' };
    }

    // Remplacer les variables dans le template
    let htmlContent = template.html_content;
    let subject = `[TEST] ${template.subject}`;

    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      htmlContent = htmlContent.replace(regex, String(value));
      subject = subject.replace(regex, String(value));
    });

    // Gérer les conditions dans le template
    htmlContent = htmlContent.replace(/{{#if tracking_number}}(.*?){{\/if}}/gs, '$1');

    // Configurer nodemailer - CORRECTION ICI : createTransport au lieu de createTransporter
    const transporter = nodemailer.createTransport({
      host: settings.smtp_host,
      port: settings.smtp_port,
      secure: settings.smtp_secure,
      auth: {
        user: settings.smtp_user,
        pass: settings.smtp_password,
      },
    });

    // Envoyer l'email de test
    const mailOptions = {
      from: `${settings.from_name} <${settings.from_email}>`,
      to: recipientEmail,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    // Logger l'envoi
    await supabaseAdmin
      .from("email_logs")
      .insert({
        template_id: template.id,
        recipient_email: recipientEmail,
        recipient_name: 'Test User',
        subject: subject,
        status: 'sent',
        sent_at: new Date().toISOString(),
      });

    console.log(`Email de test envoyé avec succès à ${recipientEmail}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email de test envoyé avec succès",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erreur envoi email de test:", error);

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
