
import { Product, Lottery, Mockup, Design } from '@/types/supabase.types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase.config';
import { createClient } from '@supabase/supabase-js';
import { MockupColor, MockupWithColors } from '@/types/mockup.types';

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

// Function to fetch featured lotteries
export const fetchFeaturedLotteries = async (): Promise<Lottery[]> => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true);

    if (error) {
      console.error("Error fetching featured lotteries:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch featured lotteries:", error);
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

// Function to fetch designs (alias for fetchAllDesigns)
export const fetchDesigns = fetchAllDesigns;

// Function to create a new design
export const createDesign = async (design: Omit<Design, 'id'>): Promise<Design | null> => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .insert([design])
      .select('*')
      .single();

    if (error) {
      console.error("Error creating design:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to create design:", error);
    return null;
  }
};

// Function to update a design
export const updateDesign = async (id: string, updates: Partial<Design>): Promise<Design | null> => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating design with ID ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Failed to update design with ID ${id}:`, error);
    return null;
  }
};

// Function to delete a design
export const deleteDesign = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('designs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting design with ID ${id}:`, error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`Failed to delete design with ID ${id}:`, error);
    return false;
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

// Function to create a new product
export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select('*')
      .single();

    if (error) {
      console.error("Error creating product:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to create product:", error);
    return null;
  }
};

// Function to update a product
export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Failed to update product with ID ${id}:`, error);
    return null;
  }
};

// Function to delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`Failed to delete product with ID ${id}:`, error);
    return false;
  }
};

// Function to create a new mockup
export const createMockup = async (mockup: Omit<Mockup, 'id'>): Promise<Mockup | null> => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .insert([mockup])
      .select('*')
      .single();

    if (error) {
      console.error("Error creating mockup:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to create mockup:", error);
    return null;
  }
};

// Function to update a mockup
export const updateMockup = async (id: string, updates: Partial<Mockup>): Promise<Mockup | null> => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating mockup with ID ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Failed to update mockup with ID ${id}:`, error);
    return null;
  }
};

// Upload file to storage
export const uploadFileToStorage = async (file: File, folder: string = 'uploads') => {
  try {
    const uniqueFileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const filePath = `${folder}/${uniqueFileName}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('public')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
    
    // Get public URL for the file
    const { data: { publicUrl } } = supabase
      .storage
      .from('public')
      .getPublicUrl(filePath);
    
    return {
      path: filePath,
      url: publicUrl,
      size: file.size
    };
  } catch (error) {
    console.error("Failed to upload file:", error);
    throw error;
  }
};

// Function to create mockup colors
export const createMockupColors = async (
  mockupId: string,
  colors: Omit<MockupColor, 'id'>[]
): Promise<MockupColor[] | null> => {
  // In a real implementation, you would save these to a database
  // For now, just return the input with generated IDs
  try {
    const colorsWithIds = colors.map(color => ({
      ...color,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }));
    
    // TODO: Implement proper storage in database
    
    return colorsWithIds;
  } catch (error) {
    console.error("Failed to create mockup colors:", error);
    return null;
  }
};

// Function to fetch mockup with all its colors
export const fetchMockupWithColors = async (id: string): Promise<MockupWithColors | null> => {
  try {
    const mockup = await fetchMockupById(id);
    
    if (!mockup) {
      return null;
    }
    
    // TODO: Fetch colors from database in a real implementation
    // For now, return mockup with empty colors array
    
    return {
      ...mockup,
      colors: []
    };
  } catch (error) {
    console.error(`Failed to fetch mockup with colors for ID ${id}:`, error);
    return null;
  }
};
