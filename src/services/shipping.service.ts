
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

// Admin functions for CRUD operations
export const fetchAllShippingOptions = async (): Promise<ShippingOption[]> => {
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

export const createShippingOption = async (shippingData: Omit<ShippingOption, "id" | "created_at" | "updated_at">): Promise<ShippingOption> => {
  try {
    const { data, error } = await supabase
      .from('shipping_options')
      .insert([shippingData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating shipping option:", error);
    throw error;
  }
};

export const updateShippingOption = async (id: string, shippingData: Partial<ShippingOption>): Promise<ShippingOption> => {
  try {
    const { data, error } = await supabase
      .from('shipping_options')
      .update(shippingData)
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
