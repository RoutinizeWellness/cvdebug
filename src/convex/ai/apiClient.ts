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
      "X-Title": "CVDebug",
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

// Enhanced JSON extraction with robust fallback strategies
export function extractJSON(content: string): any {
  try {
    console.log("[extractJSON] Starting JSON extraction, content length:", content.length);
    
    // Strategy 1: Try to find JSON object within markdown code blocks or raw text
    // Look for the first '{' and last '}'
    const start = content.indexOf('{');
    const end = content.lastIndexOf('}');
    
    if (start !== -1 && end !== -1 && end > start) {
      const jsonStr = content.substring(start, end + 1);
      try {
        return JSON.parse(jsonStr);
      } catch (e) {
        console.log("[extractJSON] Failed to parse extracted JSON block, trying cleanup");
      }
    }

    // Strategy 2: Clean up markdown and try parsing
    let cleaned = content.trim();
    // Remove markdown code block markers using RegExp constructor to avoid syntax issues
    const jsonBlockStart = new RegExp("^```json\\s*", "m");
    const jsonBlockEnd = new RegExp("```\\s*$", "m");
    // Remove the markdown code block markers
    cleaned = cleaned.replace(jsonBlockStart, '').replace(jsonBlockEnd, '').trim();

    // Attempt to parse the cleaned content
    return JSON.parse(cleaned);

  } catch (err) {
    console.log("[extractJSON] JSON parsing failed, returning empty object", err);
    return {};
  }
}