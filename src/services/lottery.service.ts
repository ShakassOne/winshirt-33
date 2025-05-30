
import { supabase } from "@/integrations/supabase/client";
import { Lottery } from '@/types/supabase.types';

export const getLotteries = async (): Promise<Lottery[]> => {
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

export const processExistingOrdersForLottery = async () => {
  try {
    const { error } = await supabase.rpc('process_existing_orders_for_lottery');
    
    if (error) {
      console.error('Error processing existing orders for lottery:', error);
      throw error;
    }
    
    console.log('Successfully processed existing orders for lottery');
    return { success: true };
  } catch (error) {
    console.error('Exception processing existing orders:', error);
    throw error;
  }
};

export const generateLotteryEntriesForOrder = async (orderId: string) => {
  try {
    const { error } = await supabase.rpc('generate_lottery_entries_for_order', {
      order_id_param: orderId
    });
    
    if (error) {
      console.error('Error generating lottery entries for order:', error);
      throw error;
    }
    
    console.log(`Successfully generated lottery entries for order ${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Exception generating lottery entries:', error);
    throw error;
  }
};
