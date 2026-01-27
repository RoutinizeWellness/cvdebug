import { softSkills, actionVerbs } from "./config/keywords";

export interface BulletPointAnalysis {
  score: number;
  strongBullets: string[];
  weakBullets: string[];
  issues: string[];
}

export interface SoftSkillsAnalysis {
  score: number;
  found: string[];
  missing: string[];
}

// Advanced bullet point analysis with XYZ formula scoring
export function analyzeBulletPoints(text: string): BulletPointAnalysis {
  // Enhanced line extraction with multiple bullet formats
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 20);

  // Advanced bullet point detection with regex
  const bulletPatterns = [
    /^[•●○■▪▫◦▸▹►▻⦿⦾]\s+.+$/,  // Various bullet symbols
    /^[-–—]\s+.+$/,  // Dashes
    /^[\*]\s+.+$/,  // Asterisks
    /^\d+\.\s+.+$/,  // Numbered lists
    /^[A-Z][^.!?]{30,}/  // Capital sentences (likely bullets without symbols)
  ];

  const bulletPoints: string[] = [];
  lines.forEach(line => {
    for (const pattern of bulletPatterns) {
      if (pattern.test(line)) {
        bulletPoints.push(line);
        break;
      }
    }
  });

  const strongBullets: string[] = [];
  const weakBullets: string[] = [];
  const issues: string[] = [];

  let totalScore = 0;
  let bulletCount = 0;

  // Advanced action verb detection with word boundaries
  const strongVerbPattern = new RegExp(
    `\\b(${actionVerbs.join('|')})\\b`,
    'i'
  );

  // Comprehensive metrics detection patterns
  const metricPatterns = [
    /\d+(?:\.\d+)?%/g,  // Percentages: 45%, 23.5%
    /\$[\d,]+(?:\.\d+)?[kmb]?/gi,  // Money: $50K, $1.5M, $2B
    /\d+x\s+(?:faster|better|more|improvement)/gi,  // Multipliers: 3x faster
    /\d+[+]?\s+(?:users|customers|clients|employees|projects|systems)/gi,  // Scale: 500+ users
    /(?:increased|decreased|reduced|improved|grew|boosted)\s+by\s+\d+%/gi,  // Impact phrases
    /\d+(?:,\d{3})*[+]?/g  // Large numbers: 1,000+, 50,000
  ];

  // XYZ Formula components scoring
  interface XYZScore {
    action: number;  // Accomplished [X]
    method: number;  // by doing [Y]
    result: number;  // resulting in [Z]
  }

  for (const bullet of bulletPoints) {
    if (bullet.length < 40) continue;

    bulletCount++;
    const xyzScore: XYZScore = { action: 0, method: 0, result: 0 };
    const cleanBullet = bullet.replace(/^[•●○■▪▫◦▸▹►▻⦿⦾\-–—\*\d.]\s*/, '');

    // X: Action verb assessment (0-5 points)
    const firstWord = cleanBullet.split(/\s+/)[0];
    if (strongVerbPattern.test(firstWord)) {
      xyzScore.action = 5;
    } else if (/^[A-Z]/.test(firstWord)) {
      xyzScore.action = 3; // At least starts with capital
    }

    // Penalize passive/weak starts
    const weakVerbPattern = /^(?:responsible\s+for|in\s+charge\s+of|helped\s+(?:with|to)|assisted\s+(?:with|in)|worked\s+on|tasked\s+with|contributed\s+to)/i;
    if (weakVerbPattern.test(cleanBullet)) {
      xyzScore.action -= 3;
    }

    // Y: Method/Task detection (0-4 points)
    const hasDetailedMethod = /\b(?:by|using|through|via|with|implementing|utilizing|leveraging)\b/i.test(cleanBullet);
    const hasTechnologies = /\b(?:python|java|react|aws|kubernetes|sql|api|system|platform|framework|tool)\b/i.test(cleanBullet.toLowerCase());

    if (hasDetailedMethod && hasTechnologies) {
      xyzScore.method = 4;
    } else if (hasDetailedMethod || hasTechnologies) {
      xyzScore.method = 2;
    }

    // Z: Result/Metrics assessment (0-6 points)
    let metricCount = 0;
    let metricQuality = 0;

    metricPatterns.forEach(pattern => {
      const matches = cleanBullet.match(pattern);
      if (matches) {
        metricCount += matches.length;
        // Quality scoring based on metric type
        if (pattern.toString().includes('%')) metricQuality += 3; // Percentages are strong
        else if (pattern.toString().includes('$')) metricQuality += 3; // Money is strong
        else if (pattern.toString().includes('x')) metricQuality += 2; // Multipliers good
        else metricQuality += 1;
      }
    });

    xyzScore.result = Math.min(6, metricQuality);

    // Additional quality checks
    let qualityBonus = 0;

    // Bonus for optimal length (80-140 chars = sweet spot)
    if (cleanBullet.length >= 80 && cleanBullet.length <= 140) {
      qualityBonus += 2;
    }

    // Bonus for result-oriented language
    const resultKeywords = /\b(?:resulting\s+in|achieved|delivered|generated|saved|improved|increased|reduced|decreased|boosted|optimized|enhanced)\b/i;
    if (resultKeywords.test(cleanBullet)) {
      qualityBonus += 1;
    }

    // Penalty for too short (lacks detail)
    if (cleanBullet.length < 60) {
      qualityBonus -= 2;
    }

    // Penalty for too long (likely rambling)
    if (cleanBullet.length > 180) {
      qualityBonus -= 1;
    }

    // Calculate final bullet score (max: 5 + 4 + 6 + bonus = ~17)
    const bulletScore = xyzScore.action + xyzScore.method + xyzScore.result + qualityBonus;

    // Categorize bullets
    if (bulletScore >= 10) {
      strongBullets.push(cleanBullet);
      totalScore += 10;
    } else if (bulletScore <= 3) {
      weakBullets.push(cleanBullet);
      totalScore += 2;
    } else {
      totalScore += 5 + Math.floor(bulletScore / 2); // Partial credit
    }
  }

  // Normalize score (0-100 scale)
  const finalScore = bulletCount > 0 ? Math.min(100, (totalScore / (bulletCount * 10)) * 100) : 0;

  // Generate specific, actionable issues
  if (weakBullets.length > 0) {
    const weakRatio = (weakBullets.length / bulletCount) * 100;
    if (weakRatio > 50) {
      issues.push(`Critical: ${weakBullets.length} weak bullet points (${Math.round(weakRatio)}%). Most lack metrics or strong action verbs.`);
    } else {
      issues.push(`Found ${weakBullets.length} weak bullet points lacking metrics or strong action verbs.`);
    }
  }

  if (bulletCount > 0 && strongBullets.length === 0) {
    issues.push("No high-impact bullet points found. Apply the XYZ formula: 'Accomplished [X] by doing [Y] resulting in [Z]'");
  }

  const avgMetricsPerBullet = bulletPoints.reduce((sum, bullet) => {
    let count = 0;
    metricPatterns.forEach(pattern => {
      const matches = bullet.match(pattern);
      if (matches) count += matches.length;
    });
    return sum + count;
  }, 0) / (bulletCount || 1);

  if (avgMetricsPerBullet < 1) {
    issues.push(`Average ${avgMetricsPerBullet.toFixed(1)} metrics per bullet. Aim for at least 1-2 quantifiable results per bullet.`);
  }

  return {
    score: Math.round(finalScore),
    strongBullets: strongBullets.slice(0, 3),
    weakBullets: weakBullets.slice(0, 3),
    issues
  };
}

// Advanced soft skills analysis with context and synonym detection
export function analyzeSoftSkills(text: string): SoftSkillsAnalysis {
  const lowerText = text.toLowerCase();
  const found: string[] = [];
  const foundWithContext = new Set<string>();

  // Expanded soft skills with synonyms and related terms
  interface SkillPattern {
    primary: string;
    patterns: RegExp[];
    category: 'communication' | 'leadership' | 'collaboration' | 'problem-solving' | 'adaptability';
  }

  const skillPatterns: SkillPattern[] = [
    {
      primary: 'leadership',
      patterns: [
        /\b(?:lead|led|leading|leader|leadership)\b/gi,
        /\b(?:manage[d]?|managing|manager|management)\b/gi,
        /\b(?:direct|directed|directing)\b/gi,
        /\b(?:supervise[d]?|supervisor)\b/gi
      ],
      category: 'leadership'
    },
    {
      primary: 'communication',
      patterns: [
        /\b(?:communicat(?:e|ed|ing|ion))\b/gi,
        /\b(?:present(?:ed|ing|ation)?)\b/gi,
        /\b(?:articulate[d]?)\b/gi,
        /\b(?:convey(?:ed)?)\b/gi,
        /\b(?:stakeholder)\b/gi
      ],
      category: 'communication'
    },
    {
      primary: 'collaboration',
      patterns: [
        /\b(?:collaborat(?:e|ed|ing|ion))\b/gi,
        /\b(?:teamwork|team\s+player)\b/gi,
        /\b(?:cross-functional|cross\s+functional)\b/gi,
        /\b(?:partner(?:ed|ing)?)\b/gi,
        /\b(?:coordinate[d]?|coordination)\b/gi
      ],
      category: 'collaboration'
    },
    {
      primary: 'problem-solving',
      patterns: [
        /\b(?:problem[\s-]solving|problem[\s-]solver)\b/gi,
        /\b(?:troubleshoot(?:ed|ing)?)\b/gi,
        /\b(?:debug(?:ged|ging)?)\b/gi,
        /\b(?:resolve[d]?|resolution)\b/gi,
        /\b(?:analytical|analysis)\b/gi,
        /\b(?:diagnose[d]?)\b/gi
      ],
      category: 'problem-solving'
    },
    {
      primary: 'adaptability',
      patterns: [
        /\b(?:adaptable|adapt(?:ed|ing)?|adaptation)\b/gi,
        /\b(?:flexible|flexibility)\b/gi,
        /\b(?:agile|agility)\b/gi,
        /\b(?:versatile)\b/gi,
        /\b(?:pivot(?:ed)?)\b/gi
      ],
      category: 'adaptability'
    },
    {
      primary: 'mentoring',
      patterns: [
        /\b(?:mentor(?:ed|ing)?)\b/gi,
        /\b(?:coach(?:ed|ing)?)\b/gi,
        /\b(?:train(?:ed|ing)?)\b/gi,
        /\b(?:guide[d]?|guidance)\b/gi,
        /\b(?:onboard(?:ed|ing)?)\b/gi
      ],
      category: 'leadership'
    },
    {
      primary: 'project-management',
      patterns: [
        /\b(?:project\s+management|project\s+manager)\b/gi,
        /\b(?:scrum|agile|kanban)\b/gi,
        /\b(?:sprint)\b/gi,
        /\b(?:roadmap)\b/gi,
        /\b(?:milestone[s]?)\b/gi
      ],
      category: 'leadership'
    },
    {
      primary: 'critical-thinking',
      patterns: [
        /\b(?:critical\s+thinking)\b/gi,
        /\b(?:strategic|strategy)\b/gi,
        /\b(?:decision[\s-]making)\b/gi,
        /\b(?:evaluate[d]?|evaluation)\b/gi,
        /\b(?:assess(?:ed|ing|ment)?)\b/gi
      ],
      category: 'problem-solving'
    },
    {
      primary: 'attention-to-detail',
      patterns: [
        /\b(?:attention\s+to\s+detail|detail[\s-]oriented)\b/gi,
        /\b(?:meticulous|thorough)\b/gi,
        /\b(?:accuracy|accurate)\b/gi,
        /\b(?:precision|precise)\b/gi
      ],
      category: 'problem-solving'
    },
    {
      primary: 'time-management',
      patterns: [
        /\b(?:time[\s-]management)\b/gi,
        /\b(?:prioriti[zs](?:e|ed|ing|ation)?)\b/gi,
        /\b(?:deadline[s]?)\b/gi,
        /\b(?:multitask(?:ed|ing)?)\b/gi
      ],
      category: 'adaptability'
    }
  ];

  // Analyze each skill pattern with context awareness
  const categoryScores = {
    leadership: 0,
    communication: 0,
    collaboration: 0,
    'problem-solving': 0,
    adaptability: 0
  };

  skillPatterns.forEach(skill => {
    let skillFound = false;
    let bestMatch = '';
    let matchCount = 0;

    skill.patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        skillFound = true;
        matchCount += matches.length;
        if (matches[0].length > bestMatch.length) {
          bestMatch = matches[0];
        }
      }
    });

    if (skillFound) {
      foundWithContext.add(skill.primary);
      // Bonus points for multiple mentions (shows emphasis)
      const contextScore = Math.min(3, matchCount);
      categoryScores[skill.category] += contextScore;
    }
  });

  // Convert to array and calculate missing
  const foundArray = Array.from(foundWithContext);
  const allSkills = skillPatterns.map(s => s.primary);
  const missing = allSkills.filter(s => !foundWithContext.has(s));

  // Advanced scoring with category balance
  let score = 0;
  const numCategories = Object.keys(categoryScores).length;
  const categoriesRepresented = Object.values(categoryScores).filter(s => s > 0).length;

  // Base score from found skills
  const baseScore = Math.min(100, (foundArray.length / allSkills.length) * 150);

  // Bonus for category diversity (shows well-rounded candidate)
  const diversityBonus = (categoriesRepresented / numCategories) * 20;

  // Bonus for deep demonstration (multiple mentions)
  const depthBonus = Math.min(15, Object.values(categoryScores).reduce((sum, s) => sum + s, 0) * 2);

  score = Math.round(Math.min(100, baseScore + diversityBonus + depthBonus));

  return {
    score,
    found: foundArray.slice(0, 10), // Return top 10 found
    missing: missing.slice(0, 5) // Suggest top 5 missing
  };
}