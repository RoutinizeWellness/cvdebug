import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Mail, Phone, Github, Linkedin, TrendingUp, Zap, Target, Sparkles } from "lucide-react";
import { useState } from "react";
import { PersonalizedRecommendations } from "./analysis/PersonalizedRecommendations";
import { isPaidUser as checkIsPaidUser } from "@/lib/planHelpers";

interface ATSOverviewDashboardProps {
  resume: any;
  user?: any;
  onFixIssue?: (issueType: string) => void;
  onUpgrade?: () => void;
}

export function ATSOverviewDashboard({ resume, user, onFixIssue, onUpgrade }: ATSOverviewDashboardProps) {
  const score = resume?.score || 0; // No fake score - show real data only
  const isPaidUser = checkIsPaidUser(user?.subscriptionTier);

  // Calculate percentile
  const getPercentile = (score: number) => {
    if (score >= 90) return 95;
    if (score >= 85) return 85;
    if (score >= 80) return 75;
    if (score >= 75) return 65;
    if (score >= 70) return 55;
    return Math.max(10, score - 15);
  };

  const percentile = getPercentile(score);

  // Score color and status
  const getScoreColor = (score: number) => {
    if (score >= 85) return { bg: "#22C55E", text: "#22C55E", label: "Elite / Ready to Apply" };
    if (score >= 60) return { bg: "#F59E0B", text: "#F59E0B", label: "The Visibility Gap" };
    return { bg: "#EF4444", text: "#EF4444", label: "Critical Danger" };
  };

  const scoreColor = getScoreColor(score);

  // Critical failures - USE REAL DATA and enhance with contextual messages
  const formatIssues = resume?.formatIssues || [];
  const ocrText = resume?.ocrText || "";

  // Helper to create context-aware messages
  const enhanceIssueMessage = (issue: any) => {
    const issueLower = (issue && typeof issue.issue === 'string') ? issue.issue.toLowerCase() : '';
    let enhancedDescription = issue.atsImpact || "This may affect ATS parsing";
    let enhancedFix = issue.fix || "Review and update this section";

    // Contact info specific messages
    if (issueLower.includes("email") && issueLower.includes("missing")) {
      const hasAt = /@/.test(ocrText);
      enhancedDescription = hasAt
        ? "Email found but may be incorrectly formatted or in an image. Place it in plain text at the top."
        : "No email address detected. ATS systems require contact information to be in plain text.";
      enhancedFix = "Add your professional email (firstname.lastname@domain.com) in the header section as plain text, not in an image.";
    }

    if (issueLower.includes("phone") && issueLower.includes("missing")) {
      const hasPhone = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(ocrText);
      enhancedDescription = hasPhone
        ? "Phone number detected but may not be in standard format for ATS parsing."
        : "No phone number detected. Include it for easier recruiter contact.";
      enhancedFix = "Add phone number in standard format: +1-555-123-4567 or (555) 123-4567 in the header.";
    }

    // Capitalization specific messages
    if (issueLower.includes("capitalization")) {
      const matches = ocrText.match(/\b(github|linkedin|javascript|typescript|nodejs|mongodb|postgresql|mysql|aws|gcp|api)\b/gi) || [];
      const incorrect = matches.filter((m: any) => {
        if (typeof m !== 'string') return false;
        const lower = m.toLowerCase();
        return (lower === 'github' && m !== 'GitHub') ||
               (lower === 'linkedin' && m !== 'LinkedIn') ||
               (lower === 'javascript' && m !== 'JavaScript') ||
               (lower === 'typescript' && m !== 'TypeScript') ||
               (lower === 'nodejs' && m !== 'Node.js') ||
               (lower === 'postgresql' && m !== 'PostgreSQL') ||
               (lower === 'mysql' && m !== 'MySQL') ||
               (lower === 'mongodb' && m !== 'MongoDB');
      });

      if (incorrect.length > 0) {
        const examples = incorrect.slice(0, 3).map((term: any) => {
          if (typeof term !== 'string') return '';
          const lower = term.toLowerCase();
          const correct = lower === 'github' ? 'GitHub' :
                         lower === 'linkedin' ? 'LinkedIn' :
                         lower === 'javascript' ? 'JavaScript' :
                         lower === 'typescript' ? 'TypeScript' :
                         lower === 'nodejs' ? 'Node.js' :
                         lower === 'postgresql' ? 'PostgreSQL' :
                         lower === 'mysql' ? 'MySQL' :
                         lower === 'mongodb' ? 'MongoDB' : term;
          return `${term} → ${correct}`;
        }).filter(Boolean).join(', ');

        enhancedDescription = `Found ${incorrect.length} technical terms with incorrect capitalization. ATS keyword matching is case-sensitive.`;
        enhancedFix = `Correct: ${examples}. Use proper capitalization for all technical terms.`;
      }
    }

    // Repetitive patterns specific messages - ALWAYS extract from actual CV text
    if (issueLower.includes("repetitive") || issueLower.includes("sentence starters")) {
      // Remove bullet points and get clean lines
      const lines = ocrText.split('\n')
        .map((l: string) => l.trim().replace(/^[-•*◦‣⦿⦾]\s*/, ''))
        .filter((l: string) => l.length > 20);

      const starters = lines
        .map((l: string) => {
          const firstWord = l.split(/\s+/)[0];
          return firstWord && typeof firstWord === 'string' ? firstWord.toLowerCase() : '';
        })
        .filter(Boolean);

      const starterCounts: Record<string, number> = {};
      starters.forEach((s: string) => starterCounts[s] = (starterCounts[s] || 0) + 1);

      // Find words that start 3+ lines
      const repetitive = Object.entries(starterCounts)
        .filter(([word, count]) => count >= 3 && word.length > 3) // Ignore short words like "the", "and"
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      if (repetitive.length > 0) {
        const examples = repetitive.map(([word, count]) => `"${word}" (${count}x)`).join(', ');
        enhancedDescription = `Found ${repetitive.length} repetitive action verbs in YOUR CV: ${examples}. Vary sentence starters to show diverse skills and avoid monotony.`;
        enhancedFix = `Replace repetitions with alternatives:\n• "developed" → "engineered", "built", "architected"\n• "led" → "directed", "managed", "spearheaded"\n• "created" → "designed", "established", "launched"`;
      } else {
        // Fallback if no specific examples found
        enhancedDescription = issue.atsImpact || "Repetitive sentence starters reduce readability and make your experience appear monotonous.";
        enhancedFix = "Vary your action verbs. Use different strong verbs to start each bullet point.";
      }
    }

    return { enhancedDescription, enhancedFix };
  };

  const criticalFailures = formatIssues
    .filter((issue: any) => issue.severity === "high" || issue.severity === "critical")
    .slice(0, 3)
    .map((issue: any) => {
      const { enhancedDescription, enhancedFix } = enhanceIssueMessage(issue);
      const issueLower = (issue && typeof issue.issue === 'string') ? issue.issue.toLowerCase() : '';
      return {
        icon: issueLower.includes("image") || issueLower.includes("icon") ? "image" :
              issueLower.includes("metric") || issueLower.includes("number") ? "numbers" :
              issueLower.includes("contact") || issueLower.includes("linkedin") ? "link" :
              issueLower.includes("format") || issueLower.includes("parse") ? "warning" :
              "error",
        title: issue.issue || 'Unknown issue',
        description: enhancedDescription,
        severity: issue.severity,
        howToFix: enhancedFix
      };
    });

  // If no high-severity issues found, check for medium severity
  if (criticalFailures.length === 0) {
    const mediumIssues = formatIssues
      .filter((issue: any) => issue.severity === "medium")
      .slice(0, 3)
      .map((issue: any) => {
        const { enhancedDescription, enhancedFix } = enhanceIssueMessage(issue);
        const issueLower = (issue && typeof issue.issue === 'string') ? issue.issue.toLowerCase() : '';
        return {
          icon: issueLower.includes("image") || issueLower.includes("icon") ? "image" :
                issueLower.includes("metric") || issueLower.includes("number") ? "numbers" :
                issueLower.includes("contact") || issueLower.includes("linkedin") ? "link" :
                issueLower.includes("format") || issueLower.includes("parse") ? "warning" :
                "info",
          title: issue.issue || 'Unknown issue',
          description: enhancedDescription,
          severity: issue.severity,
          howToFix: enhancedFix
        };
      });
    criticalFailures.push(...mediumIssues);
  }

  // Contact & Socials check - DETECT from OCR text (already declared above)
  const emailDetected = /@/.test(ocrText) || !!resume?.email;
  const phoneDetected = /\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/.test(ocrText) || !!resume?.phone;
  const linkedinDetected = /linkedin\.com/i.test(ocrText) || !!resume?.linkedin;
  const githubDetected = /github\.com/i.test(ocrText) || !!resume?.github;

  const contactInfo = {
    email: { detected: emailDetected, value: resume?.email || "Not detected" },
    phone: { detected: phoneDetected, value: resume?.phone || "Not detected" },
    linkedin: { detected: linkedinDetected, value: resume?.linkedin },
    github: { detected: githubDetected, value: resume?.github }
  };

  // Seniority inference based on REAL score and content
  const inferSeniority = (score: number, text: string): string => {
    if (score < 30) return "Entry-Level / Needs Significant Improvement";
    if (score < 50) return "Junior Level";
    if (score < 70) return "Mid-Level";
    if (score < 85) return "Senior Level";
    return "Staff / Principal Level";
  };
  const seniorityLevel = inferSeniority(score, ocrText);

  // Impact breakdown - CALCULATE from real data
  const actionVerbPatterns = /\b(led|managed|created|developed|built|designed|implemented|achieved|improved|increased|reduced|launched|delivered|coordinated|executed|optimized|analyzed|established|drove|scaled|transformed)\b/gi;
  const metricPatterns = /\d+[\d,]*\+?\s*(?:%|percent|users?|customers?|clients?|million|thousand|billion|M|K|B|\$|revenue|cost|time|hours?|days?|weeks?|months?|years?|people|team)/gi;
  const softSkillPatterns = /\b(leadership|communication|collaboration|teamwork|problem.solving|analytical|strategic|creative|innovative|adaptable)\b/gi;

  const actionVerbs = (ocrText.match(actionVerbPatterns) || []).length;
  const quantifiableMetrics = (ocrText.match(metricPatterns) || []).length;
  const softSkills = (ocrText.match(softSkillPatterns) || []).length;

  const impactMetrics = {
    actionVerbs: actionVerbs,
    quantifiableMetrics: quantifiableMetrics,
    targetMetrics: 10,
    softSkills: softSkills
  };

  // Technical vs Human Signal - CALCULATE from real score and issues
  const formatIssueCount = formatIssues.length;
  const technicalSignal = Math.max(20, Math.min(100, score - formatIssueCount * 5)); // Reduce for each format issue
  const humanSignal = Math.max(20, Math.min(100, score - (10 - Math.min(quantifiableMetrics, 10)) * 3)); // Reduce if low metrics

  // SVG gauge settings
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Z-Pattern Layout: Top Row - Mobile Optimized */}
      <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* 1. THE GLOBAL SCORE GAUGE - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] relative overflow-hidden"
        >
          {/* Background glow */}
          <div
            className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: scoreColor.bg }}
          />

          <div className="relative z-10">
            <h3 className="text-base md:text-lg font-bold text-[#0F172A] mb-4 md:mb-6">ATS Compatibility Score</h3>

            {/* Half Gauge - Responsive */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-16 sm:w-40 sm:h-20 md:w-48 md:h-24">
                <svg className="w-full h-full" viewBox="0 0 200 100">
                  {/* Background arc */}
                  <path
                    d="M 20 90 A 80 80 0 0 1 180 90"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Progress arc */}
                  <motion.path
                    d="M 20 90 A 80 80 0 0 1 180 90"
                    fill="none"
                    stroke={scoreColor.bg}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(score / 100) * 251} 251`}
                    initial={{ strokeDasharray: "0 251" }}
                    animate={{ strokeDasharray: `${(score / 100) * 251} 251` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>

                {/* Score number - Responsive */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 md:pb-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-black"
                    style={{ color: scoreColor.text }}
                  >
                    {score}
                  </motion.div>
                  <span className="text-xs md:text-sm text-[#64748B] font-medium">/ 100</span>
                </div>
              </div>

              {/* Status label - Mobile Optimized */}
              <div className="mt-3 md:mt-4 text-center">
                <div
                  className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold mb-1.5 md:mb-2"
                  style={{ backgroundColor: `${scoreColor.bg}15`, color: scoreColor.text }}
                >
                  {score >= 85 ? "✓" : score >= 60 ? "⚠" : "✕"} {scoreColor.label}
                </div>
                <p className="text-xs md:text-sm text-[#475569] font-medium">
                  You are beating <span className="text-[#0F172A] font-bold">{percentile}%</span> of other applicants
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. TOP CRITICAL FAILURES - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
            <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-[#EF4444]" />
            <h3 className="text-base md:text-lg font-bold text-[#0F172A]">Top Critical Failures</h3>
          </div>

          <div className="space-y-2 md:space-y-3">
            {criticalFailures.map((failure: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 md:p-4 rounded-lg md:rounded-xl border-2 ${
                  failure.severity === "high"
                    ? "bg-[#FEF2F2] border-[#EF4444]/30"
                    : "bg-[#FFF7ED] border-[#F59E0B]/30"
                }`}
              >
                <div className="flex items-start gap-2 md:gap-3">
                  <div
                    className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      failure.severity === "high" ? "bg-[#EF4444]/20" : "bg-[#F59E0B]/20"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-sm md:text-[16px] ${
                        failure.severity === "high" ? "text-[#EF4444]" : "text-[#F59E0B]"
                      }`}
                    >
                      {failure.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs md:text-sm font-bold text-[#0F172A] mb-1">{failure.title}</h4>
                    <p className="text-[11px] md:text-xs text-[#475569] mb-2 whitespace-pre-line leading-relaxed">{failure.description}</p>
                    {failure.howToFix && (
                      <div className="mt-1.5 md:mt-2 p-1.5 md:p-2 bg-[#F8FAFC]/50 border border-[#E2E8F0]/30 rounded text-[11px] md:text-xs text-[#0F172A] whitespace-pre-line leading-relaxed">
                        <span className="font-semibold text-[#64748B]">How to fix:</span> {failure.howToFix}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Middle Row: Technical vs Human Signal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
      >
        <h3 className="text-lg font-bold text-[#0F172A] mb-6">Technical vs. Human Signal</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Technical Signal */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#64748B]">settings</span>
                <span className="text-sm font-semibold text-[#0F172A]">Technical Signal</span>
              </div>
              <span className="text-lg font-black text-[#64748B]">{technicalSignal}%</span>
            </div>
            <div className="h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#64748B] to-[#334155] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${technicalSignal}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-[#64748B] mt-2">
              Format, fonts, structure — can the bot read it?
            </p>
          </div>

          {/* Human Signal */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#1E293B]">person</span>
                <span className="text-sm font-semibold text-[#0F172A]">Human Signal</span>
              </div>
              <span className="text-lg font-black text-[#1E293B]">{humanSignal}%</span>
            </div>
            <div className="h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#1E293B] to-[#334155] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${humanSignal}%` }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-[#64748B] mt-2">
              Seniority, power verbs, impact — impressive to humans?
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
          <p className="text-xs text-[#475569]">
            <strong className="text-[#0F172A]">Balance is key:</strong> A readable resume (bot) isn't the same as a selling resume (human). You need both.
          </p>
        </div>
      </motion.div>

      {/* Bottom Row: Contact Info + Seniority + Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* 4. CONTACT & SOCIALS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
        >
          <h3 className="text-sm font-bold text-[#0F172A] mb-4 uppercase tracking-wider">
            Fast Check: Contact & Socials
          </h3>

          <div className="space-y-3">
            {[
              { icon: Mail, label: "Email", ...contactInfo.email },
              { icon: Phone, label: "Phone", ...contactInfo.phone },
              { icon: Linkedin, label: "LinkedIn", ...contactInfo.linkedin },
              { icon: Github, label: "GitHub", ...contactInfo.github }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.detected ? "bg-[#22C55E]/10" : "bg-[#E2E8F0]"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${item.detected ? "text-[#22C55E]" : "text-[#64748B]"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#0F172A]">{item.label}</span>
                    {item.detected ? (
                      <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    ) : (
                      <span className="text-xs text-[#EF4444] font-semibold">Missing</span>
                    )}
                  </div>
                  {item.detected && item.value && (
                    <p className="text-xs text-[#64748B] truncate">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 5. SENIORITY INFERENCE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#F3E8FF] to-[#EFF6FF] rounded-2xl p-6 border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E293B]/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-[#1E293B]" />
              <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
                Seniority Inference
              </h3>
            </div>

            <div className="mb-4">
              <p className="text-xs text-[#64748B] mb-2">AI Inference: You sound like a</p>
              <div className="inline-block px-4 py-2 rounded-xl bg-white border-2 border-[#1E293B] shadow-[0_4px_12px_-2px_rgba(100,116,139,0.3)]">
                <span className="text-lg font-black text-[#0F172A]">{seniorityLevel}</span>
              </div>
            </div>

            {!isPaidUser && (
              <button
                onClick={onUpgrade}
                className="w-full mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-[#1E293B] to-[#334155] text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-[0_4px_12px_-2px_rgba(100,116,139,0.4)] flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Sound like a Senior Architect
              </button>
            )}
          </div>
        </motion.div>

        {/* 6. IMPACT BREAKDOWN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-[#22C55E]" />
            <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
              Impact Breakdown
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#475569]">Action Verbs</span>
                <span className="text-lg font-black text-[#22C55E]">{impactMetrics.actionVerbs}</span>
              </div>
              <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#22C55E] rounded-full"
                  style={{ width: `${Math.min(100, (impactMetrics.actionVerbs / 15) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#475569]">Quantifiable Metrics</span>
                <span className="text-lg font-black text-[#F59E0B]">
                  {impactMetrics.quantifiableMetrics}/{impactMetrics.targetMetrics}
                </span>
              </div>
              <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F59E0B] rounded-full"
                  style={{ width: `${(impactMetrics.quantifiableMetrics / impactMetrics.targetMetrics) * 100}%` }}
                />
              </div>
              <p className="text-xs text-[#EF4444] font-semibold mt-1">
                Target: {impactMetrics.targetMetrics} metrics
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#475569]">Soft Skills</span>
                <span className="text-lg font-black text-[#64748B]">{impactMetrics.softSkills}</span>
              </div>
              <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#64748B] rounded-full"
                  style={{ width: `${Math.min(100, (impactMetrics.softSkills / 8) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Personalized Recommendations - Full Width */}
      {user?._id && (
        <PersonalizedRecommendations
          userId={user._id}
          resumeId={resume?._id}
        />
      )}
    </div>
  );
}
