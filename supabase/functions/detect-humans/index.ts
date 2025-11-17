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
    // Read raw body first
    const rawBody = await req.text();
    console.log("Raw request body:", rawBody);

    // Then parse JSON
    const { imageData } = JSON.parse(rawBody);

    if (!imageData) {
      throw new Error("No image data provided");
    }

    console.log("Received image data:", imageData.slice(0, 50), "...");

    const result = {
      humanDetected: false,
      humanCount: 0,
      confidence: 0,
      details: " removed. This is a dummy response."
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        humanDetected: false,
        humanCount: 0,
        confidence: 0,
        details: "Error occurred during detection",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
