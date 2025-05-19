
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

export interface MockupWithColors extends Omit<Mockup, 'colors' | 'print_areas'> {
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

// Define a type for handling JSON data from the API
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// Define a type for handling JSON to MockupColor conversion
export function convertJsonToMockupColors(json: Json | null): MockupColor[] {
  if (!json) return [];
  
  try {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    if (!Array.isArray(data)) return [];
    
    return data.map((item: any) => ({
      id: item.id || undefined,
      name: item.name || '',
      color_code: item.color_code || '#000000',
      front_image_url: item.front_image_url || '',
      back_image_url: item.back_image_url || ''
    }));
  } catch (e) {
    console.error('Error parsing mockup colors:', e);
    return [];
  }
}

// Define a type for handling JSON to PrintArea conversion
export function convertJsonToPrintAreas(json: Json | null): PrintArea[] {
  if (!json) return [];
  
  try {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    if (!Array.isArray(data)) return [];
    
    return data.map((item: any) => ({
      id: item.id || `${Date.now()}`,
      name: item.name || '',
      width: Number(item.width) || 0,
      height: Number(item.height) || 0,
      position_x: Number(item.position_x || item.x) || 0,
      position_y: Number(item.position_y || item.y) || 0,
      side: (item.side === 'back' ? 'back' : 'front') as 'front' | 'back',
      x: Number(item.position_x || item.x) || 0,
      y: Number(item.position_y || item.y) || 0
    }));
  } catch (e) {
    console.error('Error parsing print areas:', e);
    return [];
  }
}
