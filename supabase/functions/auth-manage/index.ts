
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AUTH-MANAGE] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    // Parse request body
    const { action, email, password, userData = {} } = await req.json();
    
    if (!action || !email) {
      throw new Error("Missing required parameters");
    }
    logStep("Request parameters", { action, email });
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
    
    let result;
    
    // Handle different auth actions
    switch (action) {
      case "signup":
        if (!password) {
          throw new Error("Password is required for signup");
        }
        
        // Create user in auth.users table
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // Auto-confirm email
          user_metadata: userData,
        });
        
        if (authError) {
          throw authError;
        }
        
        // Send welcome email
        await fetch(new URL('/send-email', req.url).href, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': req.headers.get('Authorization') || '',
          },
          body: JSON.stringify({
            type: 'welcome',
            email,
            name: userData.firstName || '',
          }),
        });
        
        result = { user: authData.user };
        break;
        
      case "reset_password":
        // Send password reset email
        const { data: resetData, error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: new URL('/auth/reset-password', req.headers.get('origin') || '').href,
        });
        
        if (resetError) {
          throw resetError;
        }
        
        // Send password reset notification
        await fetch(new URL('/send-email', req.url).href, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'password_reset',
            email,
          }),
        });
        
        result = { success: true };
        break;
        
      default:
        throw new Error(`Unsupported action: ${action}`);
    }
    
    logStep(`${action} completed`, result);
    
    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in auth-manage:", error);
    
    return new Response(
      JSON.stringify({ 
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
