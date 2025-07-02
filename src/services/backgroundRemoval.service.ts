import { removeFlatBackground } from '@/utils/simpleFlatBackgroundRemoval';

import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to always download models
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 1024;

function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  return false;
}

// Check internet connection
const checkConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://httpbin.org/get', { 
      method: 'HEAD',
      cache: 'no-cache',
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch {
    return false;
  }
};

export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting simple background removal process...');
    
    // Utiliser la méthode simple de suppression de fond uni
    const cleanedBlob = await removeFlatBackground(imageElement, 30);
    
    console.log('Simple background removal completed successfully');
    return cleanedBlob;
  } catch (error) {
    console.error('Error in simple background removal:', error);
    
    // Fournir des messages d'erreur plus clairs
    if (error instanceof Error) {
      if (error.message.includes('canvas')) {
        throw new Error('Erreur technique : impossible de traiter l\'image. Essayez avec une autre image.');
      } else if (error.message.includes('blob')) {
        throw new Error('Erreur de conversion : impossible de finaliser l\'image. Réessayez.');
      }
      throw new Error(`Erreur de suppression de fond : ${error.message}`);
    }
    
    throw new Error('Une erreur inattendue s\'est produite lors de la suppression du fond.');
  }
};

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// Helper function to create image element from URL - Fixed for blob URLs
export const loadImageFromUrl = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Only set crossOrigin for external URLs, not for blob URLs
    if (!url.startsWith('blob:') && !url.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    
    img.onload = () => resolve(img);
    img.onerror = (error) => {
      console.error('Image loading error:', error);
      reject(new Error('Impossible de charger l\'image. Vérifiez que l\'URL est accessible.'));
    };
    img.src = url;
  });
};
