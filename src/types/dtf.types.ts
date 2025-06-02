
export type DTFProductionStatus = 'pending' | 'in_progress' | 'ready' | 'completed';

export type DTFProductionRecord = {
  id: string;
  order_id: string;
  production_status: DTFProductionStatus;
  notes: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DTFOrderWithDetails = {
  id: string;
  order_id: string;
  production_status: DTFProductionStatus;
  notes: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
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
      quantity: number;
      product_id: string;
      mockup_recto_url: string | null;
      mockup_verso_url: string | null;
      selected_size: string | null;
      selected_color: string | null;
      customization: any;
      products: {
        id: string;
        name: string;
        image_url: string;
      };
    }>;
  };
};
