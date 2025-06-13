
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
      console.error("❌ [DEBUG] Paramètres manquants:", { recipientEmail, templateType });
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email destinataire et type de template requis",
          debug: { missingParams: true }
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log(`🔍 [DEBUG] Test email ${templateType} vers ${recipientEmail}`);

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

    console.log(`🔍 [DEBUG] Supabase client initialisé`);

    // Récupérer le template
    const { data: template, error: templateError } = await supabaseAdmin
      .from("email_templates")
      .select("*")
      .eq("type", templateType)
      .eq("is_active", true)
      .single();

    if (templateError) {
      console.error("❌ [DEBUG] Erreur template:", templateError);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Template non trouvé: ${templateError.message}`,
          debug: { templateError: templateError }
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    if (!template) {
      console.error("❌ [DEBUG] Template null pour type:", templateType);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Template "${templateType}" non trouvé ou inactif`,
          debug: { templateNull: true }
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log(`✅ [DEBUG] Template trouvé:`, {
      id: template.id,
      name: template.name,
      type: template.type
    });

    // Récupérer les paramètres SMTP
    const { data: settings, error: settingsError } = await supabaseAdmin
      .from("email_settings")
      .select("*")
      .eq("is_active", true)
      .single();

    if (settingsError) {
      console.error("❌ [DEBUG] Erreur settings:", settingsError);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Paramètres SMTP non configurés: ${settingsError.message}`,
          debug: { settingsError: settingsError }
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    if (!settings) {
      console.error("❌ [DEBUG] Aucun paramètre SMTP actif trouvé");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Aucun paramètre SMTP actif trouvé",
          debug: { settingsNull: true }
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log(`✅ [DEBUG] Paramètres SMTP trouvés:`, {
      host: settings.smtp_host,
      port: settings.smtp_port,
      secure: settings.smtp_secure,
      user: settings.smtp_user,
      from_email: settings.from_email,
      from_name: settings.from_name
    });

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

    console.log(`🔍 [DEBUG] Variables préparées pour template ${templateType}`);

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

    console.log(`✅ [DEBUG] Template traité, sujet: ${subject}`);

    // Configuration du transporteur avec debug avancé
    const transportConfig = {
      host: settings.smtp_host,
      port: settings.smtp_port,
      secure: settings.smtp_secure,
      auth: {
        user: settings.smtp_user,
        pass: settings.smtp_password,
      },
      debug: true,
      logger: true,
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    };

    console.log(`🔍 [DEBUG] Configuration transporteur:`, {
      ...transportConfig,
      auth: { user: transportConfig.auth.user, pass: '[HIDDEN]' }
    });

    try {
      const transporter = nodemailer.createTransporter(transportConfig);
      console.log(`🔍 [DEBUG] Transporteur créé, test de connexion...`);

      // Test de connexion avec gestion d'erreur détaillée
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout de connexion SMTP (15s)'));
        }, 15000);

        transporter.verify((error, success) => {
          clearTimeout(timeout);
          if (error) {
            console.error("❌ [DEBUG] Erreur de vérification SMTP:", {
              code: error.code,
              command: error.command,
              response: error.response,
              responseCode: error.responseCode,
              message: error.message,
              errno: error.errno,
              syscall: error.syscall
            });

            // Messages d'erreur spécifiques selon le code
            let suggestion = "";
            if (error.code === 'ECONNREFUSED') {
              suggestion = "Connexion refusée - Vérifiez l'adresse du serveur et le port";
            } else if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
              suggestion = "Timeout - Le serveur SMTP ne répond pas dans les délais";
            } else if (error.code === 'ENOTFOUND') {
              suggestion = "Serveur non trouvé - Vérifiez l'adresse SMTP";
            } else if (error.code === 'ECONNRESET') {
              suggestion = "Connexion fermée par le serveur - Problème de configuration SSL/TLS";
            } else if (error.responseCode === 535) {
              suggestion = "Authentification échouée - Vérifiez le nom d'utilisateur et mot de passe";
            } else if (error.responseCode === 587 || error.responseCode === 465) {
              suggestion = "Problème de port - Essayez le port 587 avec STARTTLS ou 465 avec SSL";
            }

            reject(new Error(`${error.message}${suggestion ? ` - ${suggestion}` : ''}`));
          } else {
            console.log("✅ [DEBUG] Connexion SMTP vérifiée avec succès");
            resolve(success);
          }
        });
      });

      // Préparation et envoi de l'email
      const mailOptions = {
        from: `${settings.from_name} <${settings.from_email}>`,
        to: recipientEmail,
        subject: subject,
        html: htmlContent,
      };

      console.log(`🔍 [DEBUG] Envoi de l'email...`, {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        htmlLength: htmlContent.length
      });

      const sendResult = await transporter.sendMail(mailOptions);
      console.log("✅ [DEBUG] Email envoyé avec succès:", {
        messageId: sendResult.messageId,
        response: sendResult.response
      });

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

      console.log(`✅ [DEBUG] Log d'envoi créé`);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Email de test envoyé avec succès",
          messageId: sendResult.messageId,
          debug: {
            smtpHost: settings.smtp_host,
            smtpPort: settings.smtp_port,
            smtpSecure: settings.smtp_secure,
            templateType: templateType,
            response: sendResult.response
          }
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );

    } catch (transportError: any) {
      console.error("❌ [DEBUG] Erreur transporteur:", transportError);
      
      return new Response(
        JSON.stringify({
          success: false,
          error: `Erreur SMTP: ${transportError.message}`,
          debug: {
            transportError: transportError.name,
            smtpConfig: {
              host: settings.smtp_host,
              port: settings.smtp_port,
              secure: settings.smtp_secure,
              user: settings.smtp_user
            }
          }
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

  } catch (error: any) {
    console.error("❌ [DEBUG] Erreur complète:", {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        debug: {
          errorType: error.name,
          errorCode: error.code,
          timestamp: new Date().toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
