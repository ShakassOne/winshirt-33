
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

// Updated Product interface with images array
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

// Add missing Design interface
export interface Design {
  id: string;
  name: string;
  category: string;
  image_url: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Add missing Mockup interface
export interface Mockup {
  id: string;
  name: string;
  category: string;
  svg_front_url: string;
  svg_back_url?: string;
  price_a4: number;
  price_a3: number;
  price_a5: number;
  price_a6: number;
  text_price_front: number;
  text_price_back: number;
  print_areas: PrintArea[] | string;
  colors?: MockupColor[] | string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
}

// Updated PrintArea interface with x and y properties
export interface PrintArea {
  id: string;
  name: string;
  width: number;
  height: number;
  position_x: number;
  position_y: number;
  x?: number; // Adding x for compatibility
  y?: number; // Adding y for compatibility
  side: 'front' | 'back';
}

// Add MockupColor interface
export interface MockupColor {
  id?: string;
  name: string;
  color_code: string;
  front_image_url: string;
  back_image_url?: string;
}

// Add CartItem interface
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  color?: string;
  size?: string;
  customization?: {
    text?: {
      content: string;
      font?: string;
      color?: string;
      size?: number;
    };
    designId?: string;
    designUrl?: string;
    position?: string;
    scale?: number;
  };
}
