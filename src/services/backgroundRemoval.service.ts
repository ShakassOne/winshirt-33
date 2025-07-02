
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
    console.log('Starting AI background removal process...');
    
    // Check internet connection first
    const isConnected = await checkConnection();
    if (!isConnected) {
      throw new Error('Pas de connexion internet détectée. Vérifiez votre connexion et réessayez.');
    }

    let segmenter;
    
    try {
      // Try with WebGPU first
      console.log('Trying WebGPU device...');
      segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b2-finetuned-ade-512-512', {
        device: 'webgpu',
      });
    } catch (webgpuError) {
      console.warn('WebGPU failed, falling back to CPU:', webgpuError);
      try {
        // Fallback to CPU
        segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b2-finetuned-ade-512-512', {
          device: 'cpu',
        });
      } catch (cpuError) {
        console.error('Both WebGPU and CPU failed:', cpuError);
        throw new Error('Impossible de charger le modèle IA. Veuillez réessayer dans quelques instants.');
      }
    }
    
    // Convert HTMLImageElement to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Resize image if needed and draw it to canvas
    const wasResized = resizeImageIfNeeded(canvas, ctx, imageElement);
    console.log(`Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${canvas.width}x${canvas.height}`);
    
    // Get image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    console.log('Image converted to base64');
    
    // Process the image with the segmentation model
    console.log('Processing with AI segmentation model...');
    const result = await segmenter(imageData);
    
    console.log('AI segmentation result:', result);
    
    if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
      throw new Error('Le modèle IA n\'a pas pu traiter cette image. Essayez avec une autre image.');
    }
    
    // Create a new canvas for the masked image
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    // Draw original image
    outputCtx.drawImage(canvas, 0, 0);
    
    // Apply the mask
    const outputImageData = outputCtx.getImageData(
      0, 0,
      outputCanvas.width,
      outputCanvas.height
    );
    const data = outputImageData.data;
    
    // Apply inverted mask to alpha channel
    for (let i = 0; i < result[0].mask.data.length; i++) {
      // Invert the mask value (1 - value) to keep the subject instead of the background
      const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
      data[i * 4 + 3] = alpha;
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    console.log('AI mask applied successfully');
    
    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Successfully created transparent PNG blob');
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  } catch (error) {
    console.error('Error in AI background removal:', error);
    
    // Provide more specific error messages
    if (error.message.includes('fetch')) {
      throw new Error('Erreur de connexion réseau. Vérifiez votre connexion internet et réessayez.');
    } else if (error.message.includes('WebGL') || error.message.includes('WebGPU')) {
      throw new Error('Votre navigateur ne supporte pas l\'accélération matérielle nécessaire. Essayez avec un navigateur plus récent.');
    } else if (error.message.includes('quota') || error.message.includes('memory')) {
      throw new Error('Mémoire insuffisante. Essayez avec une image plus petite.');
    }
    
    throw error;
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
