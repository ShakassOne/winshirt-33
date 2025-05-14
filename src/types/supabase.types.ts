// Add this to your existing supabase.types.ts file
export interface Lottery {
  id: string;
  title: string;
  description: string;
  image_url: string;
  value: number;
  participants: number;
  goal: number;
  is_active: boolean;
  is_featured: boolean;
  draw_date: string;
  created_at?: string;
  updated_at?: string;
}

// If Product interface exists, update it to include images array
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  images?: string[];
  category: string;
  is_customizable: boolean;
  is_active: boolean;
  tickets_offered?: number;
  color?: string;
  available_colors?: string[];
  available_sizes?: string[];
  mockup_id?: string;
  created_at?: string;
  updated_at?: string;
}
