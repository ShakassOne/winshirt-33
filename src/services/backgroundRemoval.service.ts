
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

/**
 * Supprime automatiquement tout fond uni (quelque soit la couleur) autour d'un visuel.
 * @param {HTMLImageElement} img - L'image source déjà chargée
 * @param {number} tolerance - De 0 (strict) à 80 (large)
 * @returns {HTMLCanvasElement} - Canvas avec fond rendu transparent
 */
function removeSolidBackground(img: HTMLImageElement, tolerance = 32): HTMLCanvasElement {
  // Création du canvas
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Prend la couleur du pixel (0,0) comme fond de référence
  const baseR = data[0], baseG = data[1], baseB = data[2];

  function isClose(r: number, g: number, b: number) {
    return (
      Math.abs(r - baseR) <= tolerance &&
      Math.abs(g - baseG) <= tolerance &&
      Math.abs(b - baseB) <= tolerance
    );
  }

  // Parcourt tous les pixels
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (isClose(r, g, b)) {
      data[i + 3] = 0; // Transparent
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting simple background removal process...');
    
    // Resize image if needed
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) throw new Error('Could not get temp canvas context');
    
    const wasResized = resizeImageIfNeeded(tempCanvas, tempCtx, imageElement);
    console.log(`Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${tempCanvas.width}x${tempCanvas.height}`);
    
    // Create new image element from resized canvas if needed
    const processImage = wasResized ? await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = tempCanvas.toDataURL();
    }) : imageElement;
    
    // Apply solid background removal
    const resultCanvas = removeSolidBackground(processImage, 32);
    console.log('Simple background removal applied successfully');
    
    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      resultCanvas.toBlob(
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
    console.error('Error in simple background removal:', error);
    throw new Error('Impossible de supprimer le fond de cette image. Vérifiez que l\'image a un fond uni.');
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
