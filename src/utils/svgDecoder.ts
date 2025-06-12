
export const decodeSVGBase64 = (base64String: string): string | null => {
  try {
    // Extraire la partie base64 si c'est une data URL
    const base64Data = base64String.includes('base64,') 
      ? base64String.split('base64,')[1] 
      : base64String;
    
    // Décoder le base64
    const decoded = atob(base64Data);
    
    // Vérifier que c'est bien du SVG
    if (decoded.includes('<svg')) {
      return decoded;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors du décodage SVG base64:', error);
    return null;
  }
};

export const isBase64SVG = (url: string): boolean => {
  return url.startsWith('data:image/svg+xml;base64,');
};

export const processSVGContent = (svgContent: string, color?: string): string => {
  if (!svgContent) return '';
  
  // Appliquer la couleur si fournie
  if (color && color !== 'currentColor') {
    // Remplacer currentColor par la couleur choisie
    svgContent = svgContent.replace(/currentColor/g, color);
    // Ajouter la couleur comme fill par défaut
    svgContent = svgContent.replace(/<svg([^>]*)>/, `<svg$1 fill="${color}">`);
  }
  
  return svgContent;
};
