
// Mockup color variants type
import { Mockup, PrintArea as BasePrintArea } from '@/types/supabase.types';

export interface MockupColor {
  id?: string;
  name: string;
  color_code: string;
  front_image_url: string;
  back_image_url: string;
}

export interface PrintArea extends BasePrintArea {
  x?: number; // Add x and y as aliases for position_x and position_y
  y?: number;
}

export interface MockupWithColors extends Mockup {
  colors: MockupColor[];
}
