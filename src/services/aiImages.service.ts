
import { supabase } from "@/integrations/supabase/client";

export interface AIImage {
  id: string;
  prompt: string;
  image_url: string;
  is_used: boolean;
  usage_count: number;
  created_at: string;
}

export interface GenerationStats {
  totalGenerations: number;
  remainingGenerations: number;
}

// Upload image to Supabase Storage
export const uploadImageToSupabase = async (
  dalleImageUrl: string,
  fileName: string = `ai-image-${Date.now()}`
): Promise<string> => {
  try {
    // 1. Récupération du blob depuis l'URL DALL·E
    const response = await fetch(dalleImageUrl);
    if (!response.ok) throw new Error("Impossible de récupérer l'image DALL·E");
    const blob = await response.blob();

    // 2. Upload vers Supabase Storage
    const { data, error } = await supabase.storage
      .from("ai-images")
      .upload(`${fileName}.png`, blob, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) {
      console.error("Erreur upload Supabase :", error);
      throw error;
    }

    // 3. Récupération de l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from("ai-images")
      .getPublicUrl(`${fileName}.png`);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading image to Supabase:", error);
    throw error;
  }
};

// Get session token for anonymous users
export const getSessionToken = (): string => {
  let token = localStorage.getItem('ai_session_token');
  if (!token) {
    token = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('ai_session_token', token);
  }
  return token;
};

// Get generation stats for current user/session
export const getGenerationStats = async (): Promise<GenerationStats> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const sessionToken = getSessionToken();

    const { data: generations, error } = await supabase
      .from('ai_generations')
      .select('id')
      .or(user ? `user_id.eq.${user.id}` : `session_token.eq.${sessionToken}`);

    if (error) {
      console.error('Error fetching generation stats:', error);
      return { totalGenerations: 0, remainingGenerations: 3 };
    }

    const totalGenerations = generations?.length || 0;
    const remainingGenerations = Math.max(0, 3 - totalGenerations);

    return {
      totalGenerations,
      remainingGenerations
    };
  } catch (error) {
    console.error('Error in getGenerationStats:', error);
    return { totalGenerations: 0, remainingGenerations: 3 };
  }
};

// Get available AI images for reuse
export const getAvailableAIImages = async (limit: number = 20): Promise<AIImage[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_images')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching AI images:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAvailableAIImages:', error);
    return [];
  }
};

// Generate image with the new system
export const generateImage = async (prompt: string): Promise<{
  imageUrl: string;
  recycled?: boolean;
  message?: string;
  remainingGenerations?: number;
  error?: string;
  limitReached?: boolean;
}> => {
  try {
    const sessionToken = getSessionToken();
    
    const response = await fetch('https://gyprtpqgeukcoxbfxtfg.supabase.co/functions/v1/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5cHJ0cHFnZXVrY294YmZ4dGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NzY1MDQsImV4cCI6MjA2MjM1MjUwNH0.sm-yWpvwGPvEFHdKomFsE-YKF0BHzry2W4Gma2hpY_4`
      },
      body: JSON.stringify({ prompt, sessionToken })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { imageUrl: '', error: data.error, limitReached: data.limitReached };
    }

    return data;
  } catch (error) {
    console.error('Error generating image:', error);
    return { imageUrl: '', error: 'Erreur lors de la génération de l\'image' };
  }
};
