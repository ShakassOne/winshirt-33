
import React, { useEffect, useRef, useState } from "react";

interface RemoveFlatBackgroundProps {
  imageUrl: string;
  tolerance?: number;
  onReady?: (cleanedImageUrl: string) => void;
}

export const RemoveFlatBackground: React.FC<RemoveFlatBackgroundProps> = ({ 
  imageUrl, 
  tolerance = 30, 
  onReady 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cleanedUrl, setCleanedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Couleur de référence : pixel du coin supérieur gauche
      const r0 = data[0], g0 = data[1], b0 = data[2];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const distance = Math.sqrt((r - r0) ** 2 + (g - g0) ** 2 + (b - b0) ** 2);
        if (distance < tolerance) {
          data[i + 3] = 0; // suppression (alpha 0)
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const output = canvas.toDataURL("image/png");
      setCleanedUrl(output);
      onReady && onReady(output);
    };

    img.src = imageUrl;
  }, [imageUrl, tolerance, onReady]);

  return (
    <canvas ref={canvasRef} style={{ display: "none" }} />
  );
};
