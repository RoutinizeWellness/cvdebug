/**
 * Auto-Tune Engine - ML-powered automatic bullet optimization
 *
 * This engine automatically:
 * 1. Detects weak bullets using scoring algorithm
 * 2. Generates improvements using AI
 * 3. Injects missing FAANG-level keywords using semantic matching
 * 4. Applies optimizations automatically
 */

interface WeakBullet {
  original: string;
  weaknessScore: number;
  index: number;
  reasons: string[];
}

interface OptimizedBullet {
  original: string;
  improved: string;
  improvements: string[];
  keywordsAdded: string[];
}

interface AutoTuneResult {
  originalText: string;
  optimizedText: string;
  bulletsOptimized: number;
  keywordsInjected: number;
  improvements: OptimizedBullet[];
  score: {
    before: number;
    after: number;
    improvement: number;
  };
}

/**
 * Detect weak bullets using ML-based scoring algorithm
 */
function detectWeakBullets(text: string): WeakBullet[] {
  if (!text) return [];

  // Extract bullets from text
  const bulletPatterns = [
    /^[•\-\*]\s*.+/gm,           // Traditional bullets
    /^\d+\.\s*.+/gm,              // Numbered lists
    /(?:^|\n)[A-Z][^.!?\n]{20,200}(?:[.!?]|$)/g  // Sentences
  ];

  let bullets: string[] = [];
  bulletPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      bullets.push(...matches.map(s => s.replace(/^[•\-\*\d]+\.\s*/, '').trim()));
    }
  });

  // Score each bullet based on weakness factors
  const scoredBullets: WeakBullet[] = bullets.map((bullet, index) => {
    let weaknessScore = 0;
    const reasons: string[] = [];

    // Factor 1: Passive voice detection (weight: 20)
    const passiveIndicators = ['was', 'were', 'been', 'being', 'is', 'are', 'am'];
    const hasPassive = passiveIndicators.some(word =>
      new RegExp(`\\b${word}\\s+\\w+ed\\b`, 'i').test(bullet)
    );
    if (hasPassive) {
      weaknessScore += 20;
      reasons.push('passive_voice');
    }

    // Factor 2: Lack of quantification (weight: 30)
    const hasNumbers = /\d+/.test(bullet);
    const hasPercentage = /%/.test(bullet);
    const hasQuantifier = /\b(increased|decreased|improved|reduced|grew|doubled|tripled)\b/i.test(bullet);
    if (!hasNumbers && !hasPercentage && !hasQuantifier) {
      weaknessScore += 30;
      reasons.push('no_metrics');
    }

    // Factor 3: Weak action verbs (weight: 25)
    const weakVerbs = ['helped', 'worked on', 'responsible for', 'assisted', 'participated', 'involved'];
    const startsWithWeakVerb = weakVerbs.some(verb =>
      bullet.toLowerCase().startsWith(verb)
    );
    if (startsWithWeakVerb) {
      weaknessScore += 25;
      reasons.push('weak_verbs');
    }

    // Factor 4: Too generic (weight: 15)
    const genericPhrases = ['various', 'several', 'multiple', 'many', 'some'];
    const hasGeneric = genericPhrases.some(phrase =>
      new RegExp(`\\b${phrase}\\b`, 'i').test(bullet)
    );
    if (hasGeneric) {
      weaknessScore += 15;
      reasons.push('too_generic');
    }

    // Factor 5: Length issues (weight: 10)
    if (bullet.length < 40 || bullet.length > 200) {
      weaknessScore += 10;
      reasons.push('length_issue');
    }

    return {
      original: bullet,
      weaknessScore,
      index,
      reasons
    };
  });

  // Return bullets with weakness score > 40 (needs improvement)
  return scoredBullets.filter(b => b.weaknessScore > 40);
}

/**
 * Generate improved bullet using AI
 */
async function generateImprovedBullet(
  bullet: string,
  weaknessReasons: string[],
  missingKeywords: string[]
): Promise<string> {
  const prompt = `You are an expert resume writer specializing in FAANG-level resumes.

Original bullet point:
"${bullet}"

Issues detected:
${weaknessReasons.map(r => `- ${r.replace('_', ' ')}`).join('\n')}

Missing FAANG keywords to inject (choose 1-2 most relevant):
${missingKeywords.slice(0, 5).join(', ')}

Generate ONE improved bullet point that:
1. Uses strong action verbs (Led, Architected, Optimized, Implemented)
2. Includes specific metrics and quantification
3. Naturally incorporates 1-2 of the missing FAANG keywords
4. Shows impact and results
5. Is 80-150 characters
6. Sounds natural and authentic

Return ONLY the improved bullet point, nothing else.`;

  try {
    // Get API key from environment
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.warn('No AI API key configured - using fallback');
      throw new Error('No API key');
    }

    // Use OpenRouter or OpenAI
    const apiUrl = process.env.OPENROUTER_API_KEY
      ? "https://openrouter.ai/api/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(process.env.OPENROUTER_API_KEY && {
          "HTTP-Referer": "https://cvdebug.com",
          "X-Title": "CVDebug"
        })
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_API_KEY ? "anthropic/claude-3.5-sonnet" : "gpt-4o-mini",
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (content) {
      return content.trim();
    }
  } catch (error) {
    console.error('AI generation failed:', error);
  }

  // Fallback: Basic improvement without AI
  return bullet.replace(/^(helped|assisted|worked on)/i, 'Led')
    .replace(/various|several|multiple/gi, 'X')
    + ' (optimized)';
}

/**
 * Calculate resume score based on metrics
 */
function calculateScore(text: string): number {
  let score = 50; // Base score

  // Metrics presence (+20)
  const metricsCount = (text.match(/\d+%|\d+x|\$\d+|\d+\+/g) || []).length;
  score += Math.min(20, metricsCount * 2);

  // Action verbs (+15)
  const strongVerbs = ['led', 'architected', 'implemented', 'optimized', 'designed', 'built'];
  const verbCount = strongVerbs.filter(v => new RegExp(`\\b${v}\\b`, 'i').test(text)).length;
  score += Math.min(15, verbCount * 3);

  // FAANG keywords (+15)
  const faangKeywords = ['scalable', 'distributed', 'microservices', 'kubernetes', 'aws', 'ci/cd'];
  const keywordCount = faangKeywords.filter(k => new RegExp(`\\b${k}\\b`, 'i').test(text)).length;
  score += Math.min(15, keywordCount * 2.5);

  return Math.min(100, Math.round(score));
}

/**
 * Main Auto-Tune Engine
 * Automatically optimizes all weak bullets with AI
 */
export async function autoTuneBullets(
  resumeText: string,
  missingKeywords: string[]
): Promise<AutoTuneResult> {
  // Calculate initial score
  const initialScore = calculateScore(resumeText);

  // Step 1: Detect weak bullets using algorithm
  const weakBullets = detectWeakBullets(resumeText);

  if (weakBullets.length === 0) {
    return {
      originalText: resumeText,
      optimizedText: resumeText,
      bulletsOptimized: 0,
      keywordsInjected: 0,
      improvements: [],
      score: {
        before: initialScore,
        after: initialScore,
        improvement: 0
      }
    };
  }

  // Step 2: Generate improvements for each weak bullet
  const improvements: OptimizedBullet[] = [];
  let optimizedText = resumeText;

  for (const weakBullet of weakBullets.slice(0, 5)) { // Limit to top 5 weakest
    const improved = await generateImprovedBullet(
      weakBullet.original,
      weakBullet.reasons,
      missingKeywords
    );

    // Extract keywords that were added
    const keywordsAdded = missingKeywords.filter(k =>
      improved.toLowerCase().includes(k.toLowerCase()) &&
      !weakBullet.original.toLowerCase().includes(k.toLowerCase())
    );

    improvements.push({
      original: weakBullet.original,
      improved,
      improvements: weakBullet.reasons,
      keywordsAdded
    });

    // Replace in text
    optimizedText = optimizedText.replace(weakBullet.original, improved);
  }

  // Calculate final score
  const finalScore = calculateScore(optimizedText);

  return {
    originalText: resumeText,
    optimizedText,
    bulletsOptimized: improvements.length,
    keywordsInjected: improvements.reduce((sum, imp) => sum + imp.keywordsAdded.length, 0),
    improvements,
    score: {
      before: initialScore,
      after: finalScore,
      improvement: finalScore - initialScore
    }
  };
}
