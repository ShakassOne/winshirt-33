
/**
 * Supprime automatiquement tout fond uni (quelque soit la couleur) autour d'un visuel.
 * @param {HTMLImageElement} img - L'image source déjà chargée
 * @param {number} tolerance - De 0 (strict) à 80 (large)
 * @returns {Promise<Blob>} - Blob de l'image avec fond rendu transparent
 */
export const removeFlatBackground = (img: HTMLImageElement, tolerance: number = 30): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      // Création du canvas
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Impossible de créer le contexte canvas'));
        return;
      }
      
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Prend la couleur du pixel (0,0) comme fond de référence
      const baseR = data[0], baseG = data[1], baseB = data[2];

      function isClose(r: number, g: number, b: number): boolean {
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
      
      // Convertir le canvas en blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Fond uni supprimé avec succès');
            resolve(blob);
          } else {
            reject(new Error('Impossible de créer le blob depuis le canvas'));
          }
        },
        'image/png',
        1.0
      );
    } catch (error) {
      console.error('Erreur lors de la suppression du fond uni:', error);
      reject(error);
    }
  });
};
