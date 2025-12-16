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
  const jsonStart = content.indexOf('{');
  const jsonEnd = content.lastIndexOf('}');
  
  if (jsonStart === -1 || jsonEnd === -1) {
    console.error("AI Response not JSON:", content);
    throw new Error("Invalid JSON response from AI - No JSON object found");
  }
  
  const jsonStr = content.substring(jsonStart, jsonEnd + 1);
  
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    console.error("Faulty JSON String:", jsonStr);
    throw new Error("Failed to parse AI response as JSON");
  }
}
