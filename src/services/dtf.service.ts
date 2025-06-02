
import { supabase } from "@/integrations/supabase/client";
import { DTFProductionRecord, DTFProductionStatus, DTFOrderWithDetails } from "@/types/dtf.types";

export const getDTFOrders = async (): Promise<DTFOrderWithDetails[]> => {
  try {
    const { data, error } = await supabase
      .from('dtf_production_status')
      .select(`
        *,
        order:orders(
          id,
          shipping_first_name,
          shipping_last_name,
          shipping_email,
          total_amount,
          created_at,
          payment_status,
          items:order_items(
            id,
            quantity,
            product_id,
            mockup_recto_url,
            mockup_verso_url,
            selected_size,
            selected_color,
            customization,
            products:product_id(
              id,
              name,
              image_url
            )
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transformer les données pour assurer la compatibilité des types
    const transformedData = (data || []).map(item => ({
      ...item,
      production_status: item.production_status as DTFProductionStatus
    }));
    
    return transformedData;
  } catch (error) {
    console.error('Error fetching DTF orders:', error);
    throw error;
  }
};

export const updateDTFStatus = async (
  id: string, 
  status: DTFProductionStatus, 
  notes?: string
): Promise<void> => {
  try {
    const updateData: any = { 
      production_status: status,
      updated_at: new Date().toISOString()
    };

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    // Ajouter les timestamps selon le statut
    if (status === 'in_progress' && !updateData.started_at) {
      updateData.started_at = new Date().toISOString();
    }
    
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('dtf_production_status')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating DTF status:', error);
    throw error;
  }
};
