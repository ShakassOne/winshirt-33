
import axios from 'axios';

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
