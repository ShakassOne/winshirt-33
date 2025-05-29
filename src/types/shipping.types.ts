
export type ShippingOption = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  estimated_days_min: number;
  estimated_days_max: number;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
};

export type ShippingFormData = {
  selectedShippingOption: string;
  shippingCost: number;
};
