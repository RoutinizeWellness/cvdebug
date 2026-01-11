import { v } from "convex/values";
import { query } from "./_generated/server";

// Lista de palabras/frases débiles que los reclutadores odian
const WEAK_PHRASES = [
  // Passive verbs
  "responsible for",
  "assisted with",
  "assisted in",
  "helped with",
  "helped to",
  "worked on",
  "worked with",
  "involved in",
  "participated in",
  "contributed to",
  "duties included",
  "tasked with",

  // Vague terms
  "various",
  "several",
  "multiple",
  "some",
  "many",

  // Weak qualifiers
  "tried to",
  "attempted to",
  "helped to",

  // Corporate jargon (sin sustancia)
  "synergy",
  "leverage",
  "facilitate",
  "utilize",
  "interface",

  // Empty descriptors
  "hard worker",
  "team player",
  "fast learner",
  "detail oriented",
  "results driven",
  "self starter",
  "go getter",
  "out of the box",
  "think outside the box",
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

export const analyzeFluff = query({
  args: {
    resumeId: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.resumeId);
    if (!resume) {
      throw new Error("Resume not found");
    }

    const text = (resume.ocrText || "").toLowerCase();
    const originalText = resume.ocrText || "";

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

    // Detectar todas las instancias de frases débiles
    const detectedFluff: Array<{
      phrase: string;
      count: number;
      positions: number[];
      replacement: string;
    }> = [];

    for (const weakPhrase of WEAK_PHRASES) {
      const regex = new RegExp(weakPhrase, 'gi');
      const matches = originalText.match(regex);

      if (matches && matches.length > 0) {
        // Encontrar todas las posiciones
        const positions: number[] = [];
        let pos = text.indexOf(weakPhrase);
        while (pos !== -1) {
          positions.push(pos);
          pos = text.indexOf(weakPhrase, pos + 1);
        }

        // Sugerir reemplazo basado en el tipo de frase
        let replacement = "";
        if (weakPhrase.includes("responsible") || weakPhrase.includes("worked")) {
          replacement = "Use power verbs: Led, Developed, Managed, Implemented";
        } else if (weakPhrase.includes("helped") || weakPhrase.includes("assisted")) {
          replacement = "Use: Supported, Enabled, Facilitated (with specific metrics)";
        } else if (weakPhrase.includes("various") || weakPhrase.includes("several")) {
          replacement = "Be specific: Replace with exact numbers";
        } else {
          replacement = "Use action verbs with measurable results";
        }

        detectedFluff.push({
          phrase: matches[0], // Mantener el caso original
          count: matches.length,
          positions,
          replacement,
        });
      }
    }

    // Calcular métricas
    const totalWords = text.split(/\s+/).length;
    const totalFluffWords = detectedFluff.reduce((sum, item) =>
      sum + (item.phrase.split(' ').length * item.count), 0
    );
    const fluffPercentage = Math.round((totalFluffWords / totalWords) * 100);

    // Determinar severidad
    let severity: "good" | "warning" | "critical";
    if (fluffPercentage < 5) {
      severity = "good";
    } else if (fluffPercentage < 15) {
      severity = "warning";
    } else {
      severity = "critical";
    }

    // Generar sugerencias específicas
    const suggestions = [];

    if (fluffPercentage > 0) {
      suggestions.push({
        title: "Replace Weak Verbs with Power Verbs",
        description: `Found ${detectedFluff.length} weak phrases. Recruiters skip these immediately.`,
        action: "See highlighted phrases below",
      });
    }

    if (detectedFluff.some(f => f.phrase.toLowerCase().includes("responsible"))) {
      suggestions.push({
        title: "Never start with 'Responsible for'",
        description: "This is the #1 resume killer. Start with action verbs that show impact.",
        action: "Change to: Led, Managed, Drove, Implemented",
      });
    }

    if (detectedFluff.some(f => f.phrase.toLowerCase().includes("various") || f.phrase.toLowerCase().includes("several"))) {
      suggestions.push({
        title: "Be Specific with Numbers",
        description: "'Various' and 'several' are vague. Recruiters want exact metrics.",
        action: "Replace with: '8 projects', '15 team members', '3 departments'",
      });
    }

    // Sugerir categorías de verbos de acción
    const powerVerbSuggestions = Object.entries(POWER_VERBS).map(([category, verbs]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      verbs: verbs.slice(0, 5), // Top 5 por categoría
    }));

    return {
      fluffScore: 100 - fluffPercentage, // Puntuación inversa (más alto = mejor)
      totalWords,
      weakPhrases: detectedFluff,
      suggestions,
      fluffPercentage,
      severity,
      powerVerbCategories: powerVerbSuggestions,
      message: fluffPercentage === 0
        ? "Perfect! No fluff detected. Your resume uses strong action verbs."
        : fluffPercentage < 5
        ? "Good! Only minor fluff detected."
        : fluffPercentage < 15
        ? "Warning: Your resume has noticeable fluff. Recruiters might skip it."
        : "Critical: Your resume is full of weak language. This is costing you interviews.",
    };
  },
});
