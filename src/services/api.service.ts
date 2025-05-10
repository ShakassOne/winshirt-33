import { Product, Lottery, Mockup, Design } from '@/types/supabase.types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase.config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to fetch all products
export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};

// Function to fetch a product by ID
export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}:`, error);
    return null;
  }
};

// Function to fetch all lotteries
export const fetchAllLotteries = async (): Promise<Lottery[]> => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*');

    if (error) {
      console.error("Error fetching lotteries:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch lotteries:", error);
    return [];
  }
};

// Function to fetch a lottery by ID
export const fetchLotteryById = async (id: string): Promise<Lottery | null> => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching lottery with ID ${id}:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Failed to fetch lottery with ID ${id}:`, error);
    return null;
  }
};

// Function to fetch all mockups
export const fetchAllMockups = async (): Promise<Mockup[]> => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .select('*');

    if (error) {
      console.error("Error fetching mockups:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch mockups:", error);
    return [];
  }
};

// Function to fetch a mockup by ID
export const fetchMockupById = async (id: string): Promise<Mockup | null> => {
    try {
      const { data, error } = await supabase
        .from('mockups')
        .select('*')
        .eq('id', id)
        .single();
  
      if (error) {
        console.error(`Error fetching mockup with ID ${id}:`, error);
        return null;
      }
  
      return data;
    } catch (error) {
      console.error(`Failed to fetch mockup with ID ${id}:`, error);
      return null;
    }
  };

// Function to fetch all designs
export const fetchAllDesigns = async (): Promise<Design[]> => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .select('*');

    if (error) {
      console.error("Error fetching designs:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch designs:", error);
    return [];
  }
};

// Function to create a new lottery
export const createLottery = async (lottery: Omit<Lottery, 'id'>): Promise<Lottery | null> => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .insert([lottery])
      .select('*')
      .single();

    if (error) {
      console.error("Error creating lottery:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to create lottery:", error);
    return null;
  }
};

// Function to update an existing lottery
export const updateLottery = async (id: string, updates: Partial<Lottery>): Promise<Lottery | null> => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating lottery with ID ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Failed to update lottery with ID ${id}:`, error);
    return null;
  }
};

// Function to delete a lottery
export const deleteLottery = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lotteries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting lottery with ID ${id}:`, error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`Failed to delete lottery with ID ${id}:`, error);
    return false;
  }
};

// Upload file to storage
export const uploadFileToStorage = async (file: File, folder: string = 'uploads') => {
  try {
    const uniqueFileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const filePath = `${folder}/${uniqueFileName}`;
    
    // Simulated upload function (replace with real Supabase upload when connected)
    console.log(`Uploading ${file.name} to ${filePath}`);
    
    // Simulate API response delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return simulated response
    return {
      path: filePath,
      url: `https://example.com/storage/${filePath}`,
      size: file.size
    };
  } catch (error) {
    console.error("Failed to upload file:", error);
    throw error;
  }
}
