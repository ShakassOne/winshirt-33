
export interface MockupColor {
  id?: string;
  name: string;
  color_code: string;
  hex_code: string;
  front_image_url: string;
  back_image_url: string;
}

export interface MockupWithColors {
  id: string;
  name: string;
  category: string;
  svg_front_url: string;
  svg_back_url?: string;
  price_a3: number;
  price_a4: number;
  price_a5: number;
  price_a6: number;
  text_price_front: number;
  text_price_back: number;
  print_areas: any[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  colors: MockupColor[];
  has_back_side?: boolean;
}
