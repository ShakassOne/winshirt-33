
import { supabase } from "@/integrations/supabase/client";
import { Design, Lottery, Mockup, Product } from "@/types/supabase.types";

const DESIGNS_TABLE = "designs";
const PRODUCTS_TABLE = "products";
const LOTTERIES_TABLE = "lotteries";
const MOCKUPS_TABLE = "mockups";

export const fetchAllProducts = async () => {
  console.log('Fetching all products...');
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }
    
    console.log('Fetched', data.length, 'products:', data);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
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
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

export const createProduct = async (productData: any) => {
  console.log('Creating product:', productData);
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId: string) => {
  console.log('Deleting product:', productId);
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const updateProduct = async (productId: string, productData: any) => {
  console.log('Updating product:', productId, productData);
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const fetchAllLotteries = async () => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .order('draw_date', { ascending: true });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching lotteries:', error);
    throw error;
  }
};

export const fetchFeaturedLotteries = async () => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .eq('is_featured', true)
      .order('draw_date', { ascending: true });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching featured lotteries:', error);
    throw error;
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
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching lottery by ID:', error);
    throw error;
  }
};

export const createLottery = async (lotteryData: any) => {
  console.log('Creating lottery:', lotteryData);
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .insert([lotteryData])
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error creating lottery:', error);
    throw error;
  }
};

export const updateLottery = async (lotteryId: string, lotteryData: any) => {
  console.log('Updating lottery:', lotteryId, lotteryData);
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .update(lotteryData)
      .eq('id', lotteryId)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error updating lottery:', error);
    throw error;
  }
};

export const deleteLottery = async (lotteryId: string) => {
  console.log('Deleting lottery:', lotteryId);
  try {
    const { error } = await supabase
      .from('lotteries')
      .delete()
      .eq('id', lotteryId);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting lottery:', error);
    throw error;
  }
};

export const fetchDesigns = async () => {
    try {
        const { data, error } = await supabase
            .from(DESIGNS_TABLE)
            .select('*');

        if (error) {
            throw new Error(error.message);
        }

        return data;
    } catch (error) {
        console.error("Error fetching designs:", error);
        throw error;
    }
};

export const fetchAllMockups = async () => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Convert print_areas from JSON to proper array
    const mockupsWithParsedAreas = data.map(mockup => ({
      ...mockup,
      print_areas: Array.isArray(mockup.print_areas) 
        ? mockup.print_areas 
        : JSON.parse(mockup.print_areas || '[]')
    }));
    
    return mockupsWithParsedAreas;
  } catch (error) {
    console.error('Error fetching mockups:', error);
    throw error;
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
      throw new Error(error.message);
    }
    
    // Convert print_areas from JSON to proper array
    return {
      ...data,
      print_areas: Array.isArray(data.print_areas) 
        ? data.print_areas 
        : JSON.parse(data.print_areas || '[]')
    };
  } catch (error) {
    console.error('Error fetching mockup:', error);
    throw error;
  }
};

export const createMockup = async (mockupData: Omit<Mockup, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    // Ensure print_areas is properly stringified if it's an array
    const dataToInsert = {
      ...mockupData,
      print_areas: Array.isArray(mockupData.print_areas) 
        ? JSON.stringify(mockupData.print_areas) 
        : mockupData.print_areas
    };
    
    const { data, error } = await supabase
      .from('mockups')
      .insert([dataToInsert])
      .select();
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Convert print_areas back to array in the returned data
    const mockupWithParsedArea = {
      ...data[0],
      print_areas: Array.isArray(data[0].print_areas) 
        ? data[0].print_areas 
        : JSON.parse(data[0].print_areas || '[]')
    };
    
    return mockupWithParsedArea;
  } catch (error) {
    console.error('Error creating mockup:', error);
    throw error;
  }
};

export const updateMockup = async (id: string, mockupData: Partial<Mockup>) => {
  try {
    // Ensure print_areas is properly stringified if it's an array
    const dataToUpdate = {
      ...mockupData,
      print_areas: Array.isArray(mockupData.print_areas) 
        ? JSON.stringify(mockupData.print_areas) 
        : mockupData.print_areas
    };
    
    const { data, error } = await supabase
      .from('mockups')
      .update(dataToUpdate)
      .eq('id', id)
      .select();
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Convert print_areas back to array in the returned data
    const mockupWithParsedArea = {
      ...data[0],
      print_areas: Array.isArray(data[0].print_areas) 
        ? data[0].print_areas 
        : JSON.parse(data[0].print_areas || '[]')
    };
    
    return mockupWithParsedArea;
  } catch (error) {
    console.error('Error updating mockup:', error);
    throw error;
  }
};

export const deleteMockup = async (id: string) => {
  try {
    const { error } = await supabase
      .from('mockups')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting mockup:', error);
    throw error;
  }
};
