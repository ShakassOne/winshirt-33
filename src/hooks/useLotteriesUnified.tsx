
import { useUnifiedQuery } from './useUnifiedQuery';
import { supabase } from '@/integrations/supabase/client';
import { Lottery } from '@/types/supabase.types';

const fetchLotteries = async (): Promise<Lottery[]> => {
  const { data, error } = await supabase
    .from('lotteries')
    .select('*')
    .eq('is_active', true)
    .order('draw_date', { ascending: true });

  if (error) {
    console.error('Error fetching lotteries:', error);
    throw error;
  }

  return data || [];
};

export const useLotteriesUnified = () => {
  return useUnifiedQuery({
    queryKey: ['lotteries'],
    queryFn: fetchLotteries,
    debugName: 'Lotteries',
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
