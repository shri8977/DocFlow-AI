import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function callAI(prompt: string, systemPrompt: string) {
  const apiKey = Deno.env.get("GROQ_API_KEY") || Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("AI API key not configured");

  const isGroq = apiKey.startsWith("gsk_");
  const response = await fetch(
    isGroq
      ? "https://api.groq.com/openai/v1/chat/completions"
      : `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(isGroq ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify(
        isGroq
          ? {
              model: "llama-3.3-70b-versatile",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
              ],
              temperature: 0.2,
              max_tokens: 1024,
            }
          : {
              system_instruction: { parts: [{ text: systemPrompt }] },
              contents: [{ parts: [{ text: prompt }] }],
            }
      ),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI request failed: ${response.status} ${errText}`);
  }

  const result = await response.json();
  const text = isGroq
    ? result?.choices?.[0]?.message?.content?.trim()
    : result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error("AI returned an empty response");
  return text;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ success: false, message: "No text provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const summary = await callAI(
      `Summarize the following text clearly and concisely. Keep the main ideas and important details.\n\n${text.slice(0, 20000)}`,
      "You are a helpful document summarizer. Write clear, factual summaries."
    );

    return new Response(
      JSON.stringify({ success: true, summary }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: err instanceof Error ? err.message : "Something went wrong" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
