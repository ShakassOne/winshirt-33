
import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';
import { Design } from '@/types/supabase.types';

const API_BASE_URL = 'https://media.winshirt.fr';

// Configuration axios avec timeout et retry
const apiClient = axios.create({
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});

// Intercepteur pour retry automatique
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    
    // Si c'est la première tentative et que c'est une erreur réseau
    if (!config._retry && (error.code === 'NETWORK_ERROR' || error.message.includes('fetch'))) {
      config._retry = true;
      console.log('🔄 [API Service] Retry attempt for upload...');
      
      // Attendre 2 secondes avant de retry
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return apiClient(config);
    }
    
    return Promise.reject(error);
  }
);

export const uploadToExternalScript = async (file: File): Promise<string> => {
  try {
    console.log('📤 [API Service] Starting upload...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    // Vérifier que le fichier n'est pas trop gros (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('Le fichier est trop volumineux. Taille maximum : 10MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'autre'); // Folder par défaut

    console.log('🌐 [API Service] Uploading to:', `${API_BASE_URL}/upload.php`);

    const response = await apiClient.post(`${API_BASE_URL}/upload.php`, formData);

    console.log('📥 [API Service] Upload response:', response.data);

    if (response.data?.success && response.data?.url) {
      console.log('✅ [API Service] Upload successful:', response.data.url);
      return response.data.url;
    } else {
      const errorMsg = response.data?.error || 'Réponse invalide du serveur';
      console.error('❌ [API Service] Upload failed:', errorMsg);
      throw new Error(`Erreur serveur: ${errorMsg}`);
    }
  } catch (error: any) {
    console.error('❌ [API Service] Upload error:', error);
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Timeout: Le serveur met trop de temps à répondre. Vérifiez votre connexion ou réessayez avec un fichier plus petit.');
    }
    
    if (error.message.includes('Network Error') || error.message.includes('fetch')) {
      throw new Error('Erreur réseau: Impossible de se connecter au serveur d\'upload. Vérifiez votre connexion internet.');
    }
    
    if (error.response?.status === 413) {
      throw new Error('Fichier trop volumineux pour le serveur.');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Erreur serveur temporaire. Réessayez dans quelques instants.');
    }
    
    // Si c'est notre propre erreur, la relancer
    if (error.message.includes('Erreur serveur:') || error.message.includes('trop volumineux')) {
      throw error;
    }
    
    throw new Error(`Erreur d'upload: ${error.message}`);
  }
};

// Mock functions for all the missing API calls
export const fetchActiveSocialNetworks = async () => {
  // Mock implementation - replace with actual API call
  return [];
};

export const createLottery = async (data: any) => {
  // Mock implementation - replace with actual API call
  return data;
};

export const updateLottery = async (id: string, data: any) => {
  // Mock implementation - replace with actual API call
  return data;
};

export const createMockup = async (data: any) => {
  // Mock implementation - replace with actual API call
  return data;
};

export const updateMockup = async (id: string, data: any) => {
  // Mock implementation - replace with actual API call
  return data;
};

export const createProduct = async (data: any) => {
  // Mock implementation - replace with actual API call
  return data;
};

export const updateProduct = async (id: string, data: any) => {
  // Mock implementation - replace with actual API call
  return data;
};

export const fetchFeaturedLotteries = async () => {
  // Mock implementation - replace with actual API call
  return [];
};

export const fetchAllDesigns = async (): Promise<Design[]> => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching designs:', error);
    return [];
  }
};

export const fetchLotteryById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching lottery by id:', error);
    return null;
  }
};

export const fetchProductsWithTickets = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .gt('tickets_offered', 0)
      .eq('is_active', true)
      .order('tickets_offered', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products with tickets:', error);
    return [];
  }
};

export const createDesign = async (data: any) => {
  // Mock implementation - replace with actual API call
  return data;
};

export const updateDesign = async (id: string, data: any) => {
  // Mock implementation - replace with actual API call
  return data;
};

export const deleteDesign = async (id: string) => {
  // Mock implementation - replace with actual API call
  return;
};

export const fetchAllLotteries = async () => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching lotteries:', error);
    return [];
  }
};

export const deleteLottery = async (id: string) => {
  // Mock implementation - replace with actual API call
  return;
};

export const fetchAllMockups = async () => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching mockups:', error);
    return [];
  }
};

export const generateDesign = async (data: any) => {
  // Mock implementation - replace with actual API call
  return data;
};

export const fetchAllProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const deleteProduct = async (id: string) => {
  // Mock implementation - replace with actual API call
  return;
};

export const fetchAllSocialNetworks = async () => {
  // Mock implementation - replace with actual API call
  return [];
};

export const createSocialNetwork = async (data: any) => {
  // Mock implementation - replace with actual API call
  return data;
};

export const updateSocialNetwork = async (id: string, data: any) => {
  // Mock implementation - replace with actual API call
  return data;
};

export const deleteSocialNetwork = async (id: string) => {
  // Mock implementation - replace with actual API call
  return;
};
