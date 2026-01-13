import { v } from "convex/values";
import { query } from "./_generated/server";

// Advanced weighted patterns for weak phrases with severity scores
const WEAK_PATTERNS = [
  // Passive verbs (CRITICAL - worst offenders)
  { pattern: /\b(?:responsible\s+for|in\s+charge\s+of)\b/gi, severity: 10, category: "passive", replacement: "Led, Managed, Drove" },
  { pattern: /\b(?:assisted\s+(?:with|in)|helped\s+(?:with|to))\b/gi, severity: 9, category: "passive", replacement: "Supported, Enabled, Partnered" },
  { pattern: /\b(?:worked\s+on|worked\s+with)\b/gi, severity: 9, category: "passive", replacement: "Built, Developed, Implemented" },
  { pattern: /\b(?:involved\s+in|participated\s+in)\b/gi, severity: 8, category: "passive", replacement: "Contributed, Executed, Delivered" },
  { pattern: /\b(?:contributed\s+to|duties\s+included|tasked\s+with)\b/gi, severity: 8, category: "passive", replacement: "Achieved, Accomplished, Delivered" },

  // Vague quantifiers (HIGH priority)
  { pattern: /\b(?:various|several|multiple|numerous)\b/gi, severity: 7, category: "vague", replacement: "X projects, Y clients, Z systems" },
  { pattern: /\b(?:some|many|a\s+lot\s+of)\b/gi, severity: 6, category: "vague", replacement: "specific numbers (5, 10, 15+)" },

  // Weak qualifiers (MEDIUM-HIGH)
  { pattern: /\b(?:tried\s+to|attempted\s+to|sought\s+to)\b/gi, severity: 7, category: "qualifier", replacement: "Successfully executed, Achieved" },
  { pattern: /\b(?:focused\s+on|concentrated\s+on)\b/gi, severity: 5, category: "qualifier", replacement: "Delivered, Executed, Completed" },

  // Corporate jargon without substance
  { pattern: /\b(?:synergy|synergies|synergize)\b/gi, severity: 6, category: "jargon", replacement: "collaborated, unified, integrated" },
  { pattern: /\b(?:leverage|leveraging)\b/gi, severity: 5, category: "jargon", replacement: "used, utilized (with metrics)" },
  { pattern: /\b(?:facilitate|facilitating)\b/gi, severity: 5, category: "jargon", replacement: "enabled, streamlined" },
  { pattern: /\b(?:utilize|utilization)\b/gi, severity: 4, category: "jargon", replacement: "used, applied" },

  // Empty descriptors (clichés)
  { pattern: /\b(?:hard\s+worker|hardworking)\b/gi, severity: 8, category: "cliche", replacement: "quantify your work ethic with metrics" },
  { pattern: /\b(?:team\s+player|good\s+team\s+player)\b/gi, severity: 8, category: "cliche", replacement: "collaborated with X-person team" },
  { pattern: /\b(?:fast\s+learner|quick\s+learner)\b/gi, severity: 7, category: "cliche", replacement: "mastered X in Y weeks/months" },
  { pattern: /\b(?:detail[\s-]oriented|detail[\s-]focused)\b/gi, severity: 7, category: "cliche", replacement: "reduced errors by X%" },
  { pattern: /\b(?:results[\s-]driven|results[\s-]oriented)\b/gi, severity: 7, category: "cliche", replacement: "achieved X% improvement" },
  { pattern: /\b(?:self[\s-]starter|self[\s-]motivated)\b/gi, severity: 6, category: "cliche", replacement: "initiated X projects independently" },
  { pattern: /\b(?:go[\s-]getter|go\s+getter)\b/gi, severity: 8, category: "cliche", replacement: "proactively delivered X outcomes" },
  { pattern: /\b(?:think\s+outside\s+(?:the\s+)?box|out\s+of\s+the\s+box)\b/gi, severity: 7, category: "cliche", replacement: "innovated, pioneered unique solution" },
  { pattern: /\b(?:excellent\s+(?:communication|written|verbal)\s+skills)\b/gi, severity: 7, category: "cliche", replacement: "presented to X stakeholders" },

  // Weak action starters
  { pattern: /\b(?:coordinated\s+with|liaised\s+with|interfaced\s+with)\b/gi, severity: 5, category: "weak_action", replacement: "partnered, collaborated, aligned" },
  { pattern: /\b(?:in\s+collaboration\s+with|working\s+alongside)\b/gi, severity: 4, category: "weak_action", replacement: "partnered with X to achieve Y" },
];

// Verbos de acción fuertes sugeridos
const POWER_VERBS = {
  technical: [
    "Engineered", "Architected", "Developed", "Built", "Deployed",
    "Optimized", "Automated", "Integrated", "Implemented", "Designed"
  ],
  leadership: [
    "Led", "Directed", "Spearheaded", "Orchestrated", "Championed",
    "Drove", "Managed", "Mentored", "Coached", "Transformed"
  ],
  analytical: [
    "Analyzed", "Evaluated", "Assessed", "Quantified", "Measured",
    "Forecasted", "Modeled", "Researched", "Investigated", "Examined"
  ],
  results: [
    "Achieved", "Increased", "Reduced", "Improved", "Accelerated",
    "Grew", "Expanded", "Generated", "Delivered", "Exceeded"
  ],
  creative: [
    "Designed", "Created", "Crafted", "Conceptualized", "Innovated",
    "Pioneered", "Launched", "Introduced", "Established", "Initiated"
  ]
};

// Calculate sentence-level impact score
function calculateSentenceImpact(sentence: string): number {
  let score = 0;

  // Check for quantifiable metrics (positive signals)
  const metricPatterns = [
    /\d+%/g,                                    // Percentages: +3 each
    /\$[\d,]+(?:k|m|b)?/gi,                    // Money: +4 each
    /\d+[+]?\s*(?:users|customers|clients)/gi, // User counts: +3 each
    /\d+x\s+(?:faster|better|improvement)/gi,  // Multipliers: +4 each
  ];

  metricPatterns.forEach(pattern => {
    const matches = sentence.match(pattern);
    if (matches) score += matches.length * 3;
  });

  // Check for strong action verbs (positive signals)
  const strongVerbPattern = /\b(?:led|built|engineered|architected|scaled|optimized|achieved|delivered|increased|reduced|launched|designed|implemented)\b/gi;
  const strongVerbs = sentence.match(strongVerbPattern);
  if (strongVerbs) score += strongVerbs.length * 2;

  return score;
}

// Extract contextual snippet around a match for better analysis
function extractContext(text: string, matchIndex: number, matchLength: number, contextLength: number = 100): string {
  const start = Math.max(0, matchIndex - contextLength);
  const end = Math.min(text.length, matchIndex + matchLength + contextLength);
  return text.substring(start, end);
}

export const analyzeFluff = query({
  args: {
    resumeId: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.resumeId);
    if (!resume) {
      throw new Error("Resume not found");
    }

    const originalText = resume.ocrText || "";
    const text = originalText.toLowerCase();

    if (!text) {
      return {
        fluffScore: 0,
        totalWords: 0,
        weakPhrases: [],
        suggestions: [],
        fluffPercentage: 0,
        severity: "good" as const,
      };
    }

    // Advanced pattern-based detection with weighted severity
    const detectedFluff: Array<{
      phrase: string;
      count: number;
      positions: number[];
      replacement: string;
      severity: number;
      category: string;
      contexts: string[];
    }> = [];

    let totalWeightedFluff = 0;

    for (const { pattern, severity, category, replacement } of WEAK_PATTERNS) {
      const matches = [...originalText.matchAll(pattern)];

      if (matches.length > 0) {
        const positions: number[] = [];
        const contexts: string[] = [];

        matches.forEach(match => {
          if (match.index !== undefined) {
            positions.push(match.index);
            // Extract context for each match
            const context = extractContext(originalText, match.index, match[0].length, 80);
            contexts.push(context);
          }
        });

        // Calculate weighted impact based on severity and frequency
        const weightedImpact = severity * matches.length;
        totalWeightedFluff += weightedImpact;

        detectedFluff.push({
          phrase: matches[0][0], // First match to preserve original case
          count: matches.length,
          positions,
          replacement,
          severity,
          category,
          contexts,
        });
      }
    }

    // Advanced metrics calculation with weighted scoring
    const totalWords = text.split(/\s+/).filter(w => w.length > 0).length;
    const totalFluffWords = detectedFluff.reduce((sum, item) =>
      sum + (item.phrase.split(/\s+/).length * item.count), 0
    );

    // Calculate weighted fluff score (0-100, where 100 is perfect)
    const maxPossibleFluff = 200; // Theoretical maximum weighted fluff
    const normalizedFluffScore = Math.max(0, 100 - (totalWeightedFluff / maxPossibleFluff) * 100);

    // Simple percentage for display
    const fluffPercentage = Math.round((totalFluffWords / totalWords) * 100);

    // Determine severity using weighted score
    let severity: "good" | "warning" | "critical";
    if (normalizedFluffScore >= 85) {
      severity = "good";
    } else if (normalizedFluffScore >= 60) {
      severity = "warning";
    } else {
      severity = "critical";
    }

    // Group fluff by category for better insights
    const categoryStats: Record<string, { count: number; severity: number }> = {};
    detectedFluff.forEach(item => {
      if (!categoryStats[item.category]) {
        categoryStats[item.category] = { count: 0, severity: 0 };
      }
      categoryStats[item.category].count += item.count;
      categoryStats[item.category].severity += item.severity * item.count;
    });

    // Generate smart, prioritized suggestions based on category impact
    const suggestions = [];

    // Sort categories by total impact (severity * count)
    const sortedCategories = Object.entries(categoryStats)
      .map(([cat, stats]) => ({ category: cat, ...stats }))
      .sort((a, b) => b.severity - a.severity);

    // Generate category-specific suggestions
    if (categoryStats.passive && categoryStats.passive.count > 0) {
      suggestions.push({
        title: "Critical: Eliminate Passive Language",
        description: `Found ${categoryStats.passive.count} passive phrases. These are the #1 resume killer.`,
        action: "Replace with: Led, Managed, Built, Developed, Implemented",
        priority: "critical",
        impact: categoryStats.passive.severity,
      });
    }

    if (categoryStats.cliche && categoryStats.cliche.count > 0) {
      suggestions.push({
        title: "Remove Empty Clichés",
        description: `Found ${categoryStats.cliche.count} cliché phrases. Recruiters ignore these completely.`,
        action: "Replace with quantifiable achievements (e.g., 'reduced bugs by 40%' instead of 'detail-oriented')",
        priority: "high",
        impact: categoryStats.cliche.severity,
      });
    }

    if (categoryStats.vague && categoryStats.vague.count > 0) {
      suggestions.push({
        title: "Be Specific with Quantifiers",
        description: `Found ${categoryStats.vague.count} vague terms. Recruiters need exact numbers.`,
        action: "Replace 'various' with '8 projects', 'several' with '5 departments', etc.",
        priority: "high",
        impact: categoryStats.vague.severity,
      });
    }

    if (categoryStats.qualifier && categoryStats.qualifier.count > 0) {
      suggestions.push({
        title: "Remove Weak Qualifiers",
        description: `Found ${categoryStats.qualifier.count} weak qualifiers that undermine your achievements.`,
        action: "Replace 'tried to' with 'achieved', 'focused on' with 'delivered'",
        priority: "medium",
        impact: categoryStats.qualifier.severity,
      });
    }

    if (categoryStats.jargon && categoryStats.jargon.count > 0) {
      suggestions.push({
        title: "Replace Corporate Jargon",
        description: `Found ${categoryStats.jargon.count} jargon terms without substance.`,
        action: "Use concrete verbs with metrics instead of buzzwords",
        priority: "medium",
        impact: categoryStats.jargon.severity,
      });
    }

    // Calculate positive signal strength (metrics and strong verbs)
    const sentences = originalText.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const totalImpactScore = sentences.reduce((sum, sentence) => sum + calculateSentenceImpact(sentence), 0);
    const avgImpactPerSentence = sentences.length > 0 ? totalImpactScore / sentences.length : 0;

    // Categorize power verbs for suggestions
    const powerVerbSuggestions = Object.entries(POWER_VERBS).map(([category, verbs]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      verbs: verbs.slice(0, 5),
    }));

    // Generate contextual message
    let message: string;
    if (normalizedFluffScore >= 90) {
      message = "Excellent! Your resume uses strong, impactful language. Minimal fluff detected.";
    } else if (normalizedFluffScore >= 75) {
      message = "Good! Your resume is mostly strong, but a few weak phrases could be improved.";
    } else if (normalizedFluffScore >= 50) {
      message = `Warning: Your resume has ${detectedFluff.length} weak phrases. This could reduce interview callbacks by 30-40%.`;
    } else {
      message = `Critical: Your resume is full of weak language (${detectedFluff.length} issues). This is costing you interviews. Fix ASAP.`;
    }

    return {
      fluffScore: Math.round(normalizedFluffScore),
      totalWords,
      weakPhrases: detectedFluff.sort((a, b) => b.severity - a.severity), // Sort by severity
      suggestions: suggestions.sort((a, b) => (b.impact || 0) - (a.impact || 0)), // Sort by impact
      fluffPercentage,
      severity,
      powerVerbCategories: powerVerbSuggestions,
      categoryBreakdown: sortedCategories,
      impactMetrics: {
        totalImpactScore,
        avgImpactPerSentence: Math.round(avgImpactPerSentence * 10) / 10,
        sentenceCount: sentences.length,
      },
      message,
    };
  },
});
