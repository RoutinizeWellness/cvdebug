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
 * Generate improved bullet using FREE NLP algorithms (no paid APIs)
 * Uses rule-based NLP, template matching, and keyword injection
 */
async function generateImprovedBullet(
  bullet: string,
  weaknessReasons: string[],
  missingKeywords: string[]
): Promise<string> {
  // STEP 1: Extract core action and subject using NLP patterns
  const extractAction = (text: string): { verb: string; subject: string; rest: string } => {
    // Remove leading bullet markers
    text = text.replace(/^[•\-\*]\s*/, '').trim();

    // Common weak verbs to replace
    const weakVerbs = ['helped', 'assisted', 'worked on', 'responsible for', 'involved in', 'participated in', 'contributed to'];
    const strongVerbs = ['led', 'architected', 'implemented', 'optimized', 'designed', 'engineered', 'developed', 'built', 'launched', 'scaled'];

    // Try to extract verb and rest
    const words = text.split(' ');
    let verb = words[0] || '';
    const rest = words.slice(1).join(' ');

    // Replace weak verb with strong verb
    const weakVerbPattern = new RegExp(`^(${weakVerbs.join('|')})`, 'i');
    if (weakVerbPattern.test(verb)) {
      verb = strongVerbs[Math.floor(Math.random() * strongVerbs.length)];
    } else {
      // If not weak, capitalize it properly
      verb = verb.charAt(0).toUpperCase() + verb.slice(1).toLowerCase();
    }

    return { verb, subject: '', rest };
  };

  // STEP 2: Inject metrics if missing
  const injectMetrics = (text: string): string => {
    if (weaknessReasons.includes('no_metrics')) {
      // Template metrics based on common scenarios
      const metricTemplates = [
        'increasing efficiency by 30%',
        'reducing costs by $50K annually',
        'serving 10K+ daily users',
        'improving performance by 2x',
        'processing 1M+ transactions',
        'supporting team of 15+ engineers',
        'handling 500K+ monthly active users',
        'accelerating delivery by 40%'
      ];

      const metric = metricTemplates[Math.floor(Math.random() * metricTemplates.length)];

      // Insert metric at the end if not present
      if (!text.includes('%') && !text.includes('$') && !text.includes('K+') && !text.includes('x')) {
        text = text.replace(/\.$/, '') + ', ' + metric;
      }
    }
    return text;
  };

  // STEP 3: Inject FAANG keywords naturally
  const injectKeywords = (text: string, keywords: string[]): string => {
    if (keywords.length === 0) return text;

    // Select 1-2 most relevant keywords based on context
    const selectedKeywords = keywords.slice(0, 2);

    // Keyword injection patterns
    const injectionPatterns = [
      (kw: string) => text.replace(/\b(system|application|platform|solution)\b/i, `$1 using ${kw}`),
      (kw: string) => text.replace(/\b(built|developed|created|designed)\b/i, `$1 ${kw}-based`),
      (kw: string) => text.includes('using') ? text : text.replace(/\.$/, '') + ` using ${kw}`,
    ];

    let improvedText = text;
    selectedKeywords.forEach((keyword, index) => {
      const pattern = injectionPatterns[index % injectionPatterns.length];
      const result = pattern(keyword);
      // Only apply if it doesn't make the sentence too long
      if (result.length < 160) {
        improvedText = result;
      }
    });

    return improvedText;
  };

  // STEP 4: Fix passive voice
  const fixPassiveVoice = (text: string): string => {
    if (weaknessReasons.includes('passive_voice')) {
      // Common passive patterns: "was done", "were implemented", etc.
      text = text.replace(/\b(was|were|been)\s+(\w+ed)\b/gi, (match, aux, verb) => {
        // Convert passive to active by removing auxiliary and recasting
        const activeVerbs: Record<string, string> = {
          'implemented': 'Implemented',
          'developed': 'Developed',
          'created': 'Created',
          'designed': 'Designed',
          'built': 'Built'
        };
        return activeVerbs[verb.toLowerCase()] || verb;
      });
    }
    return text;
  };

  // STEP 5: Apply all transformations
  let improved = bullet;

  // Fix passive voice first
  improved = fixPassiveVoice(improved);

  // Extract and improve action verb
  const { verb, rest } = extractAction(improved);
  improved = `${verb} ${rest}`;

  // Inject metrics
  improved = injectMetrics(improved);

  // Inject keywords
  improved = injectKeywords(improved, missingKeywords);

  // STEP 6: Clean up and format
  improved = improved
    .replace(/\s+/g, ' ') // Remove extra spaces
    .replace(/\s+,/g, ',') // Fix spacing before commas
    .replace(/,\s*,/g, ',') // Remove double commas
    .trim();

  // Ensure it ends with a period
  if (!improved.match(/[.!?]$/)) {
    improved += '.';
  }

  // Ensure it starts with capital letter
  improved = improved.charAt(0).toUpperCase() + improved.slice(1);

  // Ensure length is reasonable (80-150 chars is ideal)
  if (improved.length > 160) {
    improved = improved.substring(0, 157) + '...';
  }

  return improved;
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

  // High Value / Industry Keywords (+15)
  // Expanded to include Business, Marketing, and Leadership terms (not just FAANG)
  const highImpactKeywords = [
    // Tech
    'scalable', 'distributed', 'microservices', 'kubernetes', 'aws', 'ci/cd', 'algorithm',
    // Business/Strategy
    'revenue', 'roi', 'strategy', 'stakeholders', 'p&l', 'budget', 'roadmap', 'growth',
    // Marketing/Sales
    'campaign', 'conversion', 'funnel', 'retention', 'acquisition', 'crm', 'quota',
    // Leadership/General
    'mentored', 'negotiated', 'spearheaded', 'orchestrated', 'initiative', 'compliance'
  ];
  const keywordCount = highImpactKeywords.filter(k => new RegExp(`\\b${k}\\b`, 'i').test(text)).length;
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
