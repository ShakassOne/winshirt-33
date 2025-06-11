import { supabase } from '@/integrations/supabase/client';
import axios from 'axios';
import { Design, Mockup, Product, Lottery, SocialNetwork } from '@/types/supabase.types';

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

export const fetchAllLotteries = async (): Promise<Lottery[]> => {
  console.log('Fetching all lotteries...');
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching lotteries:', error);
      throw error;
    }

    console.log('Lotteries fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch lotteries:', error);
    return [];
  }
};

export const fetchFeaturedLotteries = async (): Promise<Lottery[]> => {
  console.log('Fetching featured lotteries...');
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching featured lotteries:', error);
      throw error;
    }

    console.log('Featured lotteries fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch featured lotteries:', error);
    return [];
  }
};

export const fetchLotteryById = async (id: string): Promise<Lottery | null> => {
  console.log(`Fetching lottery with id ${id}...`);
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching lottery with id ${id}:`, error);
      throw error;
    }

    console.log(`Lottery with id ${id} fetched successfully:`, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch lottery with id ${id}:`, error);
    return null;
  }
};

export const createLottery = async (lotteryData: any): Promise<Lottery> => {
  console.log('Creating lottery:', lotteryData);
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .insert([lotteryData])
      .select()
      .single();

    if (error) {
      console.error('Error creating lottery:', error);
      throw error;
    }

    console.log('Lottery created successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to create lottery:', error);
    throw error;
  }
};

export const updateLottery = async (id: string, lotteryData: any): Promise<Lottery> => {
  console.log(`Updating lottery with id ${id}:`, lotteryData);
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .update(lotteryData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating lottery with id ${id}:`, error);
      throw error;
    }

    console.log(`Lottery with id ${id} updated successfully:`, data);
    return data;
  } catch (error) {
    console.error(`Failed to update lottery with id ${id}:`, error);
    throw error;
  }
};

export const deleteLottery = async (id: string): Promise<void> => {
  console.log(`Deleting lottery with id ${id}`);
  try {
    const { error } = await supabase
      .from('lotteries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting lottery with id ${id}:`, error);
      throw error;
    }

    console.log(`Lottery with id ${id} deleted successfully`);
  } catch (error) {
    console.error(`Failed to delete lottery with id ${id}:`, error);
    throw error;
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  console.log(`Fetching product with id ${id}...`);
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }

    console.log(`Product with id ${id} fetched successfully:`, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    return null;
  }
};

export const fetchMockupById = async (id: string): Promise<Mockup | null> => {
  console.log(`Fetching mockup with id ${id}...`);
  try {
    const { data, error } = await supabase
      .from('mockups')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching mockup with id ${id}:`, error);
      throw error;
    }

    console.log(`Mockup with id ${id} fetched successfully:`, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch mockup with id ${id}:`, error);
    return null;
  }
};

export const fetchProductsWithTickets = async (): Promise<Product[]> => {
  console.log('Fetching products with tickets...');
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .gt('tickets_offered', 0)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products with tickets:', error);
      throw error;
    }

    console.log('Products with tickets fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch products with tickets:', error);
    return [];
  }
};

export const fetchAllSocialNetworks = async (): Promise<SocialNetwork[]> => {
  console.log('Fetching all social networks...');
  try {
    const { data, error } = await supabase
      .from('social_networks')
      .select('*')
      .order('priority', { ascending: true });

    if (error) {
      console.error('Error fetching social networks:', error);
      throw error;
    }

    console.log('Social networks fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch social networks:', error);
    return [];
  }
};

export const fetchActiveSocialNetworks = async (): Promise<SocialNetwork[]> => {
  console.log('Fetching active social networks...');
  try {
    const { data, error } = await supabase
      .from('social_networks')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: true });

    if (error) {
      console.error('Error fetching active social networks:', error);
      throw error;
    }

    console.log('Active social networks fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch active social networks:', error);
    return [];
  }
};

export const createSocialNetwork = async (socialNetworkData: any): Promise<SocialNetwork> => {
  console.log('Creating social network:', socialNetworkData);
  try {
    const { data, error } = await supabase
      .from('social_networks')
      .insert([socialNetworkData])
      .select()
      .single();

    if (error) {
      console.error('Error creating social network:', error);
      throw error;
    }

    console.log('Social network created successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to create social network:', error);
    throw error;
  }
};

export const updateSocialNetwork = async (id: string, socialNetworkData: any): Promise<SocialNetwork> => {
  console.log(`Updating social network with id ${id}:`, socialNetworkData);
  try {
    const { data, error } = await supabase
      .from('social_networks')
      .update(socialNetworkData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating social network with id ${id}:`, error);
      throw error;
    }

    console.log(`Social network with id ${id} updated successfully:`, data);
    return data;
  } catch (error) {
    console.error(`Failed to update social network with id ${id}:`, error);
    throw error;
  }
};

export const deleteSocialNetwork = async (id: string): Promise<void> => {
  console.log(`Deleting social network with id ${id}`);
  try {
    const { error } = await supabase
      .from('social_networks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting social network with id ${id}:`, error);
      throw error;
    }

    console.log(`Social network with id ${id} deleted successfully`);
  } catch (error) {
    console.error(`Failed to delete social network with id ${id}:`, error);
    throw error;
  }
};

export const uploadToExternalScript = async (file: File): Promise<string> => {
  console.log('[API] Upload vers media.winshirt.fr/upload-visuel.php:', file.name);
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post('https://media.winshirt.fr/upload-visuel.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    
    console.log('[API] Réponse du script PHP:', response.data);
    
    if (response.data?.success === true && response.data?.url) {
      console.log('[API] Upload réussi vers media.winshirt.fr:', response.data.url);
      return response.data.url;
    } else {
      console.error('[API] Script PHP retourne success:false:', response.data);
      const errorMessage = response.data?.error || response.data?.message || 'Upload échoué sur le serveur';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('[API] Erreur lors de l\'upload vers media.winshirt.fr:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Timeout - le serveur met trop de temps à répondre');
      } else if (error.response?.status === 413) {
        throw new Error('Fichier trop volumineux');
      } else if (error.response?.status >= 500) {
        throw new Error('Erreur serveur - veuillez réessayer plus tard');
      }
    }
    
    throw new Error('Erreur de connexion au serveur d\'upload');
  }
};

// Suppression de uploadFileToStorage - plus utilisé
