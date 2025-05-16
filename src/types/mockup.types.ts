
// Mockup color variants type
import { Mockup } from '@/types/supabase.types';

export interface MockupColor {
  id?: string;
  name: string;
  color_code: string;
  front_image_url: string;
  back_image_url: string;
}

export interface PrintArea {
  id: string;
  name: string;
  width: number;
  height: number;
  position_x: number;
  position_y: number;
  side: 'front' | 'back';
  x?: number; // Add x and y as aliases for position_x and position_y
  y?: number;
}

export interface MockupWithColors extends Mockup {
  colors: MockupColor[];
  print_areas?: PrintArea[];
  svg_front_url: string;
  svg_back_url?: string;
  price_a3: number;
  price_a4: number;
  price_a5: number;
  price_a6: number;
  text_price_front: number;
  text_price_back: number;
}
