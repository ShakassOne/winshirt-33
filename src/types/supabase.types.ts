
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_customizable: boolean;
  created_at: string;
  updated_at: string;
  color: string | null;
  available_colors: string[];
  available_sizes: string[];
  tickets_offered: number;
  is_active: boolean;
  mockup_id: string | null;
};

export type Lottery = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  value: number;
  participants: number;
  goal: number;
  is_active: boolean;
  is_featured: boolean;
  draw_date: string;
  created_at: string;
  updated_at: string;
};

export type Design = {
  id: string;
  name: string;
  image_url: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  address: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type PrintArea = {
  id: string;
  name: string;
  side: 'front' | 'back';
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Mockup = {
  id: string;
  name: string;
  category: string;
  svg_front_url: string;
  svg_back_url: string | null;
  print_areas: PrintArea[];
  price_a3: number;
  price_a4: number;
  price_a5: number;
  price_a6: number;
  text_price_front: number;
  text_price_back: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  id?: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color?: string | null;
  size?: string | null;
  customization?: {
    designId?: string | null;
    designName?: string | null;
    designUrl?: string | null;
    printPosition?: 'front' | 'back';
    printSize?: 'a3' | 'a4' | 'a5' | 'a6';
  };
  lotteries?: string[];
  image_url?: string;
};
