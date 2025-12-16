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

export function extractJSON(content: string): any {
  // 1. Try to find the JSON object using brace counting (most robust)
  const jsonStart = content.indexOf('{');
  if (jsonStart === -1) {
    console.error("AI Response not JSON (no opening brace):", content);
    throw new Error("Invalid JSON response from AI - No JSON object found");
  }

  let braceCount = 0;
  let inString = false;
  let escape = false;
  let jsonEnd = -1;

  for (let i = jsonStart; i < content.length; i++) {
    const char = content[i];
    
    if (inString) {
      if (escape) {
        escape = false;
      } else if (char === '\\') {
        escape = true;
      } else if (char === '"') {
        inString = false;
      }
    } else {
      if (char === '"') {
        inString = true;
      } else if (char === '{') {
        braceCount++;
      } else if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          jsonEnd = i;
          break;
        }
      }
    }
  }

  let jsonStr = "";
  
  if (jsonEnd !== -1) {
    jsonStr = content.substring(jsonStart, jsonEnd + 1);
  } else {
    // Fallback: Try to use the last closing brace if counting failed (e.g. malformed)
    const lastBrace = content.lastIndexOf('}');
    if (lastBrace !== -1) {
      jsonStr = content.substring(jsonStart, lastBrace + 1);
    } else {
      // Last resort: try to parse the whole thing from start
      jsonStr = content.substring(jsonStart);
    }
  }
  
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    console.error("Faulty JSON String:", jsonStr);
    
    // One final attempt: clean markdown code blocks if present
    try {
      const clean = content.replace(/```json/g, '').replace(/```/g, '');
      const cleanJson = clean.replace(/(\s*[\n\r]+|\s+)+/g, ' ').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error("Final JSON Parse Error:", e);
      throw new Error("Failed to parse AI response as JSON");
    }
  }
}