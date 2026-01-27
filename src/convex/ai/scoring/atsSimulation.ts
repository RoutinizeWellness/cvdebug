/**
 * ATS Parser Simulation
 *
 * Different ATS systems parse resumes differently:
 * - Workday: Strict formatting, struggles with tables/columns
 * - Taleo (Oracle): Conservative, prefers simple formats
 * - Greenhouse: Modern, handles complex layouts better
 * - Lever: Developer-friendly, good with technical resumes
 *
 * This module simulates how different ATS would score a resume
 * Jobscan doesn't do this level of ATS-specific analysis ❌
 * CVDebug simulates actual ATS parsing behavior ✅
 */

export type ATSSystem =
  | "Workday"
  | "Taleo"
  | "Greenhouse"
  | "Lever"
  | "iCIMS"
  | "SAP SuccessFactors"
  | "BambooHR"
  | "JazzHR"
  | "Generic";

export interface ATSCompatibility {
  system: ATSSystem;
  parseability: number; // 0-100 score
  issues: ParseIssue[];
  strengths: string[];
  recommendations: string[];
  riskLevel: "low" | "medium" | "high";
}

export interface ParseIssue {
  severity: "critical" | "warning" | "info";
  category: string;
  description: string;
  impact: string;
  fix: string;
}

export interface ATSCharacteristics {
  system: ATSSystem;
  strictFormatting: number;      // 0-1: how strict about format
  tableHandling: number;          // 0-1: how well it handles tables
  columnHandling: number;         // 0-1: multi-column support
  graphicsHandling: number;       // 0-1: can it handle graphics
  sectionDetection: number;       // 0-1: how well it detects sections
  dateFlexibility: number;        // 0-1: date format flexibility
  contactExtraction: number;      // 0-1: contact info accuracy
  keywordMatching: number;        // 0-1: keyword matching sophistication
  marketShare: number;            // Percentage of companies using it
  description: string;
}

/**
 * ATS system characteristics based on real-world behavior
 */
export const ATS_SYSTEMS: Record<ATSSystem, ATSCharacteristics> = {
  Workday: {
    system: "Workday",
    strictFormatting: 0.9,      // Very strict
    tableHandling: 0.3,          // Poor with tables
    columnHandling: 0.2,         // Struggles with columns
    graphicsHandling: 0.1,       // No graphics support
    sectionDetection: 0.7,       // Good at sections
    dateFlexibility: 0.5,        // Moderate date flexibility
    contactExtraction: 0.8,      // Good contact extraction
    keywordMatching: 0.7,        // Decent keyword matching
    marketShare: 45,             // ~45% market share
    description: "Most common ATS, strict formatting requirements, struggles with complex layouts"
  },

  Taleo: {
    system: "Taleo",
    strictFormatting: 0.85,
    tableHandling: 0.4,
    columnHandling: 0.3,
    graphicsHandling: 0.2,
    sectionDetection: 0.6,
    dateFlexibility: 0.4,
    contactExtraction: 0.7,
    keywordMatching: 0.6,
    marketShare: 20,
    description: "Oracle's legacy ATS, conservative parsing, prefers simple Word/PDF formats"
  },

  Greenhouse: {
    system: "Greenhouse",
    strictFormatting: 0.5,       // More flexible
    tableHandling: 0.7,          // Better table handling
    columnHandling: 0.6,
    graphicsHandling: 0.5,
    sectionDetection: 0.8,       // Excellent section detection
    dateFlexibility: 0.8,
    contactExtraction: 0.9,      // Excellent
    keywordMatching: 0.8,        // Advanced matching
    marketShare: 15,
    description: "Modern ATS popular with tech companies, handles complex layouts well"
  },

  Lever: {
    system: "Lever",
    strictFormatting: 0.4,
    tableHandling: 0.8,
    columnHandling: 0.7,
    graphicsHandling: 0.6,
    sectionDetection: 0.85,
    dateFlexibility: 0.9,
    contactExtraction: 0.85,
    keywordMatching: 0.85,
    marketShare: 8,
    description: "Developer-friendly ATS, excellent parsing, popular with startups"
  },

  iCIMS: {
    system: "iCIMS",
    strictFormatting: 0.7,
    tableHandling: 0.5,
    columnHandling: 0.4,
    graphicsHandling: 0.3,
    sectionDetection: 0.65,
    dateFlexibility: 0.6,
    contactExtraction: 0.75,
    keywordMatching: 0.65,
    marketShare: 7,
    description: "Enterprise ATS, moderate parsing capabilities, widely used in large corporations"
  },

  "SAP SuccessFactors": {
    system: "SAP SuccessFactors",
    strictFormatting: 0.8,
    tableHandling: 0.45,
    columnHandling: 0.35,
    graphicsHandling: 0.25,
    sectionDetection: 0.7,
    dateFlexibility: 0.5,
    contactExtraction: 0.75,
    keywordMatching: 0.7,
    marketShare: 4,
    description: "SAP's enterprise solution, strict formatting, common in large corporations"
  },

  BambooHR: {
    system: "BambooHR",
    strictFormatting: 0.6,
    tableHandling: 0.6,
    columnHandling: 0.5,
    graphicsHandling: 0.4,
    sectionDetection: 0.7,
    dateFlexibility: 0.7,
    contactExtraction: 0.8,
    keywordMatching: 0.7,
    marketShare: 3,
    description: "SMB-focused ATS, good balance of features and flexibility"
  },

  JazzHR: {
    system: "JazzHR",
    strictFormatting: 0.65,
    tableHandling: 0.55,
    columnHandling: 0.45,
    graphicsHandling: 0.35,
    sectionDetection: 0.65,
    dateFlexibility: 0.65,
    contactExtraction: 0.75,
    keywordMatching: 0.65,
    marketShare: 1,
    description: "Small business ATS, moderate capabilities"
  },

  Generic: {
    system: "Generic",
    strictFormatting: 0.7,
    tableHandling: 0.5,
    columnHandling: 0.4,
    graphicsHandling: 0.3,
    sectionDetection: 0.65,
    dateFlexibility: 0.6,
    contactExtraction: 0.7,
    keywordMatching: 0.65,
    marketShare: 0,
    description: "Average ATS capabilities"
  }
};

/**
 * Simulate ATS parsing for a specific system
 */
export function simulateATSParsing(
  resumeText: string,
  formatIssues: Array<{ issue: string; severity: string }>,
  atsSystem: ATSSystem = "Workday"
): ATSCompatibility {
  const ats = ATS_SYSTEMS[atsSystem];
  const issues: ParseIssue[] = [];
  const strengths: string[] = [];
  let parseabilityScore = 100;

  // Check for critical format issues based on ATS characteristics

  // 1. Table detection
  const hasTables = /\|.*\|/.test(resumeText) || formatIssues.some(i => i.issue.includes("table"));
  if (hasTables) {
    const tablePenalty = (1 - ats.tableHandling) * 20;
    parseabilityScore -= tablePenalty;

    if (ats.tableHandling < 0.5) {
      issues.push({
        severity: "critical",
        category: "Formatting",
        description: `${atsSystem} struggles with tables`,
        impact: `May lose ${Math.round(tablePenalty)}% of content`,
        fix: "Convert tables to simple text format with clear section headers"
      });
    } else {
      strengths.push(`${atsSystem} can handle your table formatting`);
    }
  }

  // 2. Multi-column detection
  const hasColumns = formatIssues.some(i => i.issue.includes("column") || i.issue.includes("multi-column"));
  if (hasColumns) {
    const columnPenalty = (1 - ats.columnHandling) * 25;
    parseabilityScore -= columnPenalty;

    if (ats.columnHandling < 0.5) {
      issues.push({
        severity: "critical",
        category: "Layout",
        description: `${atsSystem} may scramble multi-column layouts`,
        impact: "Content order may be jumbled, confusing the recruiter",
        fix: "Use single-column layout with clear section breaks"
      });
    }
  }

  // 3. Graphics/Images
  const hasGraphics = formatIssues.some(i => i.issue.includes("graphic") || i.issue.includes("image"));
  if (hasGraphics) {
    const graphicsPenalty = (1 - ats.graphicsHandling) * 15;
    parseabilityScore -= graphicsPenalty;

    if (ats.graphicsHandling < 0.4) {
      issues.push({
        severity: "warning",
        category: "Content",
        description: `${atsSystem} cannot read graphics or images`,
        impact: "Any text in images will be lost",
        fix: "Remove graphics and use text-only format"
      });
    }
  }

  // 4. Section headers
  const sections = ["experience", "education", "skills", "summary"];
  const hasClearSections = sections.filter(s =>
    new RegExp(s, 'i').test(resumeText)
  ).length;

  if (hasClearSections >= 3) {
    const sectionBonus = ats.sectionDetection * 5;
    parseabilityScore += sectionBonus;
    strengths.push(`Clear section headers help ${atsSystem} parse your resume`);
  } else {
    issues.push({
      severity: "warning",
      category: "Structure",
      description: "Missing or unclear section headers",
      impact: `${atsSystem} may not properly categorize your information`,
      fix: "Add clear headers: EXPERIENCE, EDUCATION, SKILLS, SUMMARY"
    });
    parseabilityScore -= 10;
  }

  // 5. Date formatting
  const datePatterns = [
    /\d{4}\s*[-–]\s*\d{4}/,           // 2020 - 2023
    /\d{1,2}\/\d{4}/,                  // 01/2020
    /[A-Z][a-z]+\s+\d{4}/,             // January 2020
    /\d{4}\s*[-–]\s*Present/i          // 2020 - Present
  ];

  const hasStandardDates = datePatterns.some(p => p.test(resumeText));
  if (hasStandardDates) {
    strengths.push("Standard date formats detected");
  } else if (ats.dateFlexibility < 0.6) {
    issues.push({
      severity: "info",
      category: "Dates",
      description: `${atsSystem} prefers standard date formats`,
      impact: "Employment dates may not be properly extracted",
      fix: "Use format: MM/YYYY - MM/YYYY or Month YYYY - Month YYYY"
    });
    parseabilityScore -= 5;
  }

  // 6. Contact information
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
  const hasPhone = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  const hasLocation = /[A-Z][a-z]+,\s*[A-Z]{2}/.test(resumeText);

  const contactScore = (hasEmail ? 1 : 0) + (hasPhone ? 1 : 0) + (hasLocation ? 1 : 0);
  if (contactScore >= 2) {
    strengths.push(`${atsSystem} can extract your contact information`);
  } else {
    issues.push({
      severity: "critical",
      category: "Contact",
      description: "Missing or improperly formatted contact information",
      impact: "Recruiters won't be able to reach you",
      fix: "Add clear contact section with email, phone, and location"
    });
    parseabilityScore -= 20;
  }

  // 7. Keywords and bullet points
  const bulletCount = (resumeText.match(/^[\s]*[•\-\*]/gm) || []).length;
  if (bulletCount >= 10) {
    const bulletBonus = ats.keywordMatching * 3;
    parseabilityScore += bulletBonus;
    strengths.push("Good use of bullet points for easy keyword extraction");
  }

  // 8. File format penalties (assume from formatIssues)
  const hasPDFIssues = formatIssues.some(i => i.issue.includes("PDF") || i.issue.includes("pdf"));
  if (hasPDFIssues && ats.strictFormatting > 0.7) {
    issues.push({
      severity: "info",
      category: "File Format",
      description: `${atsSystem} may have issues with certain PDF formats`,
      impact: "Some formatting may be lost",
      fix: "Use PDF/A format or submit as .docx if possible"
    });
    parseabilityScore -= 5;
  }

  // Normalize score
  parseabilityScore = Math.max(0, Math.min(100, parseabilityScore));

  // Generate recommendations
  const recommendations: string[] = [];

  if (parseabilityScore < 70) {
    recommendations.push(`Your resume has significant compatibility issues with ${atsSystem} (${Math.round(ats.marketShare)}% market share)`);
  }

  if (issues.some(i => i.severity === "critical")) {
    recommendations.push("Address critical issues first - these will block your resume");
  }

  if (ats.strictFormatting > 0.7) {
    recommendations.push(`${atsSystem} is strict about formatting - keep it simple and clean`);
  }

  if (ats.keywordMatching > 0.7 && bulletCount < 10) {
    recommendations.push("Add more bullet points with keywords for better matching");
  }

  // Determine risk level
  let riskLevel: "low" | "medium" | "high";
  if (parseabilityScore >= 80) riskLevel = "low";
  else if (parseabilityScore >= 60) riskLevel = "medium";
  else riskLevel = "high";

  return {
    system: atsSystem,
    parseability: Math.round(parseabilityScore * 10) / 10,
    issues: issues.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }),
    strengths,
    recommendations,
    riskLevel
  };
}

/**
 * Simulate multiple ATS systems at once
 * Shows how resume performs across different ATS
 */
export function simulateMultipleATS(
  resumeText: string,
  formatIssues: Array<{ issue: string; severity: string }>,
  systems: ATSSystem[] = ["Workday", "Taleo", "Greenhouse"]
): {
  results: ATSCompatibility[];
  averageScore: number;
  bestSystem: ATSSystem;
  worstSystem: ATSSystem;
  universalIssues: ParseIssue[];
  recommendation: string;
} {
  const results = systems.map(sys => simulateATSParsing(resumeText, formatIssues, sys));

  const scores = results.map(r => r.parseability);
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  const bestResult = results.reduce((best, curr) =>
    curr.parseability > best.parseability ? curr : best
  );
  const worstResult = results.reduce((worst, curr) =>
    curr.parseability < worst.parseability ? curr : worst
  );

  // Find universal issues (appear in 2+ systems)
  const allIssues = results.flatMap(r => r.issues);
  const issueMap = new Map<string, ParseIssue[]>();

  for (const issue of allIssues) {
    const key = issue.description;
    if (!issueMap.has(key)) {
      issueMap.set(key, []);
    }
    issueMap.get(key)!.push(issue);
  }

  const universalIssues = Array.from(issueMap.entries())
    .filter(([_, issues]) => issues.length >= 2)
    .map(([_, issues]) => issues[0]);

  // Generate overall recommendation
  let recommendation = "";
  if (averageScore >= 85) {
    recommendation = "Excellent ATS compatibility across all systems tested";
  } else if (averageScore >= 70) {
    recommendation = `Good ATS compatibility, but address issues for ${worstResult.system} (${Math.round(ATS_SYSTEMS[worstResult.system].marketShare)}% market share)`;
  } else if (averageScore >= 55) {
    recommendation = `Moderate ATS compatibility - fix ${universalIssues.length} universal issues affecting multiple systems`;
  } else {
    recommendation = "Poor ATS compatibility - major formatting overhaul needed for most systems";
  }

  return {
    results,
    averageScore: Math.round(averageScore * 10) / 10,
    bestSystem: bestResult.system,
    worstSystem: worstResult.system,
    universalIssues,
    recommendation
  };
}

/**
 * Get ATS recommendation based on job/company
 * Different companies use different ATS
 */
export function recommendATSForCompany(companyName: string): ATSSystem {
  const company = companyName.toLowerCase();

  // Fortune 500 / Enterprise
  if (company.includes("apple") || company.includes("microsoft") ||
      company.includes("google") || company.includes("amazon") ||
      company.includes("meta") || company.includes("facebook")) {
    return "Workday";
  }

  // Financial institutions
  if (company.includes("bank") || company.includes("capital") ||
      company.includes("jpmorgan") || company.includes("goldman")) {
    return "Taleo";
  }

  // Tech startups/scale-ups
  if (company.includes("startup") || company.includes("tech") ||
      company.includes("software")) {
    return "Greenhouse";
  }

  // Default to most common
  return "Workday";
}
