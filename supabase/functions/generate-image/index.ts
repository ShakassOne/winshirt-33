
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      throw new Error('Le prompt est requis');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.error('Clé API OpenAI manquante');
      throw new Error('Clé API OpenAI non configurée');
    }

    console.log('Génération d\'image avec le prompt:', prompt);
    console.log('Clé API présente:', openAIApiKey.substring(0, 10) + '...');

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
      }),
    });

    console.log('Statut de la réponse OpenAI:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur OpenAI:', errorText);
      
      let errorMessage = 'Erreur lors de la génération de l\'image';
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        } else if (errorData.error?.type === 'image_generation_user_error') {
          errorMessage = 'Le prompt contient du contenu non autorisé. Veuillez modifier votre description.';
        }
      } catch (parseError) {
        console.error('Erreur lors du parsing de l\'erreur:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (!data.data || !data.data[0] || !data.data[0].url) {
      console.error('Réponse OpenAI invalide:', data);
      throw new Error('Réponse invalide de l\'API OpenAI');
    }

    const imageUrl = data.data[0].url;
    console.log('Image générée avec succès:', imageUrl);

    return new Response(JSON.stringify({ image: imageUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erreur dans generate-image:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erreur lors de la génération de l\'image' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
