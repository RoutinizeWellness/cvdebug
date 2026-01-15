import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Lightbulb, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface WeakBullet {
  original: string;
  suggestions: Array<{
    type: 'volume' | 'efficiency' | 'money';
    improved: string;
    explanation: string;
  }>;
}

interface WeakBulletSuggestionsProps {
  resumeId: Id<"resumes">;
  ocrText: string;
  metricsCount: number;
  isPaidUser?: boolean;
}

export function WeakBulletSuggestions({ resumeId, ocrText, metricsCount, isPaidUser = false }: WeakBulletSuggestionsProps) {
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [currentBulletIndex, setCurrentBulletIndex] = useState(0);
  const [isApplying, setIsApplying] = useState(false);
  const updateResumeText = useMutation(api.resumes.updateResumeText);

  // Advanced weak bullet detection with statistical scoring
  const detectWeakBullets = (text: string): WeakBullet[] => {
    if (!text) return [];

    // Enhanced sentence splitting with better bullet point detection
    const bulletPatterns = [
      /^[•\-\*]\s*.+/gm,           // Traditional bullets
      /^\d+\.\s*.+/gm,              // Numbered lists
      /(?:^|\n)[A-Z][^.!?\n]{20,200}(?:[.!?]|$)/g  // Sentences starting with capital
    ];

    let sentences: string[] = [];
    bulletPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        sentences.push(...matches.map(s => s.replace(/^[•\-\*\d]+\.\s*/, '').trim()));
      }
    });

    // Fallback to line-based splitting if no bullets found
    if (sentences.length === 0) {
      sentences = text
        .split(/[\n]/)
        .map(s => s.trim())
        .filter(s => s.length > 20 && s.length < 250);
    }

    // CRITICAL: Filter out personal information that isn't bullet points
    const personalInfoPatterns = [
      /\b(?:us\s+citizen|citizenship|authorized\s+to\s+work|work\s+authorization)\b/gi,
      /\b(?:visa\s+status|green\s+card|h1b|permanent\s+resident)\b/gi,
      /\b(?:email|phone|address|location|city|state|zip)[:]/gi,
      /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi, // Emails
      /\b(?:\d{3}[-.]?\d{3}[-.]?\d{4})\b/g, // Phone numbers
      /\b(?:bachelor|master|phd|degree|university|college|gpa)\b.*(?:in|of)/gi,
      /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}\s*[-–]\s*(?:present|current|now|\w+\s+\d{4})/gi,
    ];

    sentences = sentences.filter(sentence => {
      // Filter out lines that are primarily personal information
      return !personalInfoPatterns.some(pattern => {
        const matches = sentence.match(pattern);
        return matches && matches.join('').length > sentence.length * 0.3; // >30% is personal info
      });
    });

    // Score each sentence based on weakness (higher score = weaker)
    interface ScoredBullet {
      text: string;
      weaknessScore: number;
      reasons: string[];
    }

    const scoredBullets: ScoredBullet[] = sentences
      .map(sentence => {
        let score = 0;
        const reasons: string[] = [];

        // CRITICAL: No quantifiable metrics (highest penalty)
        const hasNumbers = /\d+/.test(sentence);
        const hasPercentage = /\d+%/.test(sentence);
        const hasMoney = /\$[\d,]+/.test(sentence);
        const hasScale = /\d+[kmb]?\+?\s*(?:users|customers|clients|servers|records|requests)/i.test(sentence);

        if (!hasNumbers && !hasPercentage && !hasMoney && !hasScale) {
          score += 10;
          reasons.push("no_metrics");
        }

        // HIGH: Contains passive/weak verbs
        const weakVerbPatterns = [
          /\b(?:responsible\s+for|worked\s+on|helped\s+with|assisted\s+in|involved\s+in)\b/i,
          /\b(?:participated|contributed|coordinated|collaborated)\b/i
        ];
        weakVerbPatterns.forEach(pattern => {
          if (pattern.test(sentence)) {
            score += 5;
            reasons.push("weak_verbs");
          }
        });

        // MEDIUM: Vague quantifiers
        if (/\b(?:various|several|multiple|many|some)\b/i.test(sentence)) {
          score += 4;
          reasons.push("vague_quantifiers");
        }

        // MEDIUM: No strong action verbs at start
        const strongVerbPattern = /^(?:Led|Built|Engineered|Architected|Scaled|Optimized|Achieved|Delivered|Increased|Reduced|Launched|Designed|Implemented|Created|Developed|Managed)\b/i;
        if (!strongVerbPattern.test(sentence.trim())) {
          score += 3;
          reasons.push("no_strong_verb");
        }

        // LOW: Too short (likely incomplete)
        if (sentence.split(/\s+/).length < 8) {
          score += 2;
          reasons.push("too_short");
        }

        // BONUS: Deduct points for strong signals
        if (hasPercentage || hasMoney) score -= 3;
        if (/\b(?:reduced|increased|improved|achieved|delivered)\b/i.test(sentence)) score -= 2;

        return {
          text: sentence,
          weaknessScore: score,
          reasons
        };
      })
      .filter(bullet => bullet.weaknessScore > 5 && bullet.text.split(/\s+/).length >= 5); // Only truly weak bullets

    // Sort by weakness (highest first) and return top 3
    const weakestBullets = scoredBullets
      .sort((a, b) => b.weaknessScore - a.weaknessScore)
      .slice(0, 3);

    return weakestBullets.map(bullet => ({
      original: bullet.text,
      suggestions: generateSuggestions(bullet.text)
    }));
  };

  // STEP 0: Extract real data from user's bullet for personalized suggestions
  const extractRealDataFromBullet = (bullet: string): {
    technologies: string[];
    actions: string[];
    numbers: Array<{ value: number; context: string }>;
    teamSize: number | null;
    timeframe: string | null;
    hasExistingMetrics: boolean;
    coreActivity: string;
  } => {
    // Extract technologies mentioned
    const techPatterns = [
      /\b(?:react|angular|vue|svelte|next\.?js|node\.?js|express|django|flask|spring|rails)\b/gi,
      /\b(?:python|javascript|typescript|java|c\+\+|go|rust|php|ruby|swift|kotlin)\b/gi,
      /\b(?:aws|azure|gcp|docker|kubernetes|jenkins|github|gitlab|terraform)\b/gi,
      /\b(?:sql|mysql|postgres|mongodb|redis|elasticsearch|cassandra|dynamodb)\b/gi,
      /\b(?:rest|graphql|api|microservices|serverless|lambda)\b/gi,
    ];

    const technologies: string[] = [];
    techPatterns.forEach(pattern => {
      const matches = bullet.match(pattern);
      if (matches) {
        technologies.push(...matches.map(m => m.toLowerCase()));
      }
    });

    // Extract action verbs used
    const actionPatterns = [
      /\b(built|developed|created|designed|implemented|engineered|architected)\b/gi,
      /\b(led|managed|coordinated|mentored|guided|supervised)\b/gi,
      /\b(improved|optimized|enhanced|upgraded|refactored|modernized)\b/gi,
      /\b(deployed|launched|released|delivered|shipped)\b/gi,
      /\b(automated|streamlined|simplified|consolidated)\b/gi,
    ];

    const actions: string[] = [];
    actionPatterns.forEach(pattern => {
      const matches = bullet.match(pattern);
      if (matches) {
        actions.push(...matches.map(m => m.toLowerCase()));
      }
    });

    // Extract numbers and their context
    const numbers: Array<{ value: number; context: string }> = [];

    // Percentages
    const percentMatches = bullet.matchAll(/(\d+)%/g);
    for (const match of percentMatches) {
      numbers.push({ value: parseInt(match[1]), context: 'percentage' });
    }

    // Money
    const moneyMatches = bullet.matchAll(/\$(\d+(?:,\d{3})*(?:\.\d+)?)\s*([kmb])?/gi);
    for (const match of moneyMatches) {
      let value = parseFloat(match[1].replace(/,/g, ''));
      const multiplier = match[2]?.toLowerCase();
      if (multiplier === 'k') value *= 1000;
      if (multiplier === 'm') value *= 1000000;
      if (multiplier === 'b') value *= 1000000000;
      numbers.push({ value, context: 'money' });
    }

    // Scale numbers (users, systems, etc.)
    const scaleMatches = bullet.matchAll(/(\d+(?:,\d{3})*)[+]?\s*(?:users|customers|clients|systems|servers|requests|records|people|members)/gi);
    for (const match of scaleMatches) {
      numbers.push({ value: parseInt(match[1].replace(/,/g, '')), context: 'scale' });
    }

    // Team size
    let teamSize: number | null = null;
    const teamMatch = bullet.match(/team\s+of\s+(\d+)/i);
    if (teamMatch) {
      teamSize = parseInt(teamMatch[1]);
    }

    // Timeframe
    let timeframe: string | null = null;
    const timeMatches = bullet.match(/(?:in|within|over)\s+(\d+)\s+(days?|weeks?|months?|years?)/i);
    if (timeMatches) {
      timeframe = `${timeMatches[1]} ${timeMatches[2]}`;
    }

    // Check if bullet already has metrics
    const hasExistingMetrics = numbers.length > 0 || /%|\$/.test(bullet);

    // Extract core activity (the main thing being done)
    const coreActivity = bullet
      .replace(/^[A-Z][a-z]+(?:ed)?\s*/i, '') // Remove verb
      .split(/[,;]/)[0] // Get first clause
      .trim()
      .toLowerCase();

    return {
      technologies: [...new Set(technologies)], // Remove duplicates
      actions: [...new Set(actions)],
      numbers,
      teamSize,
      timeframe,
      hasExistingMetrics,
      coreActivity,
    };
  };

  // STEP 1: Sanitize and validate the bullet before generating suggestions
  const sanitizeBullet = (bullet: string): { cleaned: string; verb: string; isValid: boolean } => {
    // Remove noise patterns that shouldn't be in bullet points
    const noisePatterns = [
      /\b(?:us\s+citizen|citizenship|authorized\s+to\s+work|work\s+authorization)\b/gi,
      /\b(?:visa\s+status|green\s+card|h1b|permanent\s+resident)\b/gi,
      /\b(?:email|phone|address|location|city|state|zip)\b/gi,
      /\b(?:linkedin|github|portfolio|website)\b/gi,
      /\b(?:bachelor|master|degree|university|gpa)\b/gi,
      /\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\b/gi,
      /\b(?:\d{3}[-.]?\d{3}[-.]?\d{4})\b/g, // Phone numbers
      /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi, // Emails
    ];

    let cleaned = bullet;
    noisePatterns.forEach(pattern => {
      cleaned = cleaned.replace(pattern, '');
    });

    // Clean up extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    // Extract the action verb (first word, typically)
    const verbMatch = cleaned.match(/^([A-Z][a-z]+(?:ed)?)/);
    const verb = verbMatch ? verbMatch[1] : 'Worked on';

    // Check if bullet is valid (has meaningful content, not just noise)
    const wordCount = cleaned.split(/\s+/).filter(w => w.length > 2).length;
    const isValid = wordCount >= 3 && cleaned.length >= 15;

    return { cleaned, verb, isValid };
  };

  // Generate 3 types of metric suggestions with advanced context detection
  const generateSuggestions = (bullet: string): WeakBullet['suggestions'] => {
    // CRITICAL: Sanitize the bullet first to avoid hallucinations
    const sanitized = sanitizeBullet(bullet);

    // If bullet is invalid (mostly noise), return generic suggestions
    if (!sanitized.isValid) {
      return [
        {
          type: 'volume',
          improved: 'Led cross-functional initiatives impacting 15+ team members across 3 major product lines',
          explanation: 'Scale metrics: Team size and project count show organizational impact'
        },
        {
          type: 'efficiency',
          improved: 'Improved team productivity by 40% through process optimization and automation',
          explanation: 'Efficiency metrics: Productivity gains demonstrate process improvement'
        },
        {
          type: 'money',
          improved: 'Delivered projects on $200K budget with 15% cost savings and zero overruns',
          explanation: 'Financial responsibility: Budget management shows fiscal discipline'
        }
      ];
    }

    const lowerBullet = sanitized.cleaned.toLowerCase();

    // Multi-factor context detection with weighted scoring
    interface Context {
      name: string;
      score: number;
      patterns: RegExp[];
    }

    const contexts: Context[] = [
      {
        name: 'database',
        score: 0,
        patterns: [
          /\b(?:database|sql|mysql|postgres|mongodb|nosql|query|schema)\b/gi,
          /\b(?:data|records?|storage|migration|replication)\b/gi,
          /\b(?:orm|transaction|index|optimization)\b/gi
        ]
      },
      {
        name: 'web',
        score: 0,
        patterns: [
          /\b(?:website|web\s*app|application|frontend|backend|ui|ux)\b/gi,
          /\b(?:api|rest|graphql|endpoint|service)\b/gi,
          /\b(?:react|angular|vue|node|express|django)\b/gi
        ]
      },
      {
        name: 'infrastructure',
        score: 0,
        patterns: [
          /\b(?:cloud|aws|azure|gcp|kubernetes|docker|container)\b/gi,
          /\b(?:ci\/cd|devops|pipeline|deployment|infrastructure)\b/gi,
          /\b(?:server|network|hosting|scaling|load\s*balanc)/gi
        ]
      },
      {
        name: 'analytics',
        score: 0,
        patterns: [
          /\b(?:analytics|metrics|data\s*science|machine\s*learning|ml|ai)\b/gi,
          /\b(?:analysis|insights|dashboard|visualization|reporting)\b/gi,
          /\b(?:python|pandas|numpy|tensorflow|model)\b/gi
        ]
      },
      {
        name: 'support',
        score: 0,
        patterns: [
          /\b(?:support|help|assist|maintain|troubleshoot|debug)\b/gi,
          /\b(?:customer|client|user\s*support|ticketing|incident)\b/gi,
          /\b(?:resolve|fix|repair|diagnose)\b/gi
        ]
      },
      {
        name: 'leadership',
        score: 0,
        patterns: [
          /\b(?:lead|led|manage[d]?|direct|supervise|coordinate)\b/gi,
          /\b(?:team|mentor|coach|train|guide)\b/gi,
          /\b(?:project\s*manage|scrum\s*master|tech\s*lead)\b/gi
        ]
      },
      {
        name: 'optimization',
        score: 0,
        patterns: [
          /\b(?:optimi[zs]e[d]?|improve[d]?|enhance[d]?)\b/gi,
          /\b(?:increase[d]?|decrease[d]?|reduce[d]?|boost|accelerate)\b/gi,
          /\b(?:performance|efficiency|speed|latency|throughput)\b/gi
        ]
      },
      {
        name: 'security',
        score: 0,
        patterns: [
          /\b(?:security|secure|authentication|authorization|oauth)\b/gi,
          /\b(?:encrypt|ssl|tls|certificate|firewall)\b/gi,
          /\b(?:vulnerability|penetration|audit|compliance)\b/gi
        ]
      }
    ];

    // Calculate context scores
    contexts.forEach(context => {
      context.patterns.forEach((pattern, index) => {
        const matches = bullet.match(pattern);
        if (matches) {
          // Earlier patterns have higher weight (more specific)
          const weight = 3 - index;
          context.score += matches.length * weight;
        }
      });
    });

    // Get top 2 contexts
    const topContexts = contexts
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map(c => c.name);

    const primaryContext = topContexts[0] || 'general';
    const secondaryContext = topContexts[1];

    // Detect action type for optimization suggestions
    const isOptimize = /\b(?:optimi[zs]e|improve|enhance|increase|reduce|decrease|boost|accelerate)\b/i.test(bullet);

    // CRITICAL: Extract real data from the user's bullet to personalize suggestions
    const extractedData = extractRealDataFromBullet(sanitized.cleaned);

    const suggestions: WeakBullet['suggestions'] = [];

    // Context-aware volume suggestions based on detected contexts
    const volumeMetrics: Record<string, { metric: string; explanation: string }> = {
      database: {
        metric: 'processing 5M+ records daily across 12 production servers with 99.9% uptime',
        explanation: 'Scale metrics: Data volume and server count show infrastructure scope'
      },
      web: {
        metric: 'serving 100K+ monthly active users with <200ms average response time',
        explanation: 'Traffic metrics: User count and performance demonstrate real-world impact'
      },
      infrastructure: {
        metric: 'managing 50+ microservices across 3 AWS regions with 99.95% availability',
        explanation: 'Infrastructure scale: Service count and multi-region deployment show complexity'
      },
      analytics: {
        metric: 'analyzing 2TB+ of data daily to generate insights for 500+ stakeholders',
        explanation: 'Data scale: Volume processed and stakeholder impact show business value'
      },
      support: {
        metric: 'supporting 200+ daily users across 5 time zones with <2hr response time',
        explanation: 'Support capacity: User count and SLA metrics demonstrate reliability'
      },
      leadership: {
        metric: 'leading a cross-functional team of 12 engineers across 3 product squads',
        explanation: 'Team scope: Team size and organizational structure show leadership scale'
      },
      security: {
        metric: 'protecting 1M+ user accounts and securing 500+ API endpoints',
        explanation: 'Security scope: User accounts and endpoints protected show responsibility'
      },
      general: {
        metric: 'impacting 15+ team members and 3 major product initiatives',
        explanation: 'Collaboration scale: Team size and project count show organizational impact'
      }
    };

    // PERSONALIZED METRIC GENERATION: Use extracted data to create real suggestions
    const generatePersonalizedMetric = (type: 'volume' | 'efficiency' | 'money'): { metric: string; explanation: string } => {
      const baseMetric = volumeMetrics[primaryContext] || volumeMetrics['general'];

      // If user already has some metrics, amplify them intelligently
      if (extractedData.hasExistingMetrics && extractedData.numbers.length > 0) {
        const existingNum = extractedData.numbers[0];

        if (type === 'volume') {
          if (extractedData.teamSize) {
            return {
              metric: `leading ${extractedData.teamSize} ${extractedData.teamSize > 5 ? 'engineers' : 'team members'} to deliver for ${Math.floor(existingNum.value * 1.5)}+ ${existingNum.context === 'scale' ? 'users' : 'stakeholders'}`,
              explanation: `Team leadership: ${extractedData.teamSize} person team impacting ${Math.floor(existingNum.value * 1.5)}+ ${existingNum.context}`
            };
          } else if (existingNum.context === 'scale') {
            return {
              metric: `scaling to ${Math.floor(existingNum.value * 2)}+ ${extractedData.coreActivity.includes('user') ? 'active users' : 'systems'} across ${Math.ceil(existingNum.value / 100000) || 3} regions`,
              explanation: `Scale achieved: Growing from ${existingNum.value} to ${Math.floor(existingNum.value * 2)}+ shows expansion`
            };
          }
        }

        if (type === 'efficiency' && existingNum.context === 'percentage') {
          const amplified = Math.min(95, Math.floor(existingNum.value * 1.3));
          return {
            metric: `improving ${extractedData.coreActivity || 'performance'} by ${amplified}% while reducing ${primaryContext === 'infrastructure' ? 'costs' : 'time'} by ${Math.floor(existingNum.value * 0.6)}%`,
            explanation: `Efficiency gain: ${amplified}% improvement with ${Math.floor(existingNum.value * 0.6)}% ${primaryContext === 'infrastructure' ? 'cost' : 'time'} reduction`
          };
        }

        if (type === 'money') {
          if (existingNum.context === 'money') {
            const amplified = Math.floor(existingNum.value * 1.4);
            const formatted = amplified >= 1000000 ? `$${(amplified / 1000000).toFixed(1)}M` : `$${(amplified / 1000).toFixed(0)}K`;
            return {
              metric: `generating ${formatted}+ in ${primaryContext === 'web' ? 'revenue' : 'cost savings'} and improving ${extractedData.coreActivity.includes('conversion') ? 'conversion' : 'efficiency'} by 25%`,
              explanation: `Financial impact: ${formatted} ${primaryContext === 'web' ? 'revenue' : 'savings'} demonstrates business value`
            };
          } else if (existingNum.context === 'percentage') {
            return {
              metric: `contributing to $${Math.floor(existingNum.value * 50)}K+ in annual revenue through ${existingNum.value}% improvement in ${extractedData.coreActivity || 'performance'}`,
              explanation: `ROI calculation: ${existingNum.value}% improvement translates to $${Math.floor(existingNum.value * 50)}K revenue impact`
            };
          }
        }
      }

      // If user has technologies, incorporate them
      if (extractedData.technologies.length > 0) {
        const tech1 = extractedData.technologies[0];
        const tech2 = extractedData.technologies[1] || '';

        if (type === 'volume') {
          return {
            metric: `using ${tech1}${tech2 ? ` and ${tech2}` : ''} to serve ${primaryContext === 'web' ? '50K+ users' : 'production workloads'} with 99.9% uptime`,
            explanation: `Technical implementation: ${tech1}${tech2 ? ` + ${tech2}` : ''} stack supports production scale`
          };
        } else if (type === 'efficiency') {
          return {
            metric: `leveraging ${tech1}${tech2 ? ` and ${tech2}` : ''} to reduce latency by 50% and improve throughput by 3x`,
            explanation: `Technology optimization: ${tech1}${tech2 ? ` + ${tech2}` : ''} enables performance gains`
          };
        } else if (type === 'money') {
          return {
            metric: `implementing ${tech1}${tech2 ? ` and ${tech2}` : ''} solution that saved $${primaryContext === 'infrastructure' ? '80' : '120'}K annually`,
            explanation: `Cost efficiency: ${tech1}${tech2 ? ` + ${tech2}` : ''} reduces operational expenses`
          };
        }
      }

      // If user mentioned team leadership, emphasize that
      if (extractedData.teamSize && type === 'money') {
        return {
          metric: `managing ${extractedData.teamSize}-person team delivering $${extractedData.teamSize * 150}K+ project under budget`,
          explanation: `Leadership ROI: ${extractedData.teamSize} team members × $${150}K average contribution`
        };
      }

      // Fallback to context-based defaults with some personalization
      if (type === 'efficiency') {
        return efficiencyMetrics[isOptimize ? 'optimization' : primaryContext] || efficiencyMetrics['general'];
      } else if (type === 'money') {
        return moneyMetrics[primaryContext] || moneyMetrics['general'];
      }

      return baseMetric;
    };

    const volumeMetric = generatePersonalizedMetric('volume');

    // CRITICAL FIX: Use sanitized bullet + reconstruct intelligently
    const cleanedBase = sanitized.cleaned.replace(/\.$/, '').trim();
    const hasTrailingComma = /[,;]$/.test(cleanedBase);
    const separator = hasTrailingComma ? ' ' : ', ';

    suggestions.push({
      type: 'volume',
      improved: `${sanitized.verb} ${cleanedBase.replace(/^[A-Z][a-z]+(?:ed)?\s*/i, '')}${separator}${volumeMetric.metric}`,
      explanation: volumeMetric.explanation
    });

    // Context-aware efficiency suggestions
    const efficiencyMetrics: Record<string, { metric: string; explanation: string }> = {
      database: {
        metric: 'reducing query latency by 45% and improving database throughput by 3x',
        explanation: 'Performance metrics: Latency and throughput are critical database KPIs'
      },
      web: {
        metric: 'improving page load speed by 60% (3.2s → 1.3s) and boosting conversion by 25%',
        explanation: 'UX metrics: Load speed and conversion show direct business impact'
      },
      infrastructure: {
        metric: 'reducing deployment time by 70% and cutting infrastructure costs by $30K/year',
        explanation: 'DevOps metrics: Time savings and cost reduction demonstrate ROI'
      },
      analytics: {
        metric: 'accelerating insights delivery by 50% and enabling 80% faster decision-making',
        explanation: 'Speed metrics: Faster insights drive competitive advantage'
      },
      support: {
        metric: 'decreasing average resolution time by 55% (4hrs → 1.8hrs) and improving CSAT to 95%',
        explanation: 'Support metrics: Resolution time and satisfaction are key support KPIs'
      },
      leadership: {
        metric: 'increasing team velocity by 40% and reducing sprint carryover by 60%',
        explanation: 'Agile metrics: Velocity and completion rate show leadership effectiveness'
      },
      optimization: {
        metric: 'boosting system performance by 65% while reducing resource usage by 35%',
        explanation: 'Optimization metrics: Performance gain with resource efficiency shows technical excellence'
      },
      security: {
        metric: 'reducing security vulnerabilities by 80% and achieving 100% compliance',
        explanation: 'Security metrics: Vulnerability reduction and compliance show risk mitigation'
      },
      general: {
        metric: 'improving process efficiency by 45% and saving 15+ hours per week',
        explanation: 'Efficiency metrics: Time savings demonstrate productivity impact'
      }
    };

    const efficiencyMetric = generatePersonalizedMetric('efficiency');
    suggestions.push({
      type: 'efficiency',
      improved: `${sanitized.verb} ${cleanedBase.replace(/^[A-Z][a-z]+(?:ed)?\s*/i, '')}${separator}${efficiencyMetric.metric}`,
      explanation: efficiencyMetric.explanation
    });

    // Context-aware money/business impact suggestions
    const hasRevenueContext = /\b(?:revenue|sales|profit|growth|customer|conversion)\b/i.test(bullet);
    const hasCostContext = /\b(?:cost|budget|expense|saving|reduce|optimize)\b/i.test(bullet);

    const moneyMetrics: Record<string, { metric: string; explanation: string }> = {
      database: {
        metric: 'reducing infrastructure costs by $75K/year while maintaining 99.9% uptime',
        explanation: 'Cost efficiency: Infrastructure savings with reliability show fiscal responsibility'
      },
      web: {
        metric: 'contributing to $2M+ in annual revenue and 35% increase in user retention',
        explanation: 'Revenue impact: Direct contribution to top-line growth demonstrates business value'
      },
      infrastructure: {
        metric: 'saving $120K/year in cloud costs through optimization and right-sizing',
        explanation: 'Cost optimization: Cloud savings show technical and financial acumen'
      },
      analytics: {
        metric: 'enabling decisions that generated $500K+ in revenue and prevented $200K in losses',
        explanation: 'Business intelligence: Data-driven decisions show measurable business impact'
      },
      support: {
        metric: 'reducing churn by 20%, retaining $300K+ in annual recurring revenue',
        explanation: 'Customer retention: Support excellence translates to revenue protection'
      },
      leadership: {
        metric: 'delivering projects on $500K budget with 15% under-spend and zero overruns',
        explanation: 'Budget management: Financial discipline shows leadership maturity'
      },
      security: {
        metric: 'preventing potential losses of $1M+ through proactive security measures',
        explanation: 'Risk mitigation: Security investment prevents costly breaches'
      },
      general: {
        metric: 'managing project budget of $150K and delivering 20% ahead of schedule',
        explanation: 'Financial responsibility: Budget management shows trustworthiness'
      }
    };

    let moneyMetric: { metric: string; explanation: string };
    if (hasRevenueContext && primaryContext === 'web') {
      moneyMetric = moneyMetrics['web'];
    } else if (hasCostContext && (primaryContext === 'infrastructure' || primaryContext === 'database')) {
      moneyMetric = moneyMetrics[primaryContext];
    } else {
      moneyMetric = moneyMetrics[primaryContext] || moneyMetrics['general'];
    }

    const moneyMetricPersonalized = generatePersonalizedMetric('money');
    suggestions.push({
      type: 'money',
      improved: `${sanitized.verb} ${cleanedBase.replace(/^[A-Z][a-z]+(?:ed)?\s*/i, '')}${separator}${moneyMetricPersonalized.metric}`,
      explanation: moneyMetricPersonalized.explanation
    });

    return suggestions;
  };

  const weakBullets = detectWeakBullets(ocrText);

  // Don't show if no weak bullets, metrics are good, or user is not paid
  if (!isPaidUser || weakBullets.length === 0 || metricsCount >= 8) {
    return null;
  }

  // Use currentBulletIndex to show the current bullet
  const currentBullet = weakBullets[currentBulletIndex];

  // If no current bullet (all processed), hide the component
  if (!currentBullet) {
    return null;
  }

  const handleApplyMetric = async () => {
    if (isApplying) return;

    const suggestion = currentBullet.suggestions[selectedSuggestionIndex];

    setIsApplying(true);
    try {
      await updateResumeText({
        id: resumeId,
        oldText: currentBullet.original,
        newText: suggestion.improved,
      });

      toast.success("Bullet point updated!", {
        description: `Applied ${suggestion.type} metric improvement`
      });

      // Move to next bullet if available
      if (currentBulletIndex < weakBullets.length - 1) {
        setCurrentBulletIndex(currentBulletIndex + 1);
        setSelectedSuggestionIndex(0); // Reset selection for next bullet
      }
    } catch (error) {
      toast.error("Failed to update bullet point", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleSkip = () => {
    toast.info("Skipped bullet point", {
      description: "Moving to next suggestion"
    });

    // Move to next bullet if available
    if (currentBulletIndex < weakBullets.length - 1) {
      setCurrentBulletIndex(currentBulletIndex + 1);
      setSelectedSuggestionIndex(0); // Reset selection for next bullet
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-3xl mt-8"
      >
        <div className="glass-card rounded-xl p-5 md:p-6 border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 p-2 bg-[#F59E0B]/20 rounded-lg">
              <Lightbulb className="h-5 w-5 text-[#F59E0B]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[#0F172A] font-bold text-base md:text-lg flex items-center gap-2">
                ⚠️ Weak Bullet Detected
                <span className="text-xs font-normal text-[#64748B]">({weakBullets.length} found)</span>
              </h3>
              <p className="text-[#64748B] text-xs md:text-sm mt-1">
                This bullet point lacks quantifiable impact. Add numbers to make it stronger.
              </p>
            </div>
          </div>

          {/* Original Bullet */}
          <div className="bg-[#FFFFFF]/50 border border-[#E2E8F0] rounded-lg p-3 md:p-4 mb-4">
            <p className="text-xs text-[#64748B] uppercase tracking-wider font-semibold mb-2">Original</p>
            <p className="text-[#475569] text-sm md:text-base leading-relaxed">
              {currentBullet.original}
            </p>
          </div>

          {/* AI Suggestions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-[#06B6D4]" />
              <p className="text-xs text-[#0F172A] uppercase tracking-wider font-semibold">
                💡 AI Suggestions (Click to Apply)
              </p>
            </div>

            {currentBullet.suggestions.map((suggestion, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                onClick={() => setSelectedSuggestionIndex(idx)}
                className={`w-full text-left p-3 md:p-4 rounded-lg border-2 transition-all duration-300 group ${
                  selectedSuggestionIndex === idx
                    ? 'bg-purple-500/10 border-purple-500/50'
                    : 'bg-[#F8FAFC]/30 border-[#E2E8F0] hover:border-purple-500/30 hover:bg-[#F8FAFC]/50'
                }`}
              >
                {/* Type Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    suggestion.type === 'volume' ? 'bg-[#3B82F6]/20 text-[#3B82F6]' :
                    suggestion.type === 'efficiency' ? 'bg-[#8B5CF6]/20 text-[#8B5CF6]' :
                    'bg-[#22C55E]/20 text-[#22C55E]'
                  }`}>
                    {suggestion.type === 'volume' ? '# Volume' :
                     suggestion.type === 'efficiency' ? '% Efficiency' :
                     '$ Money'}
                  </span>
                  {selectedSuggestionIndex === idx && (
                    <span className="text-[10px] text-[#06B6D4] font-semibold">✓ Selected</span>
                  )}
                </div>

                {/* Improved Text */}
                <p className="text-[#475569] text-sm md:text-base leading-relaxed mb-2 group-hover:text-[#0F172A] transition-colors">
                  {suggestion.improved}
                </p>

                {/* Explanation */}
                <p className="text-[#64748B] text-xs leading-relaxed">
                  {suggestion.explanation}
                </p>
              </motion.button>
            ))}
          </div>

          {/* Action Button */}
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={handleApplyMetric}
              disabled={isApplying}
              className="flex-1 h-10 md:h-11 rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isApplying ? "Applying..." : "Apply Selected & Continue"}
            </button>
            <button
              onClick={handleSkip}
              disabled={isApplying}
              className="h-10 md:h-11 px-4 rounded-lg border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#64748B] hover:text-[#475569] text-sm font-medium transition-colors bg-[#FFFFFF] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Skip
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
