import { Product, Lottery, Mockup } from '@/types/supabase.types';
import { MockupWithColors } from '@/types/mockup.types';
import { supabase } from '@/integrations/supabase/client';

// Products
export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching products:", error);
    return [];
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
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

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Unexpected error creating product:", error);
    return null;
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
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

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
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

// Lotteries
export const fetchAllLotteries = async (): Promise<Lottery[]> => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error("Error fetching lotteries:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching lotteries:", error);
    return [];
  }
};

export const fetchLotteryById = async (id: string): Promise<Lottery | null> => {
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

export const createLottery = async (lottery: Omit<Lottery, 'id'>): Promise<Lottery | null> => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .insert([lottery])
      .select()
      .single();

    if (error) {
      console.error("Error creating lottery:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Unexpected error creating lottery:", error);
    return null;
  }
};

export const updateLottery = async (id: string, updates: Partial<Lottery>): Promise<Lottery | null> => {
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

export const deleteLottery = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
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
export const fetchAllMockups = async (): Promise<Mockup[]> => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error("Error fetching mockups:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching mockups:", error);
    return [];
  }
};

export const fetchMockupById = async (id: string): Promise<Mockup | null> => {
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

export const createMockup = async (mockup: Omit<Mockup, 'id'>): Promise<Mockup | null> => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .insert([mockup])
      .select()
      .single();

    if (error) {
      console.error("Error creating mockup:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Unexpected error creating mockup:", error);
    return null;
  }
};

export const updateMockup = async (id: string, updates: Partial<Mockup>): Promise<Mockup | null> => {
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

export const deleteMockup = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
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

export const uploadMockupImage = async (file: File, fileName: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('mockups')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.path}`;
    return imageUrl;
  } catch (error) {
    console.error("Unexpected error uploading image:", error);
    return null;
  }
};

export const updateMockupImage = async (file: File, fileName: string): Promise<string | null> => {
  try {
    // Delete the old image first
    const { data: listResult, error: listError } = await supabase.storage
      .from('mockups')
      .list('', { search: fileName });

    if (listError) {
      console.error("Error listing files:", listError);
      return null;
    }

    if (listResult && listResult.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from('mockups')
        .remove([`${listResult[0].name}`]);

      if (deleteError) {
        console.error("Error deleting old image:", deleteError);
        return null;
      }
    }

    // Upload the new image
    const { data, error } = await supabase.storage
      .from('mockups')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.path}`;
    return imageUrl;
  } catch (error) {
    console.error("Unexpected error uploading image:", error);
    return null;
  }
};

export const fetchMockupWithColorsById = async (id: string): Promise<MockupWithColors | null> => {
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

    if (!data) {
      return null;
    }

    // Ensure print_areas is handled correctly
    const printAreas = (data as any).print_areas ? 
      (typeof (data as any).print_areas === 'string' ? JSON.parse((data as any).print_areas) : (data as any).print_areas) 
      : [];

    return {
      ...data,
      print_areas: printAreas,
    } as MockupWithColors;
  } catch (error) {
    console.error(`Unexpected error fetching mockup with id ${id}:`, error);
    return null;
  }
};

export const updateMockupWithColors = async (id: string, updates: Partial<MockupWithColors>): Promise<MockupWithColors | null> => {
  try {
    // Ensure print_areas is handled correctly before updating
    const printAreas = (updates as any).print_areas ? 
      (typeof (updates as any).print_areas === 'string' ? JSON.parse(updates.print_areas) : updates.print_areas) 
      : [];

    const { data, error } = await supabase
      .from('mockups')
      .update({ ...updates, print_areas: printAreas }) // Update with the processed print_areas
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating mockup with id ${id}:`, error);
      return null;
    }

    return {
      ...data,
      print_areas: printAreas,
    } as MockupWithColors;
  } catch (error) {
    console.error(`Unexpected error updating mockup with id ${id}:`, error);
    return null;
  }
};
