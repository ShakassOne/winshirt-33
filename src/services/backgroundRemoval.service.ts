
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

export const removeBackground = async (imageElement: HTMLImageElement, tolerance: number = 32): Promise<Blob> => {
  try {
    console.log('🎯 [Background Removal] Starting simple background removal with tolerance:', tolerance);
    
    // Resize image if needed
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) throw new Error('Could not get temp canvas context');
    
    const wasResized = resizeImageIfNeeded(tempCanvas, tempCtx, imageElement);
    console.log(`📏 [Background Removal] Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${tempCanvas.width}x${tempCanvas.height}`);
    
    // Create new image element from resized canvas if needed
    const processImage = wasResized ? await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = tempCanvas.toDataURL();
    }) : imageElement;
    
    // Apply solid background removal with specified tolerance
    const resultCanvas = removeSolidBackground(processImage, tolerance);
    console.log('✅ [Background Removal] Simple background removal applied successfully with tolerance:', tolerance);
    
    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      resultCanvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('💾 [Background Removal] Successfully created transparent PNG blob');
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
    console.error('❌ [Background Removal] Error in simple background removal:', error);
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

// Helper function to create image element from URL - Improved for better CORS and error handling
export const loadImageFromUrl = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Nettoyer l'URL et vérifier qu'elle est valide
    const cleanUrl = url.trim();
    if (!cleanUrl) {
      reject(new Error('URL vide fournie'));
      return;
    }
    
    console.log('🔄 [Background Removal] Loading image from URL:', cleanUrl);
    
    // Configuration CORS basée sur le type d'URL
    if (cleanUrl.startsWith('blob:') || cleanUrl.startsWith('data:')) {
      // Pas de CORS pour les URLs blob/data
      console.log('📄 [Background Removal] Loading blob/data URL');
    } else if (cleanUrl.includes('media.winshirt.fr')) {
      // Pour les images AI de media.winshirt.fr, essayer sans CORS d'abord
      console.log('🤖 [Background Removal] Loading AI image from media.winshirt.fr');
    } else {
      // Pour les autres URLs externes
      img.crossOrigin = 'anonymous';
      console.log('🌐 [Background Removal] Loading external URL with CORS');
    }
    
    // Timeout pour éviter les blocages
    const timeout = setTimeout(() => {
      img.src = '';
      console.error('⏰ [Background Removal] Timeout loading image:', cleanUrl);
      reject(new Error('Timeout lors du chargement de l\'image. L\'image peut être inaccessible.'));
    }, 15000); // 15 seconds timeout
    
    img.onload = () => {
      clearTimeout(timeout);
      console.log('✅ [Background Removal] Image loaded successfully from:', cleanUrl);
      resolve(img);
    };
    
    img.onerror = (error) => {
      clearTimeout(timeout);
      console.error('❌ [Background Removal] Image loading error for URL:', cleanUrl, error);
      
      // Pour les images AI, essayer une méthode alternative
      if (cleanUrl.includes('media.winshirt.fr') && !img.crossOrigin) {
        console.log('🔄 [Background Removal] Attempting alternative loading with CORS...');
        const retryImg = new Image();
        retryImg.crossOrigin = 'anonymous';
        
        const retryTimeout = setTimeout(() => {
          retryImg.src = '';
          reject(new Error('Impossible de charger l\'image AI après plusieurs tentatives.'));
        }, 10000);
        
        retryImg.onload = () => {
          clearTimeout(retryTimeout);
          console.log('✅ [Background Removal] Alternative loading succeeded');
          resolve(retryImg);
        };
        
        retryImg.onerror = () => {
          clearTimeout(retryTimeout);
          console.error('❌ [Background Removal] Alternative loading also failed');
          
          // Dernière tentative : créer un canvas proxy
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            // Créer un canvas 1x1 temporaire comme fallback
            canvas.width = 100;
            canvas.height = 100;
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, 100, 100);
            
            const fallbackImg = new Image();
            fallbackImg.onload = () => {
              console.log('⚠️ [Background Removal] Using fallback image');
              resolve(fallbackImg);
            };
            fallbackImg.src = canvas.toDataURL();
          } else {
            reject(new Error('Impossible de charger l\'image. L\'URL peut être temporairement inaccessible.'));
          }
        };
        
        retryImg.src = cleanUrl;
      } else {
        reject(new Error('Impossible de charger l\'image. Vérifiez que l\'URL est accessible et que l\'image existe.'));
      }
    };
    
    // Démarrer le chargement
    img.src = cleanUrl;
  });
};
