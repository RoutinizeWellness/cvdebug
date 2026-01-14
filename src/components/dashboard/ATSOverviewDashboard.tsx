import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Mail, Phone, Github, Linkedin, TrendingUp, Zap, Target, Sparkles } from "lucide-react";
import { useState } from "react";

interface ATSOverviewDashboardProps {
  resume: any;
  user?: any;
  onFixIssue?: (issueType: string) => void;
  onUpgrade?: () => void;
}

export function ATSOverviewDashboard({ resume, user, onFixIssue, onUpgrade }: ATSOverviewDashboardProps) {
  const score = resume?.score || 82;
  const isPaidUser = user?.subscriptionTier === "single_scan" || user?.subscriptionTier === "interview_sprint";

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

  // Critical failures - USE REAL DATA from resume analysis
  const formatIssues = resume?.formatIssues || [];
  const criticalFailures = formatIssues
    .filter((issue: any) => issue.severity === "high" || issue.severity === "critical")
    .slice(0, 3)
    .map((issue: any) => ({
      icon: issue.issue.toLowerCase().includes("image") || issue.issue.toLowerCase().includes("icon") ? "image" :
            issue.issue.toLowerCase().includes("metric") || issue.issue.toLowerCase().includes("number") ? "numbers" :
            issue.issue.toLowerCase().includes("contact") || issue.issue.toLowerCase().includes("linkedin") ? "link" :
            issue.issue.toLowerCase().includes("format") || issue.issue.toLowerCase().includes("parse") ? "warning" :
            "error",
      title: issue.issue,
      description: issue.atsImpact || "This may affect ATS parsing",
      severity: issue.severity,
      howToFix: issue.fix || "Review and update this section"
    }));

  // If no high-severity issues found, check for medium severity
  if (criticalFailures.length === 0) {
    const mediumIssues = formatIssues
      .filter((issue: any) => issue.severity === "medium")
      .slice(0, 3)
      .map((issue: any) => ({
        icon: issue.issue.toLowerCase().includes("image") || issue.issue.toLowerCase().includes("icon") ? "image" :
              issue.issue.toLowerCase().includes("metric") || issue.issue.toLowerCase().includes("number") ? "numbers" :
              issue.issue.toLowerCase().includes("contact") || issue.issue.toLowerCase().includes("linkedin") ? "link" :
              issue.issue.toLowerCase().includes("format") || issue.issue.toLowerCase().includes("parse") ? "warning" :
              "info",
        title: issue.issue,
        description: issue.atsImpact || "This may affect ATS parsing",
        severity: issue.severity,
        howToFix: issue.fix || "Review and update this section"
      }));
    criticalFailures.push(...mediumIssues);
  }

  // Contact & Socials check
  const contactInfo = {
    email: { detected: true, value: resume?.email || "john@example.com" },
    phone: { detected: true, value: resume?.phone || "+1 (555) 123-4567" },
    linkedin: { detected: !!resume?.linkedin, value: resume?.linkedin },
    github: { detected: !!resume?.github, value: resume?.github }
  };

  // Seniority inference
  const seniorityLevel = resume?.inferredSeniority || "Mid-Level Engineer";

  // Impact breakdown
  const impactMetrics = {
    actionVerbs: resume?.actionVerbCount || 12,
    quantifiableMetrics: resume?.metricCount || 4,
    targetMetrics: 10,
    softSkills: resume?.softSkillCount || 5
  };

  // Technical vs Human Signal
  const technicalSignal = resume?.technicalSignal || 78; // Format, fonts, structure
  const humanSignal = resume?.humanSignal || 65; // Seniority, power verbs, impact

  // SVG gauge settings
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  return (
    <div className="space-y-6">
      {/* Z-Pattern Layout: Top Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 1. THE GLOBAL SCORE GAUGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] relative overflow-hidden"
        >
          {/* Background glow */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: scoreColor.bg }}
          />

          <div className="relative z-10">
            <h3 className="text-lg font-bold text-[#0F172A] mb-6">ATS Compatibility Score</h3>

            {/* Half Gauge */}
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-24">
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

                {/* Score number */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-5xl font-black"
                    style={{ color: scoreColor.text }}
                  >
                    {score}
                  </motion.div>
                  <span className="text-sm text-[#64748B] font-medium">/ 100</span>
                </div>
              </div>

              {/* Status label */}
              <div className="mt-4 text-center">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-2"
                  style={{ backgroundColor: `${scoreColor.bg}15`, color: scoreColor.text }}
                >
                  {score >= 85 ? "✓" : score >= 60 ? "⚠" : "✕"} {scoreColor.label}
                </div>
                <p className="text-sm text-[#475569] font-medium">
                  You are beating <span className="text-[#0F172A] font-bold">{percentile}%</span> of other applicants
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. TOP CRITICAL FAILURES */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-[#EF4444]" />
            <h3 className="text-lg font-bold text-[#0F172A]">Top Critical Failures</h3>
          </div>

          <div className="space-y-3">
            {criticalFailures.map((failure: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border-2 ${
                  failure.severity === "high"
                    ? "bg-[#FEF2F2] border-[#EF4444]/30"
                    : "bg-[#FFF7ED] border-[#F59E0B]/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      failure.severity === "high" ? "bg-[#EF4444]/20" : "bg-[#F59E0B]/20"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        failure.severity === "high" ? "text-[#EF4444]" : "text-[#F59E0B]"
                      }`}
                    >
                      {failure.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#0F172A] mb-1">{failure.title}</h4>
                    <p className="text-xs text-[#475569] mb-2">{failure.description}</p>
                    <button
                      onClick={() => onFixIssue?.(failure.title)}
                      className="text-xs font-semibold text-[#3B82F6] hover:underline"
                    >
                      How to fix this →
                    </button>
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
                <span className="material-symbols-outlined text-[20px] text-[#3B82F6]">settings</span>
                <span className="text-sm font-semibold text-[#0F172A]">Technical Signal</span>
              </div>
              <span className="text-lg font-black text-[#3B82F6]">{technicalSignal}%</span>
            </div>
            <div className="h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] rounded-full"
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
                <span className="material-symbols-outlined text-[20px] text-[#8B5CF6]">person</span>
                <span className="text-sm font-semibold text-[#0F172A]">Human Signal</span>
              </div>
              <span className="text-lg font-black text-[#8B5CF6]">{humanSignal}%</span>
            </div>
            <div className="h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] rounded-full"
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
      <div className="grid lg:grid-cols-3 gap-6">
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
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-[#8B5CF6]" />
              <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
                Seniority Inference
              </h3>
            </div>

            <div className="mb-4">
              <p className="text-xs text-[#64748B] mb-2">AI Inference: You sound like a</p>
              <div className="inline-block px-4 py-2 rounded-xl bg-white border-2 border-[#8B5CF6] shadow-[0_4px_12px_-2px_rgba(139,92,246,0.3)]">
                <span className="text-lg font-black text-[#0F172A]">{seniorityLevel}</span>
              </div>
            </div>

            {!isPaidUser && (
              <button
                onClick={onUpgrade}
                className="w-full mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-[0_4px_12px_-2px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2"
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
                <div className="h-full bg-[#22C55E] rounded-full" style={{ width: "75%" }} />
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
                <span className="text-lg font-black text-[#3B82F6]">{impactMetrics.softSkills}</span>
              </div>
              <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: "50%" }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
