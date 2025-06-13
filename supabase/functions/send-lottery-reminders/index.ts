
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
    console.log("Envoi des rappels de loteries");

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

    // Récupérer les loteries actives qui se terminent dans les 3 prochains jours
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const { data: lotteries, error: lotteriesError } = await supabaseAdmin
      .from("lotteries")
      .select("*")
      .eq("is_active", true)
      .lt("draw_date", threeDaysFromNow.toISOString())
      .gt("draw_date", new Date().toISOString());

    if (lotteriesError) {
      throw new Error(`Erreur récupération loteries: ${lotteriesError.message}`);
    }

    if (!lotteries || lotteries.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Aucune loterie à rappeler",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Récupérer tous les utilisateurs qui ont passé des commandes
    const { data: customers, error: customersError } = await supabaseAdmin
      .from("orders")
      .select("shipping_email, shipping_first_name, shipping_last_name")
      .eq("payment_status", "paid")
      .not("shipping_email", "is", null);

    if (customersError) {
      throw new Error(`Erreur récupération clients: ${customersError.message}`);
    }

    // Déduplication des emails
    const uniqueCustomers = customers.reduce((acc: any[], customer) => {
      if (!acc.find(c => c.shipping_email === customer.shipping_email)) {
        acc.push(customer);
      }
      return acc;
    }, []);

    // Récupérer le template
    const { data: template, error: templateError } = await supabaseAdmin
      .from("email_templates")
      .select("*")
      .eq("type", "lottery_reminder")
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

    // Préparer la liste des loteries
    const lotteryList = lotteries.map(lottery => 
      `<div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
        <h4 style="margin: 0 0 10px 0; color: #333;">${lottery.title}</h4>
        <p style="margin: 5px 0;"><strong>Valeur:</strong> ${lottery.value}€</p>
        <p style="margin: 5px 0;"><strong>Participants:</strong> ${lottery.participants}/${lottery.goal}</p>
        <p style="margin: 5px 0;"><strong>Tirage le:</strong> ${new Date(lottery.draw_date).toLocaleDateString('fr-FR')}</p>
        <p style="margin: 5px 0; font-size: 14px; color: #666;">${lottery.description}</p>
      </div>`
    ).join('');

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

    let sentCount = 0;
    let failedCount = 0;

    // Envoyer à chaque client
    for (const customer of uniqueCustomers) {
      try {
        const variables = {
          customer_name: `${customer.shipping_first_name || ''} ${customer.shipping_last_name || ''}`.trim() || 'Client',
          lottery_list: lotteryList,
          site_url: 'https://winshirt.fr'
        };

        // Remplacer les variables dans le template
        let htmlContent = template.html_content;
        let subject = template.subject;

        Object.entries(variables).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          htmlContent = htmlContent.replace(regex, String(value));
          subject = subject.replace(regex, String(value));
        });

        // Envoyer l'email
        const mailOptions = {
          from: `${settings.from_name} <${settings.from_email}>`,
          to: customer.shipping_email,
          subject: subject,
          html: htmlContent,
        };

        await transporter.sendMail(mailOptions);

        // Logger l'envoi
        await supabaseAdmin
          .from("email_logs")
          .insert({
            template_id: template.id,
            recipient_email: customer.shipping_email,
            recipient_name: variables.customer_name,
            subject: subject,
            status: 'sent',
            sent_at: new Date().toISOString(),
          });

        sentCount++;
        
        // Attendre 100ms entre chaque envoi pour ne pas surcharger le serveur
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (emailError) {
        console.error(`Erreur envoi à ${customer.shipping_email}:`, emailError);
        failedCount++;

        // Logger l'échec
        await supabaseAdmin
          .from("email_logs")
          .insert({
            template_id: template.id,
            recipient_email: customer.shipping_email,
            recipient_name: `${customer.shipping_first_name || ''} ${customer.shipping_last_name || ''}`.trim(),
            subject: template.subject,
            status: 'failed',
            error_message: emailError.message,
          });
      }
    }

    console.log(`Rappels loteries envoyés: ${sentCount} succès, ${failedCount} échecs`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Rappels envoyés: ${sentCount} succès, ${failedCount} échecs`,
        sent: sentCount,
        failed: failedCount,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erreur envoi rappels loteries:", error);

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
