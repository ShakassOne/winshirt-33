
import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Upload image vers winshirt.fr/upload-visuel.php
const uploadImageToWinshirt = async (dalleImageUrl: string, fileName: string) => {
  try {
    console.log('[Edge Function] Upload image IA vers winshirt.fr...');
    
    // 1. Récupération du blob depuis l'URL DALL·E
    const response = await fetch(dalleImageUrl);
    if (!response.ok) throw new Error("Impossible de récupérer l'image DALL·E");
    const blob = await response.blob();

    // 2. Création du FormData pour l'upload
    const formData = new FormData();
    formData.append('file', blob, `${fileName}.png`);

    // 3. Upload vers votre script PHP
    const uploadResponse = await fetch('https://winshirt.fr/upload-visuel.php', {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`HTTP ${uploadResponse.status}: ${uploadResponse.statusText}`);
    }

    const uploadResult = await uploadResponse.json();
    console.log('[Edge Function] Réponse winshirt.fr:', uploadResult);

    if (uploadResult.success === true && uploadResult.url) {
      console.log('[Edge Function] Image IA uploadée avec succès:', uploadResult.url);
      return uploadResult.url;
    } else {
      const errorMessage = uploadResult.error || uploadResult.message || 'Upload échoué sur winshirt.fr';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Error uploading image to winshirt.fr:", error);
    throw error;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, sessionToken } = await req.json()
    const apiKey = Deno.env.get("OPENAI_API_KEY")
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

    // Get user ID from auth header
    const authHeader = req.headers.get('authorization')
    let userId = null
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const { data: { user } } = await supabase.auth.getUser(token)
        userId = user?.id
      } catch (error) {
        console.log('No valid auth token, treating as anonymous user')
      }
    }

    // Check if we have either userId or sessionToken
    if (!userId && !sessionToken) {
      return new Response(JSON.stringify({ error: "Utilisateur non identifié" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Check generation limit (3 per user/session)
    const { data: generations, error: genError } = await supabase
      .from('ai_generations')
      .select('id')
      .or(userId ? `user_id.eq.${userId}` : `session_token.eq.${sessionToken}`)

    if (genError) {
      console.error('Error checking generations:', genError)
      return new Response(JSON.stringify({ error: "Erreur lors de la vérification des générations" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    if (generations && generations.length >= 3) {
      return new Response(JSON.stringify({ 
        error: "Limite de 3 générations atteinte. Parcourez les images déjà générées ci-dessous.",
        limitReached: true
      }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Search for existing similar image first
    const { data: existingImages } = await supabase
      .from('ai_images')
      .select('*')
      .textSearch('prompt', prompt.trim(), { config: 'french' })
      .limit(1)

    if (existingImages && existingImages.length > 0) {
      const recycledImage = existingImages[0]
      
      // Update usage count
      await supabase
        .from('ai_images')
        .update({ 
          usage_count: recycledImage.usage_count + 1,
          is_used: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', recycledImage.id)

      // Record the generation (even for recycled images)
      await supabase
        .from('ai_generations')
        .insert({
          user_id: userId,
          session_token: sessionToken,
          prompt: prompt,
          image_url: recycledImage.image_url,
          cost: 0 // Recycled images are free
        })

      return new Response(JSON.stringify({ 
        imageUrl: recycledImage.image_url,
        recycled: true,
        message: "Image recyclée trouvée ! (Gratuite)"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Generate new image with OpenAI
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        size: "1024x1024",
        quality: "standard",
        n: 1
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OpenAI API Error:", errorData)
      
      // Handle specific moderation errors
      if (errorData.error?.type === "image_generation_user_error") {
        return new Response(JSON.stringify({ 
          error: "Le contenu de votre demande a été refusé par les filtres de sécurité. Veuillez essayer avec une description différente." 
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
      
      return new Response(JSON.stringify({ 
        error: errorData.error?.message || "Erreur lors de la génération de l'image" 
      }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const data = await response.json()
    const tempImageUrl = data.data[0].url

    // Generate unique filename
    const fileName = `ai-${userId || sessionToken}-${Date.now()}`
    
    // Upload image to winshirt.fr and get permanent URL
    const permanentImageUrl = await uploadImageToWinshirt(tempImageUrl, fileName)

    // Save to ai_images for recycling with permanent URL
    await supabase
      .from('ai_images')
      .insert({
        prompt: prompt,
        image_url: permanentImageUrl,
        is_used: true,
        usage_count: 1
      })

    // Record the generation with permanent URL
    await supabase
      .from('ai_generations')
      .insert({
        user_id: userId,
        session_token: sessionToken,
        prompt: prompt,
        image_url: permanentImageUrl,
        cost: 0.037
      })

    const remainingGenerations = 3 - (generations?.length || 0) - 1

    return new Response(JSON.stringify({ 
      imageUrl: permanentImageUrl,
      remainingGenerations
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error in generate-image function:", error)
    return new Response(JSON.stringify({ error: "Erreur interne du serveur" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
