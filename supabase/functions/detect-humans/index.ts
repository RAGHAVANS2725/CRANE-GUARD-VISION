import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();

    if (!imageData) {
      throw new Error("No image data received");
    }

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",                  // Supported model
        image: imageData,                      // base64 from your camera feed
        task: "object-detection",
        labels: ["person"],                    // detect humans only
      }),
    });

    const result = await response.json();
    console.log("Detection result:", result);

    const detections = result?.detections || [];
    const humanDetections = detections.filter((d: any) => d.label === "person");

    return new Response(
      JSON.stringify({
        humanDetected: humanDetections.length > 0,
        humanCount: humanDetections.length,
        confidence: humanDetections[0]?.confidence || 0,
        details: "AI Model detection complete",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
