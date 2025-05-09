import { supabase } from "@/integrations/supabase/client";
import { Product, Lottery, Design, Mockup, PrintArea } from "@/types/supabase.types";

export const fetchFeaturedLotteries = async (): Promise<Lottery[]> => {
  try {
    console.log("Fetching featured lotteries...");
    const { data, error } = await supabase
      .from("lotteries")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching featured lotteries:", error);
      throw error;
    }

    console.log("Fetched featured lotteries:", data);
    return data || [];
  } catch (err) {
    console.error("Exception while fetching featured lotteries:", err);
    throw err;
  }
};

export const fetchProductsByCategory = async (category?: string): Promise<Product[]> => {
  try {
    console.log(`Fetching products by category: ${category || 'all'}`);
    let query = supabase.from("products").select("*");
    
    if (category) {
      query = query.eq("category", category);
    }

    // Add filter for active products
    query = query.eq("is_active", true);

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }

    console.log(`Fetched ${data?.length || 0} products by category:`, data);
    return data || [];
  } catch (err) {
    console.error("Exception while fetching products by category:", err);
    throw err;
  }
};

export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    console.log("Fetching all products...");
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }

    console.log(`Fetched ${data?.length || 0} products:`, data);
    return data || [];
  } catch (err) {
    console.error("Exception while fetching all products:", err);
    throw err;
  }
};

export const fetchAllLotteries = async (): Promise<Lottery[]> => {
  try {
    console.log("Fetching all lotteries...");
    const { data, error } = await supabase
      .from("lotteries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all lotteries:", error);
      throw error;
    }

    console.log(`Fetched ${data?.length || 0} lotteries:`, data);
    return data || [];
  } catch (err) {
    console.error("Exception while fetching all lotteries:", err);
    throw err;
  }
};

export const fetchDesigns = async (): Promise<Design[]> => {
  try {
    console.log("Fetching designs...");
    const { data, error } = await supabase
      .from("designs")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching designs:", error);
      throw error;
    }

    console.log(`Fetched ${data?.length || 0} designs:`, data);
    return data || [];
  } catch (err) {
    console.error("Exception while fetching designs:", err);
    throw err;
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    console.log(`Fetching product with id: ${id}`);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      throw error;
    }

    console.log("Fetched product by id:", data);
    return data;
  } catch (err) {
    console.error("Exception while fetching product by id:", err);
    return null;
  }
};

export const fetchLotteryById = async (id: string): Promise<Lottery | null> => {
  try {
    console.log(`Fetching lottery with id: ${id}`);
    const { data, error } = await supabase
      .from("lotteries")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching lottery:", error);
      throw error;
    }

    console.log("Fetched lottery by id:", data);
    return data;
  } catch (err) {
    console.error("Exception while fetching lottery by id:", err);
    return null;
  }
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
  try {
    console.log("Creating new product:", product);
    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      throw error;
    }

    console.log("Created product:", data);
    return data;
  } catch (err) {
    console.error("Exception while creating product:", err);
    throw err;
  }
};

export const createLottery = async (lottery: Omit<Lottery, 'id' | 'created_at' | 'updated_at'>): Promise<Lottery> => {
  try {
    console.log("Creating new lottery:", lottery);
    const { data, error } = await supabase
      .from("lotteries")
      .insert([lottery])
      .select()
      .single();

    if (error) {
      console.error("Error creating lottery:", error);
      throw error;
    }

    console.log("Created lottery:", data);
    return data;
  } catch (err) {
    console.error("Exception while creating lottery:", err);
    throw err;
  }
};

// Nouvelles fonctions pour les mockups
export const fetchAllMockups = async (): Promise<Mockup[]> => {
  try {
    console.log("Fetching all mockups...");
    const { data, error } = await supabase
      .from("mockups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all mockups:", error);
      throw error;
    }

    // Ensure print_areas is properly converted to PrintArea[]
    const mockups = data.map(mockup => ({
      ...mockup,
      print_areas: Array.isArray(mockup.print_areas) ? mockup.print_areas : []
    })) as Mockup[];

    console.log(`Fetched ${mockups.length || 0} mockups:`, mockups);
    return mockups;
  } catch (err) {
    console.error("Exception while fetching all mockups:", err);
    throw err;
  }
};

export const fetchMockupById = async (id: string): Promise<Mockup | null> => {
  try {
    console.log(`Fetching mockup with id: ${id}`);
    const { data, error } = await supabase
      .from("mockups")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching mockup:", error);
      throw error;
    }

    // Ensure print_areas is properly converted to PrintArea[]
    const mockup = {
      ...data,
      print_areas: Array.isArray(data.print_areas) ? data.print_areas : []
    } as Mockup;

    console.log("Fetched mockup by id:", mockup);
    return mockup;
  } catch (err) {
    console.error("Exception while fetching mockup by id:", err);
    return null;
  }
};

export const createMockup = async (mockup: Omit<Mockup, 'id' | 'created_at' | 'updated_at'>): Promise<Mockup> => {
  try {
    console.log("Creating new mockup:", mockup);
    const { data, error } = await supabase
      .from("mockups")
      .insert([mockup])
      .select()
      .single();

    if (error) {
      console.error("Error creating mockup:", error);
      throw error;
    }

    // Ensure print_areas is properly converted to PrintArea[]
    const createdMockup = {
      ...data,
      print_areas: Array.isArray(data.print_areas) ? data.print_areas : []
    } as Mockup;

    console.log("Created mockup:", createdMockup);
    return createdMockup;
  } catch (err) {
    console.error("Exception while creating mockup:", err);
    throw err;
  }
};

export const updateMockup = async (id: string, mockup: Partial<Mockup>): Promise<Mockup> => {
  try {
    console.log(`Updating mockup with id: ${id}`, mockup);
    const { data, error } = await supabase
      .from("mockups")
      .update(mockup)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating mockup:", error);
      throw error;
    }

    // Ensure print_areas is properly converted to PrintArea[]
    const updatedMockup = {
      ...data,
      print_areas: Array.isArray(data.print_areas) ? data.print_areas : []
    } as Mockup;

    console.log("Updated mockup:", updatedMockup);
    return updatedMockup;
  } catch (err) {
    console.error("Exception while updating mockup:", err);
    throw err;
  }
};

export const deleteMockup = async (id: string): Promise<void> => {
  try {
    console.log(`Deleting mockup with id: ${id}`);
    const { error } = await supabase
      .from("mockups")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting mockup:", error);
      throw error;
    }

    console.log("Deleted mockup with id:", id);
  } catch (err) {
    console.error("Exception while deleting mockup:", err);
    throw err;
  }
};
