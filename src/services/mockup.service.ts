
import { supabase } from '@/integrations/supabase/client';
import { MockupWithColors } from '@/types/mockup.types';

export const getMockupById = async (id: string): Promise<MockupWithColors | null> => {
  const { data, error } = await supabase
    .from('mockups')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching mockup:', error);
    throw error;
  }
  
  if (!data) return null;
  
  // Convert Json to MockupColor[]
  const colors = Array.isArray(data.colors) ? data.colors as any[] : [];
  
  return {
    ...data,
    colors: colors
  };
};

export const generateMockupImage = async (params: {
  mockupId: string;
  designId: string | null;
  color?: string;
  customText: string | null;
  textColor: string | null;
  textFont: string | null;
  textSize: number | null;
}): Promise<{ rectoUrl: string; versoUrl?: string }> => {
  // Mock implementation - in a real app this would call an API
  console.log('Generating mockup with params:', params);
  
  // Return mock URLs
  return {
    rectoUrl: 'https://placehold.co/400x400/png',
    versoUrl: 'https://placehold.co/400x400/png'
  };
};
