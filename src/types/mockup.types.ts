
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
  // Allow both naming conventions
  x?: number; 
  y?: number;
}

export interface MockupWithColors extends Mockup {
  colors: MockupColor[];
  print_areas: PrintArea[];
  price_a3: number;
  price_a4: number;
  price_a5: number;
  price_a6: number;
  text_price_front: number;
  text_price_back: number;
  svg_front_url: string;
  svg_back_url?: string;
}

export interface NormalizedMockup extends MockupWithColors {
  id: string;
  name: string;
  category: string;
  is_active: boolean;
}
