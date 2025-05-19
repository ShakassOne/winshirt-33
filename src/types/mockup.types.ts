
import { Mockup } from '@/types/supabase.types';

export type MockupColor = {
  id: string;
  name: string;
  hex: string;
  product_image?: string;
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
