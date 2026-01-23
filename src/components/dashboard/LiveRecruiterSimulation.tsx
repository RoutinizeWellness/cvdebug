import { useState } from "react";
import { motion } from "framer-motion";

interface LiveRecruiterSimulationProps {
  resumeText: string;
  score: number;
  missingKeywords?: string[];
  matchedKeywords?: string[];
  formatIssues?: Array<{ issue: string; severity?: string }>;
  targetRole?: string;
  candidateName?: string;
  candidateEmail?: string;
  candidateLocation?: string;
}

export function LiveRecruiterSimulation({
  resumeText,
  score,
  missingKeywords = [],
  matchedKeywords = [],
  formatIssues = [],
  targetRole = "Role",
  candidateName = "Candidate",
  candidateEmail = "",
  candidateLocation = "Location"
}: LiveRecruiterSimulationProps) {
  const [viewMode, setViewMode] = useState<"parsed" | "raw" | "pdf">("parsed");
  const [isDarkMode] = useState(true);

  // Generate dynamic scan ID based on timestamp
  const scanId = `#${Date.now().toString(36).toUpperCase().slice(-4)}-AX`;
  const sessionId = `th${Date.now().toString(36).slice(-6)}`;

  // Extract professional summary from resume text (first 200 chars or first paragraph)
  const extractSummary = (text: string) => {
    if (!text) return "";

    const lines = text.split('\n').filter(l => l.trim());
    const summaryLine = lines.find(line =>
      line.length > 100 &&
      !line.toLowerCase().includes('education') &&
      !line.toLowerCase().includes('experience')
    );

    return summaryLine?.substring(0, 300) || lines[0]?.substring(0, 300) || "";
  };

  const professionalSummary = extractSummary(resumeText);

  // Extract work experience from resume text with enhanced parsing
  const extractWorkExperience = (text: string): { company: string; duration: string; bullets: string[] } | null => {
    if (!text) return null;

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // Enhanced date patterns - matches: 2020-2023, 2020-Present, Jan 2020 - Dec 2023, 2020 - Current, etc.
    const datePattern = /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)?\s*(20\d{2}|19\d{2})\s*[-–—]\s*(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)?\s*)?(20\d{2}|present|current|now)/i;

    let company = "";
    let duration = "";
    const bullets: string[] = [];
    let foundExperience = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();

      // Skip header sections
      if (lowerLine.includes('experience') || lowerLine.includes('education') || lowerLine.includes('skills')) {
        continue;
      }

      // Check if this line contains a date range (likely a job entry)
      if (datePattern.test(line) && !foundExperience) {
        const dateMatch = line.match(datePattern);
        if (dateMatch) {
          duration = dateMatch[0];
          foundExperience = true;

          // Company name is likely in this line (before the date) or the previous line
          const companyMatch = line.replace(datePattern, '').replace(/\|/g, '').trim();

          if (companyMatch.length > 2 && companyMatch.length < 100) {
            // Clean up company name: remove job title separators
            company = companyMatch.split(/[•\-–—]/)[0].trim();
            // If company is too short, check previous line
            if (company.length < 3 && i > 0) {
              const prevLine = lines[i - 1];
              if (prevLine.length > 2 && prevLine.length < 100 && !/^[•\-\*]/.test(prevLine)) {
                company = prevLine.split(/[•\-–—]/)[0].trim();
              }
            }
          } else if (i > 0) {
            // Company might be in the previous line
            const prevLine = lines[i - 1];
            if (prevLine.length > 2 && prevLine.length < 100 && !/^[•\-\*]/.test(prevLine)) {
              company = prevLine.split(/[•\-–—]/)[0].trim();
            }
          }
        }
      }

      // Check for bullet points (experience descriptions) - only after we found a job entry
      if (foundExperience && bullets.length < 3) {
        if (/^[•\-\*◦‣⦿⦾]/.test(line) || /^\d+[\.)]\s/.test(line)) {
          const bulletText = line.replace(/^[•\-\*◦‣⦿⦾\d]+[\.)]*\s*/, '').trim();
          if (bulletText.length > 30 && bulletText.length < 250) {
            bullets.push(bulletText);
          }
        }
      }
    }

    // If we found data, return it
    if (company || bullets.length > 0) {
      return {
        company: company || "Professional Experience",
        duration: duration || "Multiple Years",
        bullets: bullets.length > 0 ? bullets : [
          "Specific work experience details not extracted from resume"
        ]
      };
    }

    return null;
  };

  const workExperience = extractWorkExperience(resumeText);

  // Calculate total years of experience from all date ranges in resume
  const calculateTotalYears = (text: string): number => {
    try {
      if (!text) return 0;

      const datePattern = /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)?\s*(20\d{2}|19\d{2})\s*[-–—]\s*(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)?\s*)?(20\d{2}|present|current|now)/gi;

      const matches = text.match(datePattern);
      if (!matches || matches.length === 0) return 0;

      let totalMonths = 0;
      const currentYear = new Date().getFullYear();

      matches.forEach(match => {
        try {
          // Extract start and end years
          const yearMatches = match.match(/(20\d{2}|19\d{2})/g);
          if (!yearMatches || yearMatches.length === 0) return;

          const startYear = parseInt(yearMatches[0]);
          let endYear = currentYear;

          // Check if there's an end year or if it's "present/current"
          if (yearMatches.length > 1) {
            endYear = parseInt(yearMatches[1]);
          } else if (match.match(/present|current|now/i)) {
            endYear = currentYear;
          }

          // Calculate months (assuming full years for simplicity)
          const months = (endYear - startYear) * 12;
          totalMonths += Math.max(0, months);
        } catch (e) {
          // Skip invalid date ranges
          console.warn("Error parsing date range:", match, e);
        }
      });

      // Convert to years, rounded to 1 decimal
      const years = Math.round((totalMonths / 12) * 10) / 10;
      return isNaN(years) ? 0 : years;
    } catch (e) {
      console.warn("Error calculating total years:", e);
      return 0;
    }
  };

  const totalYearsExperience = calculateTotalYears(resumeText);

  // Detect quantifiable metrics in resume
  const detectMetrics = (text: string): { count: number; examples: string[] } => {
    if (!text) return { count: 0, examples: [] };

    const metrics: string[] = [];
    const lines = text.split('\n');

    // Patterns for quantifiable achievements
    const patterns = [
      /\d+%/g,                                    // Percentages: 40%, 125%
      /\$[\d,]+(?:\.\d+)?[KMB]?/g,               // Money: $50K, $1.2M, $500
      /\d+[xX]/g,                                 // Multipliers: 3x, 10x
      /\b\d+\s*(?:million|billion|thousand)\b/gi, // Large numbers: 5 million
      /\b(?:increased|decreased|reduced|improved|grew|generated|saved|managed|led)\s+(?:by\s+)?\d+/gi, // Action + number
      /\b(?:team of|managed|led)\s+\d+/gi,        // Team size
      /\b\d+\+?\s*(?:years?|months?|clients?|customers?|users?|projects?|products?|employees?|members?)\b/gi, // Counts
    ];

    lines.forEach(line => {
      patterns.forEach(pattern => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            // Only add if we haven't already collected this metric
            const cleanMatch = match.trim();
            if (cleanMatch && !metrics.includes(cleanMatch) && metrics.length < 10) {
              // Get context around the metric (up to 60 chars)
              const index = line.indexOf(match);
              const start = Math.max(0, index - 20);
              const end = Math.min(line.length, index + match.length + 40);
              const context = line.substring(start, end).trim();
              metrics.push(context);
            }
          });
        }
      });
    });

    return {
      count: metrics.length,
      examples: metrics.slice(0, 3), // Top 3 examples
    };
  };

  const metricsAnalysis = detectMetrics(resumeText);

  // Calculate metrics density percentage (0-100%)
  // Based on industry standards: 5-8+ metrics = excellent, 3-4 = good, 1-2 = poor, 0 = critical
  const calculateMetricsDensity = (count: number): number => {
    if (count === 0) return 0;
    if (count >= 8) return 100;
    if (count >= 5) return 75;
    if (count >= 3) return 50;
    if (count >= 2) return 30;
    return 15; // 1 metric
  };

  const metricsPercentage = calculateMetricsDensity(metricsAnalysis.count);

  // Analyze readability based on resume structure and format
  const analyzeReadability = (text: string, formatIssuesCount: number): { level: string; status: string; icon: string; color: string } => {
    const lines = text.split('\n').filter(l => l.trim());
    const avgLineLength = lines.length > 0 ? lines.reduce((sum, line) => sum + line.length, 0) / lines.length : 0;

    // Check for good structure indicators
    const hasHeaders = /(?:experience|education|skills|summary|projects)/gi.test(text);
    const hasBulletPoints = /^[\s]*[•\-\*◦]/m.test(text);
    const wellFormatted = avgLineLength < 120 && avgLineLength > 20;

    // Score based on multiple factors
    let score = 0;
    if (hasHeaders) score += 2;
    if (hasBulletPoints) score += 2;
    if (wellFormatted) score += 2;
    if (formatIssuesCount === 0) score += 2;
    if (formatIssuesCount > 3) score -= 2;

    if (score >= 6) return { level: "High Integrity", status: "Excellent", icon: "check_circle", color: "emerald" };
    if (score >= 4) return { level: "Good Format", status: "Acceptable", icon: "check_circle", color: "emerald" };
    if (score >= 2) return { level: "Fair Format", status: "Needs Work", icon: "warning", color: "amber" };
    return { level: "Poor Format", status: "Critical", icon: "error", color: "red" };
  };

  // Detect image traps and suspicious patterns
  const detectImageTraps = (text: string, formatIssuesArr: Array<{ issue: string }>) => {
    // Check for suspicious patterns that ATS can't parse
    const hasInvisibleChars = /[\u200B-\u200D\uFEFF]/.test(text);
    const hasExcessiveWhitespace = /\s{10,}/.test(text);
    const hasSuspiciousFormatting = formatIssuesArr.some(f =>
      f.issue.toLowerCase().includes('parse') ||
      f.issue.toLowerCase().includes('extract') ||
      f.issue.toLowerCase().includes('image')
    );

    const trapCount = [hasInvisibleChars, hasExcessiveWhitespace, hasSuspiciousFormatting].filter(Boolean).length;

    if (trapCount === 0) return { status: "None Detected", badge: "Safe", description: "No invisible elements or keyword stuffing", color: "emerald" };
    if (trapCount === 1) return { status: "Minor Issues", badge: "Warning", description: "Some formatting concerns detected", color: "amber" };
    return { status: "Issues Found", badge: "Risk", description: "Suspicious patterns that may affect ATS parsing", color: "red" };
  };

  // Analyze soft skills from resume content
  const analyzeSoftSkills = (text: string): { leadership: number; communication: number; problemSolving: number; teamwork: number } => {
    const lowerText = text.toLowerCase();

    // Leadership keywords
    const leadershipKeywords = ['led', 'managed', 'directed', 'supervised', 'coordinated', 'mentored', 'trained', 'established', 'founded', 'initiated'];
    const leadership = leadershipKeywords.filter(kw => lowerText.includes(kw)).length;

    // Communication keywords
    const commKeywords = ['presented', 'communicated', 'collaborated', 'negotiated', 'documented', 'reported', 'liaison', 'stakeholder', 'client-facing'];
    const communication = commKeywords.filter(kw => lowerText.includes(kw)).length;

    // Problem solving keywords
    const problemKeywords = ['solved', 'resolved', 'optimized', 'improved', 'analyzed', 'debugged', 'troubleshot', 'innovated', 'developed solution'];
    const problemSolving = problemKeywords.filter(kw => lowerText.includes(kw)).length;

    // Teamwork keywords
    const teamKeywords = ['collaborated', 'team', 'partnership', 'cross-functional', 'agile', 'scrum', 'peer', 'contributed'];
    const teamwork = teamKeywords.filter(kw => lowerText.includes(kw)).length;

    // Normalize to 0-4 scale (for 4 bars)
    const normalize = (count: number) => count === 0 ? 0 : Math.min(4, Math.ceil(count / 2));

    return {
      leadership: normalize(leadership),
      communication: normalize(communication),
      problemSolving: normalize(problemSolving),
      teamwork: normalize(teamwork)
    };
  };

  const readabilityAnalysis = analyzeReadability(resumeText, formatIssues.length);
  const imageTrapsAnalysis = detectImageTraps(resumeText, formatIssues);
  const softSkillsAnalysis = analyzeSoftSkills(resumeText);

  // Annotate resume text with [CRIT] and [WARN] tags
  const annotateResumeText = (text: string): { __html: string } => {
    if (!text) return { __html: "No text available" };

    let annotatedText = text;

    // Add [CRIT] tags for no quantifiable metrics (ATS auto-reject risk)
    if (metricsAnalysis.count === 0) {
      annotatedText = `<div class="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-red-600 font-bold text-sm">[CRIT]</span>
          <span class="text-red-700 font-semibold text-sm">🚨 ATS AUTO-REJECT DETECTED</span>
        </div>
        <div class="text-xs text-red-700 font-semibold ml-6 mb-1">${metricsPercentage}% METRICS DENSITY (${metricsAnalysis.count} found)</div>
        <div class="text-xs text-red-600 ml-6">No quantifiable achievements found (%, $, numbers). 89% of ATS systems auto-reject resumes without metrics.</div>
        <div class="text-xs text-emerald-700 ml-6 mt-2 font-semibold">✅ FIX: Add numbers like "Increased sales by 40%" or "Managed team of 12 developers"</div>
      </div>` + annotatedText;
    } else if (metricsAnalysis.count < 3) {
      annotatedText = `<div class="mb-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-amber-600 font-bold text-sm">[WARN]</span>
          <span class="text-amber-700 font-semibold text-sm">⚠️ Low Metrics Density</span>
        </div>
        <div class="text-xs text-amber-700 font-semibold ml-6 mb-1">${metricsPercentage}% METRICS DENSITY (${metricsAnalysis.count} found)</div>
        <div class="text-xs text-amber-600 ml-6">Only ${metricsAnalysis.count} quantifiable metric${metricsAnalysis.count === 1 ? '' : 's'} detected. Add more numbers to strengthen your impact.</div>
        ${metricsAnalysis.examples.length > 0 ? `<div class="text-xs text-emerald-700 ml-6 mt-2">Found: ${metricsAnalysis.examples.join(', ')}</div>` : ''}
      </div>` + annotatedText;
    }

    // Add [CRIT] tags for critical format issues
    const criticalIssues = formatIssues.filter(f => f.severity === "critical" || f.issue.toLowerCase().includes("parse") || f.issue.toLowerCase().includes("extract"));
    if (criticalIssues.length > 0) {
      annotatedText = `<div class="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-red-600 font-bold text-sm">[CRIT]</span>
          <span class="text-red-700 font-semibold text-sm">Critical Format Errors Detected</span>
        </div>
        ${criticalIssues.map(issue => `<div class="text-xs text-red-600 ml-6">• ${issue.issue}</div>`).join('')}
      </div>` + annotatedText;
    }

    // Add [WARN] tags for missing keywords
    if (missingKeywords.length > 0) {
      const topMissing = missingKeywords.slice(0, 5);
      annotatedText = `<div class="mb-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-amber-600 font-bold text-sm">[WARN]</span>
          <span class="text-amber-700 font-semibold text-sm">Missing Critical Keywords</span>
        </div>
        <div class="text-xs text-amber-600 ml-6 space-y-1">
          ${topMissing.map(kw => `<div>• ${kw} - Not found in resume</div>`).join('')}
        </div>
      </div>` + annotatedText;
    }

    // Highlight missing keywords in the text
    missingKeywords.slice(0, 10).forEach(keyword => {
      // Only highlight if keyword is not in the text (case insensitive)
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      if (!regex.test(text)) {
        // Add a note at the end
        const note = `\n<span class="text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs">[WARN: Missing "${keyword}"]</span>`;
        annotatedText += note;
      }
    });

    return { __html: annotatedText };
  };

  // Calculate fit score percentage
  const fitScore = Math.min(100, Math.max(0, score));
  const fitLevel = fitScore >= 80 ? "Excellent" : fitScore >= 60 ? "Good" : "Fair";

  // Seniority level calculation
  const seniorityLevel = fitScore >= 75 ? "SENIOR" : fitScore >= 60 ? "MID" : "JUNIOR";
  const seniorityPosition = fitScore >= 75 ? "65%" : fitScore >= 60 ? "50%" : "35%";

  // Skills display
  const displaySkills = matchedKeywords.length > 0
    ? matchedKeywords.slice(0, 8)
    : []; // Show empty if no real keywords, don't fake it

  // Technical gap - use REAL data only
  const foundCount = matchedKeywords.length || 0;
  const requiredCount = Math.max(foundCount + missingKeywords.length, 1); // Avoid division by zero

  // Format issues for display
  const hasFormatIssues = formatIssues.length > 0;
  const hasLinkedInIssue = formatIssues.some(f =>
    f.issue.toLowerCase().includes('linkedin') ||
    f.issue.toLowerCase().includes('profile')
  );

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#F8FAFC]">
      {/* Header - Mobile Responsive */}
      <header className="h-14 md:h-16 border-b border-[#E2E8F0] flex items-center justify-between px-3 md:px-6 bg-[#FFFFFF] backdrop-blur-sm sticky top-0 z-50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 md:gap-2 text-[#3B82F6] font-bold text-base md:text-lg tracking-tight">
            <span className="material-symbols-outlined text-lg md:text-xl">analytics</span>
            <span className="hidden sm:inline">CVDebug ATS</span>
            <span className="sm:hidden">ATS</span>
          </div>
          <span className="text-[#475569] text-sm hidden md:inline">/</span>
          <div className="flex items-center gap-1 md:gap-2 min-w-0">
            <span className="text-[10px] md:text-xs font-mono px-1.5 md:px-2 py-0.5 rounded bg-blue-50 text-[#3B82F6] border border-blue-200 truncate max-w-[100px] md:max-w-none">
              {targetRole.toUpperCase()}
            </span>
            <span className="text-[10px] md:text-xs text-[#64748B] font-mono hidden lg:inline">ID: {sessionId}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 md:gap-3">
          <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#475569] border border-[#E2E8F0] rounded hover:bg-[#F8FAFC] transition-colors">
            <span className="material-symbols-outlined text-sm">link</span> Share Link
          </button>
          <button className="hidden sm:flex items-center gap-1.5 px-2 md:px-3 py-1.5 text-xs font-medium text-[#475569] border border-[#E2E8F0] rounded hover:bg-[#F8FAFC] transition-colors">
            <span className="material-symbols-outlined text-sm">download</span>
            <span className="hidden md:inline">Download</span>
          </button>
          <button className="flex sm:hidden items-center justify-center w-8 h-8 text-[#475569] border border-[#E2E8F0] rounded hover:bg-[#F8FAFC] transition-colors">
            <span className="material-symbols-outlined text-lg">more_vert</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs - Mobile Optimized */}
      <nav className="flex items-center justify-start md:justify-center gap-1 md:gap-2 py-3 md:py-4 bg-[#FFFFFF] border-b border-[#E2E8F0] overflow-x-auto px-3 md:px-4 scrollbar-hide">
        <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors rounded-lg whitespace-nowrap">
          <span className="material-symbols-outlined text-base">smart_toy</span>
          <span className="hidden sm:inline">Robot View</span>
        </button>
        <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors rounded-lg whitespace-nowrap">
          <span className="material-symbols-outlined text-base">vpn_key</span>
          <span className="hidden sm:inline">Keywords</span>
        </button>
        <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors rounded-lg whitespace-nowrap">
          <span className="material-symbols-outlined text-base">auto_fix_high</span>
          <span className="hidden sm:inline">Fluff</span>
        </button>
        <button className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors rounded-lg whitespace-nowrap">
          <span className="material-symbols-outlined text-base">dashboard</span> Format
        </button>
        <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-[#3B82F6] bg-blue-50 rounded-lg border border-blue-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] whitespace-nowrap">
          <span className="material-symbols-outlined text-base">support_agent</span> Recruiter
        </button>
      </nav>

      {/* Main Content - Mobile Responsive */}
      <main className="flex-1 p-3 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 max-w-[1920px] mx-auto w-full">
        {/* Left Column - Main Content */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          {/* Candidate Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg p-4 flex items-center justify-between shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#334155] to-[#1E293B] flex items-center justify-center text-[#0F172A] font-bold text-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                {candidateName.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <div>
                <h2 className="font-bold text-[#0F172A] text-lg leading-tight">{candidateName}</h2>
                <div className="flex items-center gap-3 text-xs text-[#64748B] mt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">place</span> {candidateLocation}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">email</span> {candidateEmail}
                  </span>
                  {resumeText && /github\.com\/([a-zA-Z0-9-]+)/i.test(resumeText) && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">link</span>
                      {resumeText.match(/github\.com\/([a-zA-Z0-9-]+)/i)?.[0] || ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-medium text-[#475569]">JD</div>
                <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-[#0F172A] text-xs font-medium">HR</div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#64748B]">Recruiter Admin</p>
                <p className="text-xs font-medium text-[#22C55E]">View as: Machine</p>
              </div>
            </div>
          </motion.div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Format Issues */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] relative overflow-hidden group"
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${hasFormatIssues ? 'bg-[#EF4444]' : 'bg-[#22C55E]'}`}></div>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded ${hasFormatIssues ? 'bg-red-50 text-[#EF4444]' : 'bg-emerald-50 text-[#22C55E]'}`}>
                  <span className="material-symbols-outlined">{hasFormatIssues ? 'warning' : 'verified'}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                    {hasFormatIssues ? 'Format Issues' : 'Format Health'}
                  </h3>
                  <p className="text-sm text-[#64748B]">
                    {hasFormatIssues && hasLinkedInIssue
                      ? 'Missing LinkedIn profile URL detected in header section.'
                      : 'All format checks passed successfully.'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Structure Integrity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[#22C55E]"></div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 rounded text-[#22C55E]">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A] mb-1 uppercase tracking-wider">Structure Integrity</h3>
                  <p className="text-sm text-[#64748B]">
                    PDF Structure is valid and machine-readable (ISO 19005-1).
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Visual Error Tags - Critical & Warning */}
          {(formatIssues.length > 0 || missingKeywords.length > 0 || metricsAnalysis.count < 3) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-[#FFFFFF] border-2 border-[#EF4444]/20 rounded-xl p-6 shadow-[0_10px_40px_-10px_rgba(239,68,68,0.2)]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-50 rounded-lg">
                  <span className="material-symbols-outlined text-[#EF4444]">error</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">ATS Detection Issues</h3>
                  <p className="text-sm text-[#64748B]">Your resume has issues that will likely cause automatic rejection</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Metrics Detection - CRITICAL */}
                {metricsAnalysis.count === 0 && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border-l-4 border-[#EF4444]">
                    <span className="px-2 py-1 bg-[#EF4444] text-white text-xs font-bold rounded uppercase tracking-wider flex-shrink-0">
                      [CRIT]
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#EF4444]">🚨 ATS AUTO-REJECT DETECTED</p>
                      <p className="text-xs font-semibold text-[#0F172A] mt-1">{metricsPercentage}% METRICS DENSITY ({metricsAnalysis.count} found)</p>
                      <p className="text-xs text-[#64748B] mt-1">
                        No quantifiable achievements found (%, $, numbers). 89% of ATS systems auto-reject resumes without metrics.
                      </p>
                      <p className="text-xs text-emerald-700 mt-2 font-semibold">
                        ✅ FIX: Add numbers like "Increased sales by 40%" or "Managed team of 12 developers"
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[#EF4444] flex-shrink-0">cancel</span>
                  </div>
                )}

                {/* Metrics Detection - WARNING */}
                {metricsAnalysis.count > 0 && metricsAnalysis.count < 3 && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border-l-4 border-[#F59E0B]">
                    <span className="px-2 py-1 bg-[#F59E0B] text-white text-xs font-bold rounded uppercase tracking-wider flex-shrink-0">
                      [WARN]
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#0F172A]">⚠️ Low Metrics Density</p>
                      <p className="text-xs font-semibold text-[#0F172A] mt-1">{metricsPercentage}% METRICS DENSITY ({metricsAnalysis.count} found)</p>
                      <p className="text-xs text-[#64748B] mt-1">
                        Only {metricsAnalysis.count} quantifiable metric{metricsAnalysis.count === 1 ? '' : 's'} detected. Add more numbers to strengthen your impact.
                      </p>
                      {metricsAnalysis.examples.length > 0 && (
                        <p className="text-xs text-emerald-700 mt-2">
                          Examples found: {metricsAnalysis.examples.join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-[#F59E0B] flex-shrink-0">warning</span>
                  </div>
                )}

                {/* Format Issues - CRITICAL */}
                {formatIssues.map((issue, idx) => (
                  <div
                    key={`format-${idx}`}
                    className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border-l-4 border-[#EF4444]"
                  >
                    <span className="px-2 py-1 bg-[#EF4444] text-white text-xs font-bold rounded uppercase tracking-wider flex-shrink-0">
                      [CRIT]
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#0F172A]">{issue.issue}</p>
                      <p className="text-xs text-[#64748B] mt-1">
                        Format errors can cause ATS to fail parsing your resume entirely
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[#EF4444] flex-shrink-0">cancel</span>
                  </div>
                ))}

                {/* Missing Keywords - WARNING */}
                {missingKeywords.slice(0, 5).map((keyword, idx) => (
                  <div
                    key={`keyword-${idx}`}
                    className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border-l-4 border-[#F59E0B]"
                  >
                    <span className="px-2 py-1 bg-[#F59E0B] text-white text-xs font-bold rounded uppercase tracking-wider flex-shrink-0">
                      [WARN]
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#0F172A]">Missing keyword: "{keyword}"</p>
                      <p className="text-xs text-[#64748B] mt-1">
                        This keyword appears in the job description but not in your resume
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[#F59E0B] flex-shrink-0">warning</span>
                  </div>
                ))}

                {missingKeywords.length > 5 && (
                  <div className="text-center py-2 text-sm text-[#64748B]">
                    + {missingKeywords.length - 5} more missing keywords
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Parsed Candidate Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col h-[600px] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <div className="flex items-center gap-4">
                <h3 className="text-sm font-bold text-[#0F172A]">Parsed Candidate Data</h3>
                <div className="h-4 w-px bg-slate-200"></div>
                <div className="flex bg-slate-100 rounded p-0.5">
                  <button
                    onClick={() => setViewMode("parsed")}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      viewMode === "parsed"
                        ? 'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] bg-[#FFFFFF] text-[#3B82F6]'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    Parsed View
                  </button>
                  <button
                    onClick={() => setViewMode("raw")}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      viewMode === "raw"
                        ? 'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] bg-[#FFFFFF] text-[#3B82F6]'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    Raw Text
                  </button>
                  <button
                    onClick={() => setViewMode("pdf")}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      viewMode === "pdf"
                        ? 'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] bg-[#FFFFFF] text-[#3B82F6]'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    Original PDF
                  </button>
                </div>
              </div>
              <div className="text-xs font-mono text-[#64748B]">Scan ID: {scanId}</div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed text-[#475569] bg-[#F8FAFC]">
              {viewMode === "parsed" && (
                <>
                  {/* Professional Summary */}
                  <div className="mb-6">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#1E293B] bg-[#F1F5F9] rounded mb-2 border border-[#E2E8F0]">
                      [PROFESSIONAL SUMMARY]
                    </span>
                    <p className="pl-4 border-l-2 border-purple-300 text-[#475569]">
                      {professionalSummary}
                    </p>
                  </div>

                  {/* Skills Extracted */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider text-blue-700 bg-blue-100 rounded border border-blue-200">
                        [SKILLS EXTRACTED]
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                        High Match with JD
                      </span>
                    </div>
                    <div className="pl-4 border-l-2 border-blue-300 flex flex-wrap gap-2">
                      {displaySkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[#FFFFFF] rounded text-[#475569] border border-[#E2E8F0] flex items-center gap-1 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
                        >
                          <span className="material-symbols-outlined text-xs text-[#22C55E]">check</span>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Work History */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-700 bg-amber-100 rounded border border-amber-200">
                        [WORK HISTORY]
                      </span>
                      <span className="text-[10px] text-[#475569] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E2E8F0]">Most Recent</span>
                    </div>
                    <div className="pl-4 border-l-2 border-amber-300">
                      {workExperience ? (
                        <>
                          <h4 className="font-bold text-[#0F172A]">{workExperience.company}</h4>
                          <p className="text-xs text-[#475569] mb-2">{workExperience.duration}</p>
                          <ul className="list-disc list-inside space-y-1 text-[#475569]">
                            {workExperience.bullets.map((bullet, idx) => (
                              <li key={idx}>{bullet}</li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <>
                          <h4 className="font-bold text-[#0F172A]">Professional Experience</h4>
                          <p className="text-xs text-[#475569] mb-2">No work experience data extracted</p>
                          <ul className="list-disc list-inside space-y-1 text-[#475569]">
                            <li className="text-amber-600">Unable to parse work history from resume text</li>
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {viewMode === "raw" && (
                <div
                  className="whitespace-pre-wrap text-xs text-[#475569]"
                  dangerouslySetInnerHTML={annotateResumeText(resumeText)}
                />
              )}

              {viewMode === "pdf" && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-[#475569]">
                    <span className="material-symbols-outlined text-6xl mb-4">description</span>
                    <p className="text-sm">Original PDF preview would appear here</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          {/* Job Fit Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col items-center"
          >
            <h3 className="text-xs font-bold text-[#475569] uppercase tracking-widest mb-4">Job Fit Score</h3>
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-[#475569]"
                  cx="64"
                  cy="64"
                  fill="transparent"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                <circle
                  className="text-[#22C55E]"
                  cx="64"
                  cy="64"
                  fill="transparent"
                  r="56"
                  stroke="currentColor"
                  strokeDasharray="351.86"
                  strokeDashoffset={351.86 - (351.86 * fitScore) / 100}
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-[#0F172A]">{fitScore}</span>
                <span className="text-[10px] font-medium text-[#22C55E] uppercase mt-1">{fitLevel}</span>
              </div>
            </div>
            <p className="text-center text-xs text-[#475569] leading-relaxed px-2">
              Based on skills, experience duration, and semantic role matching algorithms.
            </p>
          </motion.div>

          {/* Seniority Level */}
          {/* Seniority Match Analysis - New Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-2 bg-white border border-[rgba(196,181,253,0.3)] rounded-xl p-8 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#4F46E5] text-xl">track_changes</span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Seniority Match Analysis
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Detected Level */}
              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Detected Level</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold tracking-tight text-slate-900">{seniorityLevel}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-bold uppercase border border-amber-100">
                    Review Required
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="material-symbols-outlined text-sm">analytics</span>
                  <span>Confidence Score: <span className="font-mono text-slate-700">{fitScore}/100</span></span>
                </div>
              </div>

              {/* Experience Audit */}
              <div className="space-y-4 border-l border-slate-100 md:pl-8">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Experience Audit</p>
                <div className="space-y-1">
                  <p className="text-3xl font-bold tracking-tight text-slate-900">
                    {totalYearsExperience > 0 ? `${totalYearsExperience}` : '0'} years
                  </p>
                  <p className="text-xs text-slate-500">
                    Expected requirement: <span className="font-bold text-slate-700">{seniorityLevel}</span>
                  </p>
                </div>
              </div>

              {/* Signal Density */}
              <div className="space-y-4 border-l border-slate-100 md:pl-8">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Signal Density</p>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold tracking-tight text-[#7c3aed]">{foundCount}</p>
                    <span className="text-xs font-medium text-slate-400">signals detected</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Signal strength: <span className={`font-bold ${foundCount >= 8 ? 'text-emerald-500' : foundCount >= 4 ? 'text-amber-500' : 'text-rose-500'}`}>
                      {foundCount >= 8 ? 'STRONG' : foundCount >= 4 ? 'MODERATE' : 'WEAK'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Additional Integrity Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white border border-[rgba(196,181,253,0.3)] rounded-xl p-6 shadow-sm flex flex-col justify-between h-40"
          >
            <div className="flex justify-between items-start">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Readability</p>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                readabilityAnalysis.color === 'emerald' ? 'bg-emerald-50' :
                readabilityAnalysis.color === 'amber' ? 'bg-amber-50' : 'bg-red-50'
              }`}>
                <span className={`material-symbols-outlined text-lg ${
                  readabilityAnalysis.color === 'emerald' ? 'text-emerald-500' :
                  readabilityAnalysis.color === 'amber' ? 'text-amber-500' : 'text-red-500'
                }`}>{readabilityAnalysis.icon}</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{readabilityAnalysis.level}</h3>
              <p className="text-xs text-slate-500 mt-1">Structure follows industry standard patterns</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white border border-[rgba(196,181,253,0.3)] rounded-xl p-6 shadow-sm flex flex-col justify-between h-40"
          >
            <div className="flex justify-between items-start">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Image Traps</p>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                imageTrapsAnalysis.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                imageTrapsAnalysis.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
              }`}>
                {imageTrapsAnalysis.badge}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{imageTrapsAnalysis.status}</h3>
              <p className="text-xs text-slate-500 mt-1">{imageTrapsAnalysis.description}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white border border-[rgba(196,181,253,0.3)] rounded-xl p-6 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden"
          >
            <div className="flex justify-between items-start z-10">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">ATS Global Score</p>
            </div>
            <div className="flex items-end justify-between z-10">
              <div>
                <h3 className="text-3xl font-mono font-bold text-slate-900">
                  {score}<span className="text-slate-300 text-xl">/100</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">Score based on parsing efficiency</p>
              </div>
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-slate-100"
                    cx="32"
                    cy="32"
                    fill="transparent"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    fill="transparent"
                    r="28"
                    stroke="url(#scoreGradient)"
                    strokeDasharray="175.92"
                    strokeDashoffset={175.92 - (175.92 * score) / 100}
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#4F46E5" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute text-[10px] font-mono text-slate-400">{score}%</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#4F46E5]/5 rounded-full blur-2xl"></div>
          </motion.div>

          {/* Technical Gap Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
          >
            <h3 className="text-xs font-bold text-[#475569] uppercase tracking-widest mb-3">Technical Gap Analysis</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-[#475569]">Found (High Importance)</span>
              <span className="text-xs font-mono font-bold text-[#22C55E]">{foundCount}/{requiredCount}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {displaySkills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="text-[10px] px-2 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Soft Skills AI Inference */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#8B5CF6] text-sm">psychology</span>
              <h3 className="text-xs font-bold text-[#475569] uppercase tracking-widest">Soft Skills AI Inference</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#475569]">Leadership</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-1.5 w-full rounded-sm ${i < softSkillsAnalysis.leadership ? 'bg-[#8B5CF6]' : 'bg-slate-200'}`}></div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#475569]">Communication</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-1.5 w-full rounded-sm ${i < softSkillsAnalysis.communication ? 'bg-[#8B5CF6]' : 'bg-slate-200'}`}></div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#475569]">Problem Solving</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-1.5 w-full rounded-sm ${i < softSkillsAnalysis.problemSolving ? 'bg-[#8B5CF6]' : 'bg-slate-200'}`}></div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#475569]">Teamwork</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-1.5 w-full rounded-sm ${i < softSkillsAnalysis.teamwork ? 'bg-[#8B5CF6]' : 'bg-slate-200'}`}></div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="mt-auto grid grid-cols-2 gap-3">
            <button className="col-span-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-slate-400 text-[#475569] hover:bg-[#F8FAFC] rounded-lg transition-all text-sm font-semibold group shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
              <span className="material-symbols-outlined text-base group-hover:text-[#EF4444] transition-colors">close</span>
              Reject
            </button>
            <button className="col-span-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-slate-400 text-[#475569] hover:bg-[#F8FAFC] rounded-lg transition-all text-sm font-semibold group shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
              <span className="material-symbols-outlined text-base group-hover:text-[#F59E0B] transition-colors">schedule</span>
              Waitlist
            </button>
            <button className="col-span-2 flex items-center justify-center gap-2 px-6 py-4 bg-[#22C55E] hover:bg-[#22C55E] text-[#0F172A] rounded-lg shadow-lg hover:shadow-xl transition-all text-base font-bold transform hover:-translate-y-0.5 active:translate-y-0">
              <span className="material-symbols-outlined">check_circle</span>
              Advance to Interview
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
