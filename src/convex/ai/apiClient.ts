"use node";

interface OpenRouterRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  response_format?: { type: string };
}

export async function callOpenRouter(
  apiKey: string,
  request: OpenRouterRequest
): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://convex.dev",
      "X-Title": "ResumeATS",
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[OpenRouter API] Error: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

// Added the extractJSON function with core logic and a debug statement
export function extractJSON(content: string): any {
  try {
    console.log("[extractJSON] Starting JSON extraction, content length:", content.length);
    
    let cleaned = content.trim();
    
    // Remove markdown code blocks - use proper regex without double escaping
    cleaned = cleaned.replace(/^```[\w]*\n([\s\S]*?)\n```$/g, '$1');

    // Remove any remaining code blocks or markdown formatting
    // Optional: Further cleaning can be added here if needed.

    const jsonObject = JSON.parse(cleaned);
    return jsonObject;
  } catch (error) {
    console.error("[extractJSON] Failed to parse JSON:", error);
    throw error;
  }
}