
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@3.2.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-EMAIL] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    // Get Resend API key
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }
    
    const resend = new Resend(resendApiKey);
    
    // Parse request body
    const { 
      type, 
      email, 
      name = "",
      orderId = "",
      orderDetails = null
    } = await req.json();
    
    if (!type || !email) {
      throw new Error("Missing required parameters");
    }
    logStep("Parameters validated", { type, email });
    
    let subject = "";
    let html = "";
    
    // Generate email content based on type
    switch (type) {
      case "welcome":
        subject = "Bienvenue chez WinShirt!";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #6b21a8;">Bienvenue chez WinShirt, ${name}!</h1>
            <p>Merci de vous être inscrit sur notre plateforme. Vous pouvez maintenant:</p>
            <ul>
              <li>Commander des produits personnalisés</li>
              <li>Participer à nos loteries exclusives</li>
              <li>Suivre vos commandes et participations</li>
            </ul>
            <p>À très bientôt sur <a href="https://winshirt.fr" style="color: #6b21a8;">WinShirt</a>!</p>
          </div>
        `;
        break;
        
      case "password_reset":
        subject = "Réinitialisation de votre mot de passe";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #6b21a8;">Réinitialisation de votre mot de passe</h1>
            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
            <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
            <p>Pour réinitialiser votre mot de passe, cliquez sur le lien qui vous a été envoyé séparément.</p>
          </div>
        `;
        break;
        
      case "order_confirmation":
        subject = `Confirmation de votre commande #${orderId.substring(0, 8)}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #6b21a8;">Merci pour votre commande!</h1>
            <p>Bonjour${name ? ` ${name}` : ''},</p>
            <p>Nous avons bien reçu votre commande #${orderId.substring(0, 8)}.</p>
            <p>Nous allons traiter votre commande dans les plus brefs délais.</p>
            
            ${orderDetails ? `
            <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
              <h2 style="margin-top: 0; color: #6b21a8;">Récapitulatif de votre commande</h2>
              ${orderDetails.items && orderDetails.items.map((item: any) => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                  <div>
                    <strong>${item.quantity}x</strong> ${item.name}
                    ${item.color ? `<br><span style="color: #666;">Couleur: ${item.color}</span>` : ''}
                    ${item.size ? `<br><span style="color: #666;">Taille: ${item.size}</span>` : ''}
                  </div>
                  <div>${(item.price * item.quantity).toFixed(2)} €</div>
                </div>
              `).join('')}
              
              <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 2px solid #eee;">
                <strong>Total</strong>
                <strong>${orderDetails.total.toFixed(2)} €</strong>
              </div>
            </div>
            ` : ''}
            
            <p>Vous recevrez un email de notre part lorsque votre commande sera expédiée.</p>
            <p>À bientôt sur <a href="https://winshirt.fr" style="color: #6b21a8;">WinShirt</a>!</p>
          </div>
        `;
        break;
        
      default:
        throw new Error(`Unsupported email type: ${type}`);
    }
    
    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "WinShirt <noreply@winshirt.fr>",
      to: [email],
      subject,
      html,
    });
    
    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
    
    logStep("Email sent successfully", { type, to: email });
    
    return new Response(
      JSON.stringify({ 
        sent: true,
        id: data?.id,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in send-email:", error);
    
    return new Response(
      JSON.stringify({ 
        sent: false,
        error: error.message 
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
