import logger from '@/utils/logger';

import { supabase } from "@/integrations/supabase/client";

export const processExistingOrdersForLottery = async () => {
  try {
    const { error } = await supabase.rpc('process_existing_orders_for_lottery');
    
    if (error) {
      console.error('Error processing existing orders for lottery:', error);
      throw error;
    }
    
    logger.log('Successfully processed existing orders for lottery');
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
    
    logger.log(`Successfully generated lottery entries for order ${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Exception generating lottery entries:', error);
    throw error;
  }
};
