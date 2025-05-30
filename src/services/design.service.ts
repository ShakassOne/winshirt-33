
import { supabase } from '@/integrations/supabase/client';
import { Design } from '@/types/supabase.types';

export const getDesigns = async (): Promise<Design[]> => {
  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching designs:', error);
    throw error;
  }
  
  return data || [];
};

export const createDesign = async (designData: {
  name: string;
  image_url: string;
  user_id: string | null;
  is_public?: boolean;
  category: string;
}): Promise<Design> => {
  const { data, error } = await supabase
    .from('designs')
    .insert({
      name: designData.name,
      image_url: designData.image_url,
      category: designData.category,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating design:', error);
    throw error;
  }
  
  return data;
};
