
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

// Mockup
export interface PrintArea {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  side: 'front' | 'back';  // Added this property
}

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
    designId: string;
    designName?: string;
    designUrl: string;
    printPosition: 'front' | 'back';
    printSize: string;
    transform?: {
      position: { x: number; y: number };
      scale: number;
      rotation: number;
    };
    text?: {
      content: string;
      font: string;
      color: string;
      printPosition: 'front' | 'back';
      transform?: {
        position: { x: number; y: number };
        scale: number;
        rotation: number;
      };
    };
  };
  lotteries?: string[];
}
