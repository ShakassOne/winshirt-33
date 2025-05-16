import { supabase } from "@/integrations/supabase/client";
import { Design, Lottery, Mockup, Product } from "@/types/supabase.types";

// Function to fetch all designs
export const fetchAllDesigns = async (): Promise<Design[]> => {
  try {
    const { data: designs, error } = await supabase
      .from('designs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    return designs || [];
  } catch (error) {
    console.error("Error fetching designs:", error);
    throw error;
  }
};

// Function to fetch a single design by ID
export const fetchDesignById = async (id: string): Promise<Design | null> => {
  try {
    const { data: design, error } = await supabase
      .from('designs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching design by ID:", error);
      return null;
    }
    return design;
  } catch (error) {
    console.error("Error fetching design by ID:", error);
    return null;
  }
};

// Function to create a new design
export const createDesign = async (design: Omit<Design, 'id' | 'created_at' | 'updated_at'>): Promise<Design | null> => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .insert([design])
      .select()
      .single();

    if (error) {
      console.error("Error creating design:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error creating design:", error);
    return null;
  }
};

// Function to update an existing design
export const updateDesign = async (id: string, updates: Partial<Design>): Promise<Design | null> => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating design:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error updating design:", error);
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
      console.error("Error deleting design:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting design:", error);
    return false;
  }
};

// Function to fetch all mockups
export const fetchAllMockups = async (): Promise<Mockup[]> => {
  try {
    const { data: mockups, error } = await supabase
      .from('mockups')
      .select('*, colors(*)')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    return mockups || [];
  } catch (error) {
    console.error("Error fetching mockups:", error);
    throw error;
  }
};

// Function to fetch a single mockup by ID
export const fetchMockupById = async (id: string): Promise<Mockup | null> => {
  try {
    const { data: mockup, error } = await supabase
      .from('mockups')
      .select('*, colors(*), print_areas(*)')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching mockup by ID:", error);
      return null;
    }
    return mockup;
  } catch (error) {
    console.error("Error fetching mockup by ID:", error);
    return null;
  }
};

// Function to create a new mockup
export const createMockup = async (mockup: Omit<Mockup, 'id' | 'created_at' | 'updated_at'>): Promise<Mockup | null> => {
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
    console.error("Error creating mockup:", error);
    return null;
  }
};

// Function to update an existing mockup
export const updateMockup = async (id: string, updates: Partial<Mockup>): Promise<Mockup | null> => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating mockup:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error updating mockup:", error);
    return null;
  }
};

// Function to delete a mockup
export const deleteMockup = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('mockups')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting mockup:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting mockup:", error);
    return false;
  }
};

// Function to fetch all products
export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    return products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Function to fetch a single product by ID
export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching product by ID:", error);
      return null;
    }
    return product;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

// Function to create a new product
export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
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
    console.error("Error creating product:", error);
    return null;
  }
};

// Function to update an existing product
export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
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
      console.error("Error deleting product:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
};

// Function to fetch all lotteries
export const fetchAllLotteries = async (): Promise<Lottery[]> => {
  try {
    const { data: lotteries, error } = await supabase
      .from('lotteries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    return lotteries || [];
  } catch (error) {
    console.error("Error fetching lotteries:", error);
    throw error;
  }
};

// Function to fetch a single lottery by ID
export const fetchLotteryById = async (id: string): Promise<Lottery | null> => {
  try {
    const { data: lottery, error } = await supabase
      .from('lotteries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching lottery by ID:", error);
      return null;
    }
    return lottery;
  } catch (error) {
    console.error("Error fetching lottery by ID:", error);
    return null;
  }
};

// Function to create a new lottery
export const createLottery = async (lottery: Omit<Lottery, 'id' | 'created_at' | 'updated_at'>): Promise<Lottery | null> => {
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
    console.error("Error creating lottery:", error);
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
      .select()
      .single();

    if (error) {
      console.error("Error updating lottery:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error updating lottery:", error);
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
      console.error("Error deleting lottery:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting lottery:", error);
    return false;
  }
};

// Fonction pour récupérer les participants à une loterie
export const getLotteryEntries = async (lotteryId: string) => {
  try {
    const { data, error } = await supabase
      .from('lottery_entries')
      .select('*')
      .eq('lottery_id', lotteryId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching lottery entries:', error);
    throw error;
  }
};

// Fonction pour définir le gagnant d'une loterie
export const setLotteryWinner = async (lotteryId: string, entryId: string) => {
  try {
    // Get the entry details
    const { data: entry, error: entryError } = await supabase
      .from('lottery_entries')
      .select('*')
      .eq('id', entryId)
      .single();
    
    if (entryError) throw entryError;
    
    // Create winner record
    const { error: winnerError } = await supabase
      .from('winners')
      .insert({
        lottery_id: lotteryId,
        user_id: entry.user_id,
        claimed: false
      });
    
    if (winnerError) throw winnerError;
    
    // Update lottery to inactive
    const { error: lotteryError } = await supabase
      .from('lotteries')
      .update({ is_active: false })
      .eq('id', lotteryId);
    
    if (lotteryError) throw lotteryError;
    
    return true;
  } catch (error) {
    console.error('Error setting lottery winner:', error);
    throw error;
  }
};
