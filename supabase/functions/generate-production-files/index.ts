
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createCanvas, loadImage } from "https://deno.land/x/canvas@v1.4.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CustomizationData {
  frontDesign?: {
    designUrl: string;
    designName: string;
    transform: {
      scale: number;
      position: { x: number; y: number };
      rotation: number;
    };
  };
  backDesign?: {
    designUrl: string;
    designName: string;
    transform: {
      scale: number;
      position: { x: number; y: number };
      rotation: number;
    };
  };
  frontText?: {
    content: string;
    font: string;
    color: string;
    styles: { bold: boolean; italic: boolean; underline: boolean };
    transform: {
      scale: number;
      position: { x: number; y: number };
      rotation: number;
    };
  };
  backText?: {
    content: string;
    font: string;
    color: string;
    styles: { bold: boolean; italic: boolean; underline: boolean };
    transform: {
      scale: number;
      position: { x: number; y: number };
      rotation: number;
    };
  };
}

interface GenerationRequest {
  customization: CustomizationData;
  mockupUrls: {
    front?: string;
    back?: string;
  };
  productInfo: {
    name: string;
    id: string;
  };
}

async function uploadToMediaServer(blob: Blob, filename: string): Promise<string | null> {
  try {
    const formData = new FormData();
    const file = new File([blob], filename, { type: 'image/png' });
    formData.append('image', file);

    const response = await fetch('https://media.winshirt.fr/upload-visuel.php', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    return result?.url || null;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
}

async function generateSideImage(
  side: 'front' | 'back',
  customization: CustomizationData,
  mockupUrl?: string,
  isHD: boolean = false
): Promise<Blob | null> {
  try {
    const width = isHD ? 3500 : 400;
    const height = isHD ? 3500 : 500;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = isHD ? 'transparent' : '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // If not HD and we have a mockup, draw the background
    if (!isHD && mockupUrl) {
      try {
        const mockupImage = await loadImage(mockupUrl);
        ctx.drawImage(mockupImage, 0, 0, width, height);
      } catch (error) {
        console.error('Error loading mockup:', error);
      }
    }

    const design = side === 'front' ? customization.frontDesign : customization.backDesign;
    const text = side === 'front' ? customization.frontText : customization.backText;

    // Center coordinates
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw design if present
    if (design) {
      try {
        const designImage = await loadImage(design.designUrl);
        const transform = design.transform;
        
        ctx.save();
        ctx.translate(
          centerX + (transform.position.x * (width / 400)),
          centerY + (transform.position.y * (height / 500))
        );
        ctx.rotate((transform.rotation * Math.PI) / 180);
        ctx.scale(transform.scale, transform.scale);
        
        const designSize = isHD ? 500 : 200;
        ctx.drawImage(designImage, -designSize/2, -designSize/2, designSize, designSize);
        ctx.restore();
      } catch (error) {
        console.error('Error loading design:', error);
      }
    }

    // Draw text if present
    if (text && text.content) {
      ctx.save();
      ctx.translate(
        centerX + (text.transform.position.x * (width / 400)),
        centerY + (text.transform.position.y * (height / 500))
      );
      ctx.rotate((text.transform.rotation * Math.PI) / 180);
      ctx.scale(text.transform.scale, text.transform.scale);

      // Set font properties
      const fontSize = isHD ? 60 : 24;
      let fontStyle = '';
      if (text.styles.italic) fontStyle += 'italic ';
      if (text.styles.bold) fontStyle += 'bold ';
      
      ctx.font = `${fontStyle}${fontSize}px ${text.font}`;
      ctx.fillStyle = text.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Add text shadow for better visibility
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      ctx.fillText(text.content, 0, 0);

      // Add underline if needed
      if (text.styles.underline) {
        const textMetrics = ctx.measureText(text.content);
        ctx.beginPath();
        ctx.moveTo(-textMetrics.width / 2, fontSize * 0.1);
        ctx.lineTo(textMetrics.width / 2, fontSize * 0.1);
        ctx.strokeStyle = text.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.restore();
    }

    return canvas.toBlob();
  } catch (error) {
    console.error(`Error generating ${side} image:`, error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: GenerationRequest = await req.json();
    console.log('🎬 [Production Files] Génération démarrée:', requestData.productInfo.name);

    const results = {
      front: { mockupUrl: null as string | null, hdUrl: null as string | null },
      back: { mockupUrl: null as string | null, hdUrl: null as string | null }
    };

    const timestamp = Date.now();

    // Generate front files
    if (requestData.customization.frontDesign || requestData.customization.frontText) {
      console.log('📸 [Production Files] Génération front...');
      
      // Preview mockup (with background)
      const frontMockup = await generateSideImage(
        'front',
        requestData.customization,
        requestData.mockupUrls.front,
        false
      );
      
      if (frontMockup) {
        const mockupFilename = `mockup-front-${requestData.productInfo.id}-${timestamp}.png`;
        results.front.mockupUrl = await uploadToMediaServer(frontMockup, mockupFilename);
        console.log('✅ [Production Files] Mockup front uploadé:', results.front.mockupUrl);
      }

      // HD production file (transparent background)
      const frontHD = await generateSideImage(
        'front',
        requestData.customization,
        undefined,
        true
      );
      
      if (frontHD) {
        const hdFilename = `hd-front-${requestData.productInfo.id}-${timestamp}.png`;
        results.front.hdUrl = await uploadToMediaServer(frontHD, hdFilename);
        console.log('✅ [Production Files] HD front uploadé:', results.front.hdUrl);
      }
    }

    // Generate back files
    if (requestData.customization.backDesign || requestData.customization.backText) {
      console.log('📸 [Production Files] Génération back...');
      
      // Preview mockup (with background)
      const backMockup = await generateSideImage(
        'back',
        requestData.customization,
        requestData.mockupUrls.back,
        false
      );
      
      if (backMockup) {
        const mockupFilename = `mockup-back-${requestData.productInfo.id}-${timestamp}.png`;
        results.back.mockupUrl = await uploadToMediaServer(backMockup, mockupFilename);
        console.log('✅ [Production Files] Mockup back uploadé:', results.back.mockupUrl);
      }

      // HD production file (transparent background)
      const backHD = await generateSideImage(
        'back',
        requestData.customization,
        undefined,
        true
      );
      
      if (backHD) {
        const hdFilename = `hd-back-${requestData.productInfo.id}-${timestamp}.png`;
        results.back.hdUrl = await uploadToMediaServer(backHD, hdFilename);
        console.log('✅ [Production Files] HD back uploadé:', results.back.hdUrl);
      }
    }

    console.log('🎉 [Production Files] Génération terminée:', results);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ [Production Files] Erreur:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la génération des fichiers' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
