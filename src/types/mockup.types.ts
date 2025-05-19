
import { Mockup } from '@/types/supabase.types';

export type MockupColor = {
  id: string;
  name: string;
  hex: string;
  product_image?: string;
  color_code?: string;
  front_image_url?: string;
  back_image_url?: string;
};

export interface MockupWithColors extends Mockup {
  colors: MockupColor[];
  print_areas: any[];
  svg_front_url: string;
  svg_back_url?: string;
  price_a3: number;
  price_a4: number;
  price_a5: number;
  price_a6: number;
  text_price_front: number;
  text_price_back: number;
}

// Update PrintArea to include position_x and position_y fields
export type PrintArea = {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  side: 'front' | 'back';
  position_x?: number;
  position_y?: number;
};
