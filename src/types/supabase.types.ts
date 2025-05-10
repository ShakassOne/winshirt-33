
// Design
export interface Design {
  id: string;
  name: string;
  image_url: string;
  category: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// PrintArea
export interface PrintArea {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  side: 'front' | 'back';
  // Add position_x and position_y as aliases for x and y
  position_x?: number;
  position_y?: number;
}

// Import the MockupColor type from mockup.types to resolve circular dependency
import { MockupColor } from '@/types/mockup.types';
// Re-export MockupColor as a type to solve the import error with isolatedModules
export type { MockupColor };

// Mockup
export interface Mockup {
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
  print_areas: PrintArea[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  colors?: MockupColor[]; // Add colors property for mockup color variants
  has_back_side?: boolean; // Adding has_back_side property
}

// Product
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_customizable: boolean;
  available_colors: string[];
  available_sizes: string[];
  color?: string;
  tickets_offered?: number;
  is_active?: boolean;
  mockup_id?: string;
  created_at?: string;
  updated_at?: string;
  is_new?: boolean; // Add is_new property
  details?: string; // Add details property
}

// Lottery
export interface Lottery {
  id: string;
  title: string;
  description: string;
  image_url: string;
  value: number;
  goal: number;
  participants: number;
  draw_date: string;
  is_active?: boolean;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
  color?: string;
  name?: string; // Added this property for compatibility
}

// Cart Item
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color?: string | null;
  size?: string | null;
  image_url: string;
  customization?: {
    frontDesign?: {
      designId: string;
      designName: string;
      designUrl: string;
      printSize: string;
      transform: {
        position: { x: number; y: number };
        scale: number;
        rotation: number;
      };
    };
    backDesign?: {
      designId: string;
      designName: string;
      designUrl: string;
      printSize: string;
      transform: {
        position: { x: number; y: number };
        scale: number;
        rotation: number;
      };
    };
    frontText?: {
      content: string;
      font: string;
      color: string;
      transform: {
        position: { x: number; y: number };
        scale: number;
        rotation: number;
      };
      styles: {
        bold: boolean;
        italic: boolean;
        underline: boolean;
      };
    };
    backText?: {
      content: string;
      font: string;
      color: string;
      transform: {
        position: { x: number; y: number };
        scale: number;
        rotation: number;
      };
      styles: {
        bold: boolean;
        italic: boolean;
        underline: boolean;
      };
    };
  };
  lotteries?: string[];
}
