
// Mockup color variants type
import { Database } from '@/integrations/supabase/types';

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

// Use the base Mockup type from Supabase
export type BaseMockup = Database['public']['Tables']['mockups']['Row'];

// Create a specialized type for working with mockups that properly handles colors
export interface MockupWithColors extends Omit<BaseMockup, 'colors'> {
  colors: MockupColor[];
}
