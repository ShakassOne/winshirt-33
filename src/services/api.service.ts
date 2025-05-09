
import { supabase } from "@/integrations/supabase/client";
import { Product, Lottery, Design } from "@/types/supabase.types";

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

// Nouvelle fonction pour créer un produit
export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
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

// Nouvelle fonction pour créer une loterie
export const createLottery = async (lottery: Omit<Lottery, 'id' | 'created_at' | 'updated_at'>): Promise<Lottery | null> => {
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
