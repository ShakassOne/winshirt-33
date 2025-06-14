import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createCanvas, loadImage, registerFont } from "npm:canvas@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DesignElement {
  type: "text" | "image";
  zIndex: number;
  text?: string;
  font?: string;
  color?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  url?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { orderId, json } = await req.json();

    if (!orderId || !json) {
      throw new Error("orderId and json are required");
    }

    const { productId, elements } = json as {
      productId: string;
      elements: DesignElement[];
    };

    if (!productId || !Array.isArray(elements)) {
      throw new Error("Invalid design JSON");
    }

    // Sort elements by z-index
    elements.sort((a, b) => a.zIndex - b.zIndex);

    // Create canvases
    const previewCanvas = createCanvas(500, 500);
    const previewCtx = previewCanvas.getContext("2d");
    const hdCanvas = createCanvas(4000, 4000);
    const hdCtx = hdCanvas.getContext("2d");

    // Helper to draw element on a given context
    const drawElement = async (ctx: CanvasRenderingContext2D, scale: number, el: DesignElement) => {
      ctx.save();
      if (el.type === "image" && el.url) {
        const img = await loadImage(el.url);
        const w = (el.width || img.width) * scale;
        const h = (el.height || img.height) * scale;
        ctx.drawImage(img, el.x * scale, el.y * scale, w, h);
      } else if (el.type === "text" && el.text) {
        if (el.font) {
          ctx.font = `${24 * scale}px ${el.font}`;
        }
        ctx.fillStyle = el.color || "#000";
        ctx.textBaseline = "top";
        ctx.fillText(el.text, el.x * scale, el.y * scale);
      }
      ctx.restore();
    };

    for (const el of elements) {
      await drawElement(previewCtx, 1, el);
      await drawElement(hdCtx, 8, el); // 4000 / 500 = 8
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const previewPath = `output/${productId}_front_preview.png`;
    const hdPath = `output/${productId}_front_hd.png`;

    const previewBuffer = previewCanvas.toBuffer("image/png");
    const hdBuffer = hdCanvas.toBuffer("image/png");

    const { error: previewUploadError } = await supabase.storage
      .from("designs")
      .upload(previewPath, previewBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (previewUploadError) throw previewUploadError;

    const { error: hdUploadError } = await supabase.storage
      .from("designs")
      .upload(hdPath, hdBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (hdUploadError) throw hdUploadError;

    const { data: { publicUrl: previewUrl } } = supabase.storage
      .from("designs")
      .getPublicUrl(previewPath);
    const { data: { publicUrl: hdUrl } } = supabase.storage
      .from("designs")
      .getPublicUrl(hdPath);

    // Update order record
    await supabase
      .from("orders")
      .update({ preview_url: previewUrl, hd_url: hdUrl })
      .eq("id", orderId);

    return new Response(
      JSON.stringify({ success: true, previewUrl, hdUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-design function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
