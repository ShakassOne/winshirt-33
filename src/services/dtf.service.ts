import { supabase } from "@/integrations/supabase/client";

export type DTFProductionStatus = 'pending' | 'in_progress' | 'ready' | 'completed';

export interface DTFProductionStatusRecord {
  id: string;
  order_id: string;
  production_status: DTFProductionStatus;
  notes: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DTFOrderWithDetails extends DTFProductionStatusRecord {
  order: {
    id: string;
    shipping_first_name: string;
    shipping_last_name: string;
    shipping_email: string;
    total_amount: number;
    created_at: string;
    payment_status: string;
    items: Array<{
      id: string;
      product_id: string;
      quantity: number;
      price: number;
      customization: any;
      mockup_recto_url?: string;
      mockup_verso_url?: string;
      visual_front_url?: string;
      visual_back_url?: string;
      mockup_url?: string;
      selected_size?: string;
      selected_color?: string;
      lottery_name?: string;
      products: {
        id: string;
        name: string;
        image_url: string;
        description: string;
        price: number;
        mockup_id?: string;
        mockups?: {
          id: string;
          name: string;
          svg_front_url: string;
          svg_back_url?: string;
        };
      };
      mockups?: {
        id: string;
        name: string;
        svg_front_url: string;
        svg_back_url?: string;
      };
    }>;
  };
}

export const getDTFOrders = async (): Promise<DTFOrderWithDetails[]> => {
  try {
    const { data, error } = await supabase
      .from('dtf_production_status')
      .select(`
        *,
        order:orders!dtf_production_status_order_id_fkey(
          id,
          shipping_first_name,
          shipping_last_name,
          shipping_email,
          total_amount,
          created_at,
          payment_status,
          items:order_items(
            id,
            product_id,
            quantity,
            price,
            customization,
            mockup_recto_url,
            mockup_verso_url,
            selected_size,
            selected_color,
            lottery_name,
            products:product_id(
              id,
              name,
              image_url,
              description,
              price,
              mockup_id,
              mockups:mockup_id(
                id,
                name,
                svg_front_url,
                svg_back_url
              )
            )
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      ...item,
      production_status: item.production_status as DTFProductionStatus,
      order: {
        ...item.order,
        items: item.order.items?.map(orderItem => ({
          ...orderItem,
          // Map existing mockup URLs to standardized names
          visual_front_url: orderItem.mockup_recto_url,
          visual_back_url: orderItem.mockup_verso_url,
          // Get mockup URL from products.mockups or fallback to product image
          mockup_url: orderItem.products?.mockups?.svg_front_url || orderItem.products?.image_url,
          // Keep the mockups data with correct structure
          mockups: orderItem.products?.mockups || undefined
        })) || []
      }
    }));
  } catch (error) {
    console.error("Error fetching DTF orders:", error);
    throw error;
  }
};

export const updateDTFProductionStatus = async (
  id: string, 
  status: DTFProductionStatus, 
  notes?: string
) => {
  try {
    const updateData: any = { 
      production_status: status,
      updated_at: new Date().toISOString()
    };

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    // Set timestamps based on status
    if (status === 'in_progress') {
      updateData.started_at = new Date().toISOString();
    } else if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('dtf_production_status')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating DTF production status:", error);
    throw error;
  }
};
