
// Mockup color variants type
import { Mockup as BaseMockup } from '@/types/supabase.types';

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

export interface MockupWithColors extends BaseMockup {
  colors: MockupColor[];
  has_back_side?: boolean; // Add this property
}
