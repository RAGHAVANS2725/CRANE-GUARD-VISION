import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    
    if (!imageData) {
      throw new Error('No image data provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Analyzing image for human detection...');

    // Call Lovable AI with vision model for human detection
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a safety detection system for crane operations. Analyze images to detect humans and provide safety information. 
            
            Respond ONLY with valid JSON in this exact format:
            {
              "humanDetected": boolean,
              "humanCount": number,
              "confidence": number,
              "details": "brief description"
            }
            
            - humanDetected: true if any people are visible
            - humanCount: exact number of people detected (0 if none)
            - confidence: detection confidence 0-100
            - details: brief description of what you see`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this crane operation zone image. Detect if any humans/workers are present in the frame. Count how many people you can see.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response:', data);

    const aiMessage = data.choices[0].message.content;
    console.log('AI message:', aiMessage);
    
    // Parse the JSON response
    let result;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiMessage.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || 
                       aiMessage.match(/(\{[\s\S]*\})/);
      
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, 'Response:', aiMessage);
      // Return safe default
      result = {
        humanDetected: false,
        humanCount: 0,
        confidence: 0,
        details: 'Unable to analyze image properly'
      };
    }

    console.log('Detection result:', result);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in detect-humans function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        humanDetected: false,
        humanCount: 0,
        confidence: 0,
        details: 'Error occurred during detection'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
