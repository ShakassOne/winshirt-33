import { supabase } from '@/integrations/supabase/client';
import axios from 'axios';
import { Design, Mockup, Product } from '@/types/supabase.types';

export const fetchAllDesigns = async (): Promise<Design[]> => {
  console.log('Fetching all designs...');
  try {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching designs:', error);
      throw error;
    }

    console.log('Designs fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch designs:', error);
    return [];
  }
};

export const createDesign = async (designData: any): Promise<Design> => {
  console.log('Creating design:', designData);
  try {
    const { data, error } = await supabase
      .from('designs')
      .insert([designData])
      .select()
      .single();

    if (error) {
      console.error('Error creating design:', error);
      throw error;
    }

    console.log('Design created successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to create design:', error);
    throw error;
  }
};

export const updateDesign = async (id: string, designData: any): Promise<Design> => {
  console.log(`Updating design with id ${id}:`, designData);
  try {
    const { data, error } = await supabase
      .from('designs')
      .update(designData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating design with id ${id}:`, error);
      throw error;
    }

    console.log(`Design with id ${id} updated successfully:`, data);
    return data;
  } catch (error) {
    console.error(`Failed to update design with id ${id}:`, error);
    throw error;
  }
};

export const deleteDesign = async (id: string): Promise<void> => {
  console.log(`Deleting design with id ${id}`);
  try {
    const { error } = await supabase
      .from('designs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting design with id ${id}:`, error);
      throw error;
    }

    console.log(`Design with id ${id} deleted successfully`);
  } catch (error) {
    console.error(`Failed to delete design with id ${id}:`, error);
    throw error;
  }
};

export const fetchAllProducts = async (): Promise<Product[]> => {
  console.log('Fetching all products...');
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    console.log('Products fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
};

export const createProduct = async (productData: any): Promise<Product> => {
  console.log('Creating product:', productData);
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }

    console.log('Product created successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: any): Promise<Product> => {
  console.log(`Updating product with id ${id}:`, productData);
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw error;
    }

    console.log(`Product with id ${id} updated successfully:`, data);
    return data;
  } catch (error) {
    console.error(`Failed to update product with id ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  console.log(`Deleting product with id ${id}`);
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }

    console.log(`Product with id ${id} deleted successfully`);
  } catch (error) {
    console.error(`Failed to delete product with id ${id}:`, error);
    throw error;
  }
};

export const fetchAllMockups = async (): Promise<Mockup[]> => {
  console.log('Fetching all mockups...');
  try {
    const { data, error } = await supabase
      .from('mockups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching mockups:', error);
      throw error;
    }

    console.log('Mockups fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch mockups:', error);
    return [];
  }
};

export const createMockup = async (mockupData: any): Promise<Mockup> => {
  console.log('Creating mockup:', mockupData);
  try {
    const { data, error } = await supabase
      .from('mockups')
      .insert([mockupData])
      .select()
      .single();

    if (error) {
      console.error('Error creating mockup:', error);
      throw error;
    }

    console.log('Mockup created successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to create mockup:', error);
    throw error;
  }
};

export const updateMockup = async (id: string, mockupData: any): Promise<Mockup> => {
  console.log(`Updating mockup with id ${id}:`, mockupData);
  try {
    const { data, error } = await supabase
      .from('mockups')
      .update(mockupData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating mockup with id ${id}:`, error);
      throw error;
    }

    console.log(`Mockup with id ${id} updated successfully:`, data);
    return data;
  } catch (error) {
    console.error(`Failed to update mockup with id ${id}:`, error);
    throw error;
  }
};

export const deleteMockup = async (id: string): Promise<void> => {
  console.log(`Deleting mockup with id ${id}`);
  try {
    const { error } = await supabase
      .from('mockups')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting mockup with id ${id}:`, error);
      throw error;
    }

    console.log(`Mockup with id ${id} deleted successfully`);
  } catch (error) {
    console.error(`Failed to delete mockup with id ${id}:`, error);
    throw error;
  }
};

export const uploadToExternalScript = async (file: File): Promise<string> => {
  console.log('[API] Uploading to external script:', file.name);
  
  const formData = new FormData();
  formData.append('file', file); // ✅ Correction: utilise 'file' au lieu de 'image' pour matcher votre script PHP
  
  try {
    const response = await axios.post('https://winshirt.fr/upload-visuel.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 secondes timeout
    });
    
    if (response.data?.success && response.data?.url) {
      console.log('[API] External upload successful:', response.data.url);
      return response.data.url;
    } else {
      console.error('[API] External script error:', response.data);
      throw new Error(response.data?.error || 'Upload failed');
    }
  } catch (error) {
    console.error('Error uploading to external script:', error);
    throw error;
  }
};

export const uploadFileToStorage = async (file: File, folder: string = 'uploads'): Promise<string> => {
  console.log('[API] Uploading to Supabase storage:', file.name);
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  
  try {
    const { data, error } = await supabase.storage
      .from('public')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('[API] Supabase upload error:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('public')
      .getPublicUrl(fileName);

    console.log('[API] Supabase upload successful:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('[API] Error uploading to Supabase:', error);
    throw error;
  }
};
