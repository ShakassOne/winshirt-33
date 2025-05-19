
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Lottery } from '@/types/supabase.types';

// Create this hook to handle lottery fetching
export const useLotteries = () => {
  const fetchAllLotteries = async () => {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  };

  const fetchFeaturedLotteries = async () => {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  };

  return {
    fetchAllLotteries,
    fetchFeaturedLotteries
  };
};

// Expose the function directly too for components that don't need the full hook
export const fetchFeaturedLotteries = async () => {
  const { data, error } = await supabase
    .from('lotteries')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching featured lotteries:", error);
    return [];
  }
  
  return data || [];
};
