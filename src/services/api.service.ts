import { supabase } from '@/integrations/supabase/client';
import { Product, Lottery, Mockup } from '@/types/supabase.types';
import { MockupWithColors } from '@/types/mockup.types';
import { uploadFileToStorage } from '@/lib/utils';

// Re-export the upload utility to maintain compatibility
export { uploadFileToStorage };

// Products
export const fetchAllProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching products:', error);
    return [];
  }
};

export const fetchActiveProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching active products:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching active products:', error);
    return [];
  }
};

export const fetchProductById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Unexpected error fetching product with id ${id}:`, error);
    return null;
  }
};

export const createProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    if (error) {
      console.error('Error creating product:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error creating product:', error);
    return null;
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error(`Error updating product with id ${id}:`, error);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Unexpected error updating product with id ${id}:`, error);
    return null;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Unexpected error deleting product with id ${id}:`, error);
    return false;
  }
};

// Designs
export const fetchAllDesigns = async () => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching designs:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching designs:', error);
    return [];
  }
};

export const fetchActiveDesigns = async () => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching active designs:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching active designs:', error);
    return [];
  }
};

export const fetchDesignById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error(`Error fetching design with id ${id}:`, error);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Unexpected error fetching design with id ${id}:`, error);
    return null;
  }
};

export const createDesign = async (design: Omit<Product, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .insert([design])
      .select()
      .single();
    if (error) {
      console.error('Error creating design:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error creating design:', error);
    return null;
  }
};

export const updateDesign = async (id: string, updates: Partial<Product>) => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error(`Error updating design with id ${id}:`, error);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Unexpected error updating design with id ${id}:`, error);
    return null;
  }
};

export const deleteDesign = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .delete()
      .eq('id', id);
    if (error) {
      console.error(`Error deleting design with id ${id}:`, error);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Unexpected error deleting design with id ${id}:`, error);
    return false;
  }
};

// Lotteries
export const fetchAllLotteries = async () => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching lotteries:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching lotteries:', error);
    return [];
  }
};

export const fetchLotteryById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error(`Error fetching lottery with id ${id}:`, error);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Unexpected error fetching lottery with id ${id}:`, error);
    return null;
  }
};

export const createLottery = async (lottery: Omit<Lottery, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .insert([lottery])
      .select()
      .single();
    if (error) {
      console.error('Error creating lottery:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error creating lottery:', error);
    return null;
  }
};

export const updateLottery = async (id: string, updates: Partial<Lottery>) => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error(`Error updating lottery with id ${id}:`, error);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Unexpected error updating lottery with id ${id}:`, error);
    return null;
  }
};

export const deleteLottery = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .delete()
      .eq('id', id);
    if (error) {
      console.error(`Error deleting lottery with id ${id}:`, error);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Unexpected error deleting lottery with id ${id}:`, error);
    return false;
  }
};

// Mockups
export const fetchAllMockups = async () => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching mockups:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching mockups:', error);
    return [];
  }
};

export const fetchMockupById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error(`Error fetching mockup with id ${id}:`, error);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Unexpected error fetching mockup with id ${id}:`, error);
    return null;
  }
};

export const createMockup = async (mockup: Omit<Mockup, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .insert([mockup])
      .select()
      .single();
    if (error) {
      console.error('Error creating mockup:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error creating mockup:', error);
    return null;
  }
};

export const updateMockup = async (id: string, updates: Partial<Mockup>) => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error(`Error updating mockup with id ${id}:`, error);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Unexpected error updating mockup with id ${id}:`, error);
    return null;
  }
};

export const deleteMockup = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .delete()
      .eq('id', id);
    if (error) {
      console.error(`Error deleting mockup with id ${id}:`, error);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Unexpected error deleting mockup with id ${id}:`, error);
    return false;
  }
};

export const fetchMockupWithColorsById = async (id: string) => {
  try {
    const { data, error } = await supabase.from('mockups').select('*').eq('id', id).single();
    if (error) {
      console.error(`Error fetching mockup with id ${id}:`, error);
      return null;
    }
    if (!data) {
      return null;
    }
    // Ensure print_areas is handled correctly
    const printAreas = data.print_areas ? typeof data.print_areas === 'string' ? JSON.parse(data.print_areas) : data.print_areas : [];
    return {
      ...data,
      print_areas: printAreas
    } as MockupWithColors;
  } catch (error) {
    console.error(`Unexpected error fetching mockup with id ${id}:`, error);
    return null;
  }
};

export const updateMockupWithColors = async (id: string, updates: Partial<MockupWithColors>) => {
  try {
    // Ensure print_areas is handled correctly before updating
    const printAreas = updates.print_areas ? typeof updates.print_areas === 'string' ? JSON.parse(updates.print_areas) : updates.print_areas : [];
    const { data, error } = await supabase.from('mockups').update({
      ...updates,
      print_areas: printAreas
    } as any) // Use type assertion here to avoid TypeScript error
      .eq('id', id).select().single();
    if (error) {
      console.error(`Error updating mockup with id ${id}:`, error);
      return null;
    }
    return {
      ...data,
      print_areas: printAreas
    } as MockupWithColors;
  } catch (error) {
    console.error(`Unexpected error updating mockup with id ${id}:`, error);
    return null;
  }
};
