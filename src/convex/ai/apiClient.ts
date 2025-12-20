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
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://convex.dev",
        "X-Title": "CVDebug",
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[OpenRouter API] Error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid API response structure");
    }
    
    return data.choices[0].message.content || "";
  } catch (error: any) {
    console.error("[OpenRouter API] Request failed:", error.message);
    throw error;
  }
}

// Enhanced JSON extraction with robust fallback strategies
export function extractJSON(content: string): any {
  try {
    console.log("[extractJSON] Starting JSON extraction, content length:", content.length);
    
    // Strategy 1: Try to find JSON object within markdown code blocks or raw text
    const start = content.indexOf('{');
    const end = content.lastIndexOf('}');
    
    if (start !== -1 && end !== -1 && end > start) {
      const jsonStr = content.substring(start, end + 1);
      try {
        const parsed = JSON.parse(jsonStr);
        // Validate it has expected structure
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      } catch (e) {
        console.log("[extractJSON] Failed to parse extracted JSON block, trying cleanup");
      }
    }

    // Strategy 2: Clean up markdown and try parsing
    let cleaned = content.trim();
    // Remove markdown code block delimiters and possible markdown syntax to isolate json
    cleaned = cleaned.replace(/^```(?:json)?\s*([\s\S]*?)```$/i, '$1').trim();

    // Try parsing the cleaned string directly
    try {
      const parsed = JSON.parse(cleaned);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch (err) {
      console.log("[extractJSON] Failed to parse cleaned content, no JSON found");
    }

    // If all attempts fail, return null or throw error
    return null;
  } catch (err) {
    console.error("[extractJSON] Unexpected error:", err);
    return null;
  }
}