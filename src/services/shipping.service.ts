
import { supabase } from "@/integrations/supabase/client";
import { ShippingOption } from "@/types/shipping.types";

export const getShippingOptions = async (): Promise<ShippingOption[]> => {
  try {
    const { data, error } = await supabase
      .from('shipping_options')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching shipping options:", error);
    throw error;
  }
};

export const getShippingOptionById = async (id: string): Promise<ShippingOption | null> => {
  try {
    const { data, error } = await supabase
      .from('shipping_options')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching shipping option:", error);
    throw error;
  }
};
