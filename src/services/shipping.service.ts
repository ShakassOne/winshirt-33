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

export const getAllShippingOptions = async (): Promise<ShippingOption[]> => {
  try {
    const { data, error } = await supabase
      .from('shipping_options')
      .select('*')
      .order('priority', { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching all shipping options:", error);
    throw error;
  }
};

export const createShippingOption = async (shippingOption: Omit<ShippingOption, 'id' | 'created_at' | 'updated_at'>): Promise<ShippingOption> => {
  try {
    const { data, error } = await supabase
      .from('shipping_options')
      .insert([shippingOption])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating shipping option:", error);
    throw error;
  }
};

export const updateShippingOption = async (id: string, updates: Partial<Omit<ShippingOption, 'id' | 'created_at' | 'updated_at'>>): Promise<ShippingOption> => {
  try {
    const { data, error } = await supabase
      .from('shipping_options')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating shipping option:", error);
    throw error;
  }
};

export const deleteShippingOption = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('shipping_options')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting shipping option:", error);
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
    console.error("Error fetching shipping option by ID:", error);
    throw error;
  }
};
