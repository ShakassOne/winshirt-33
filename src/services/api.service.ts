import { supabase } from "@/integrations/supabase/client";

export const fetchAllProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      throw error;
    }
    
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
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

export const createProduct = async (productData: any) => {
  try {
    // Make sure to include images array if provided
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image_url: productData.image_url,
        images: productData.images || [], // Add images array
        category: productData.category,
        is_customizable: productData.is_customizable,
        is_active: productData.is_active || true,
        tickets_offered: productData.tickets_offered || 0,
        color: productData.color,
        available_colors: productData.available_colors,
        available_sizes: productData.available_sizes,
        mockup_id: productData.mockup_id
      }])
      .select();
    
    if (error) {
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: any) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image_url: productData.image_url,
        images: productData.images || [], // Add images array
        category: productData.category,
        is_customizable: productData.is_customizable,
        is_active: productData.is_active,
        tickets_offered: productData.tickets_offered,
        color: productData.color,
        available_colors: productData.available_colors,
        available_sizes: productData.available_sizes,
        mockup_id: productData.mockup_id
      })
      .eq('id', id)
      .select();
    
    if (error) {
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const fetchAllDesigns = async () => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching designs:', error);
    throw error;
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
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching design by ID:', error);
    throw error;
  }
};

export const createDesign = async (designData: any) => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .insert([designData])
      .select();
    
    if (error) {
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error('Error creating design:', error);
    throw error;
  }
};

export const updateDesign = async (id: string, designData: any) => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .update(designData)
      .eq('id', id)
      .select();
    
    if (error) {
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error('Error updating design:', error);
    throw error;
  }
};

export const deleteDesign = async (id: string) => {
  try {
    const { error } = await supabase
      .from('designs')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting design:', error);
    throw error;
  }
};

export const fetchAllMockups = async () => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    return data;
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
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching mockup by ID:', error);
    throw error;
  }
};

export const createMockup = async (mockupData: any) => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .insert([mockupData])
      .select();
    
    if (error) {
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error('Error creating mockup:', error);
    throw error;
  }
};

export const updateMockup = async (id: string, mockupData: any) => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .update(mockupData)
      .eq('id', id)
      .select();
    
    if (error) {
      throw error;
    }
    
    return data[0];
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
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting mockup:', error);
    throw error;
  }
};

export const uploadFileToStorage = async (file: File, targetFolder: string) => {
  try {
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = `${targetFolder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('winshirt-bucket')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.path}`;
    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
