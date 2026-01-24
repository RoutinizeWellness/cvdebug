import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface KeywordSniperToolProps {
  missingKeywords: Array<{
    keyword: string;
    priority: string;
    frequency?: number;
    impact?: number;
  }>;
  currentBullet: string;
  jobTitle?: string;
  company?: string;
  currentScore: number;
  onApplySuggestion: (newText: string) => void;
}

interface Suggestion {
  id: number;
  text: string;
  scoreIncrease: number;
  keywords: string[];
  hasMetrics: boolean;
}

export function KeywordSniperTool({
  missingKeywords,
  currentBullet,
  jobTitle = "Professional",
  company = "Company",
  currentScore,
  onApplySuggestion
}: KeywordSniperToolProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<number>(1);

  // Initialize optimization log with scan completion only
  const [optimizationLog, setOptimizationLog] = useState<Array<{
    timestamp: string;
    action: string;
    points: number;
    status: "active" | "completed";
  }>>([
    {
      timestamp: "Initial scan",
      action: "Resume analysis completed",
      points: 0,
      status: "completed"
    },
  ]);

  // Categorize keywords by priority
  const highImpactKeywords = useMemo(() =>
    missingKeywords.filter(kw => kw.priority === "high" || kw.priority === "critical").slice(0, 4),
    [missingKeywords]
  );

  const mediumImpactKeywords = useMemo(() =>
    missingKeywords.filter(kw => kw.priority === "medium" || kw.priority === "important").slice(0, 4),
    [missingKeywords]
  );

  // Generate AI suggestions dynamically based on real keywords and current bullet context
  const suggestions: Suggestion[] = useMemo(() => {
    const topKeywords = highImpactKeywords.slice(0, 2).map(kw => kw.keyword);

    // Fallback keywords if none available
    if (topKeywords.length === 0) {
      topKeywords.push("relevant technologies", "best practices");
    } else if (topKeywords.length === 1) {
      topKeywords.push("modern practices");
    }

    // FIRST: Detect role type from jobTitle to provide role-appropriate suggestions
    const roleContext = jobTitle?.toLowerCase() || "";
    const isBusinessAnalyst = /business\s*analyst|ba\b|product\s*analyst|data\s*analyst/i.test(roleContext);
    const isProductManager = /product\s*manager|pm\b|product\s*owner/i.test(roleContext);
    const isDataScience = /data\s*scientist|ml\s*engineer|machine\s*learning/i.test(roleContext);
    const isFinance = /finance|financial\s*analyst|accountant|cpa/i.test(roleContext);
    const isMarketing = /marketing|growth|seo|content/i.test(roleContext);
    const isDesigner = /designer|ux|ui|product\s*design/i.test(roleContext);
    const isEngineer = /engineer|developer|swe|software|devops|backend|frontend/i.test(roleContext);

    // SECOND: Detect context from current bullet to provide relevant suggestions
    const bullet = currentBullet.toLowerCase();
    const isDatabase = /database|sql|data|query|storage|mongodb|postgres|redis/i.test(bullet);
    const isAPI = /api|endpoint|rest|graphql|microservice/i.test(bullet);
    const isFrontend = /frontend|ui|ux|react|vue|angular|component/i.test(bullet);
    const isBackend = /backend|server|node|python|java|spring/i.test(bullet);
    const isDevOps = /deploy|ci\/cd|docker|kubernetes|jenkins|pipeline/i.test(bullet);
    const isCloud = /aws|azure|gcp|cloud|lambda|s3/i.test(bullet);
    const isPerformance = /performance|optimi[zs]e|speed|latency|cache/i.test(bullet);
    const isSecurity = /security|auth|encryption|secure|vulnerability/i.test(bullet);
    const isTeam = /team|lead|mentor|manage|coordinate/i.test(bullet);
    const isTesting = /test|quality|qa|automation|coverage/i.test(bullet);

    // Business/Analyst contexts
    const isAnalysis = /analy[zs]|report|dashboard|insight|metric|kpi/i.test(bullet);
    const isStakeholder = /stakeholder|client|customer|business|requirement/i.test(bullet);
    const isProcess = /process|workflow|efficiency|optimization|streamlin/i.test(bullet);
    const isStrategy = /strategy|strategic|roadmap|initiative|planning/i.test(bullet);

    // PRIORITY 1: Role-based action verbs (overrides tech context)
    let actionVerbs: string[];
    if (isBusinessAnalyst) {
      actionVerbs = ["Analyzed", "Assessed", "Facilitated", "Identified", "Streamlined"];
    } else if (isProductManager) {
      actionVerbs = ["Launched", "Defined", "Prioritized", "Drove", "Delivered"];
    } else if (isDataScience) {
      actionVerbs = ["Modeled", "Predicted", "Analyzed", "Engineered", "Deployed"];
    } else if (isFinance) {
      actionVerbs = ["Audited", "Forecasted", "Reconciled", "Optimized", "Budgeted"];
    } else if (isMarketing) {
      actionVerbs = ["Launched", "Grew", "Optimized", "Generated", "Drove"];
    } else if (isDesigner) {
      actionVerbs = ["Designed", "Prototyped", "Redesigned", "Created", "Iterated"];
    } else if (isDevOps) {
      actionVerbs = ["Automated", "Streamlined", "Orchestrated"];
    } else if (isDatabase) {
      actionVerbs = ["Optimized", "Architected", "Scaled"];
    } else if (isFrontend) {
      actionVerbs = ["Developed", "Enhanced", "Redesigned"];
    } else if (isTeam) {
      actionVerbs = ["Led", "Mentored", "Coordinated"];
    } else {
      actionVerbs = ["Built", "Implemented", "Developed"];
    }

    // PRIORITY 1: Role-based metrics (overrides tech context)
    let metrics1, metrics2, metrics3;
    if (isBusinessAnalyst) {
      if (isAnalysis) {
        metrics1 = "identifying $2.5M in cost savings through data-driven insights and trend analysis";
        metrics2 = "delivering 20+ strategic recommendations adopted by C-suite leadership";
        metrics3 = "improving forecasting accuracy by 40% across 5 business units";
      } else if (isStakeholder) {
        metrics1 = "aligning requirements for 200+ stakeholders across 8 departments";
        metrics2 = "facilitating workshops for 50+ business leaders, driving 95% consensus";
        metrics3 = "reducing requirement gathering cycle time by 45% through structured interviews";
      } else if (isProcess) {
        metrics1 = "streamlining workflows and improving process efficiency by 35% across operations";
        metrics2 = "eliminating bottlenecks that saved 500 hours/quarter in manual effort";
        metrics3 = "optimizing approval workflows from 7 days to 24 hours, boosting satisfaction by 60%";
      } else {
        metrics1 = "generating insights that drove $3M in revenue growth and reduced churn by 25%";
        metrics2 = "creating dashboards used by 100+ executives for data-driven decision making";
        metrics3 = "identifying operational inefficiencies that saved $1.8M annually";
      }
    } else if (isProductManager) {
      metrics1 = "launching features that increased user engagement by 45% and retention by 30%";
      metrics2 = "driving $5M ARR growth through strategic roadmap prioritization";
      metrics3 = "shipping 15+ features on time with 95% stakeholder satisfaction";
    } else if (isDataScience) {
      metrics1 = "building predictive models with 92% accuracy that generated $4M in revenue";
      metrics2 = "deploying ML pipelines processing 10M+ records/day with 99.9% reliability";
      metrics3 = "improving churn prediction by 35%, enabling proactive retention of 2K+ customers";
    } else if (isFinance) {
      metrics1 = "managing $50M budget with 99.5% accuracy and zero audit findings";
      metrics2 = "identifying cost-saving opportunities worth $3.2M through financial analysis";
      metrics3 = "reducing month-end close time by 40% and improving forecast accuracy to 96%";
    } else if (isMarketing) {
      metrics1 = "growing organic traffic by 250% and generating 5K+ qualified leads/quarter";
      metrics2 = "launching campaigns that achieved 8.5% conversion rate and $2M pipeline";
      metrics3 = "optimizing ad spend to reduce CAC by 35% while scaling to 10K customers";
    } else if (isDesigner) {
      metrics1 = "redesigning interfaces that increased user satisfaction by 50% and NPS by 25 points";
      metrics2 = "creating design systems adopted across 30+ products and 80+ designers";
      metrics3 = "improving conversion rates by 40% through user research and A/B testing";
    } else if (isPerformance) {
      metrics1 = "reducing latency by 45% and improving response time to <100ms";
      metrics2 = "increasing throughput by 3x and reducing costs by $50K annually";
      metrics3 = "cutting load time by 60% and boosting user engagement by 35%";
    } else if (isDatabase) {
      metrics1 = "processing 5M+ queries/day with 99.99% uptime";
      metrics2 = "reducing query time by 70% and handling 10x more concurrent connections";
      metrics3 = "scaling to 50TB+ data while maintaining sub-second query performance";
    } else if (isDevOps) {
      metrics1 = "reducing deployment time from 2 hours to 15 minutes";
      metrics2 = "achieving 99.9% uptime and zero-downtime deployments";
      metrics3 = "cutting incident response time by 75% and automating 90% of releases";
    } else if (isFrontend) {
      metrics1 = "improving Core Web Vitals scores by 40% and SEO ranking";
      metrics2 = "reducing bundle size by 50% and achieving 95+ Lighthouse score";
      metrics3 = "increasing user engagement by 35% and reducing bounce rate by 25%";
    } else if (isAPI) {
      metrics1 = "handling 10K+ requests/second with <50ms p95 latency";
      metrics2 = "scaling to 500K+ daily active users with 99.9% availability";
      metrics3 = "reducing API response time by 60% while supporting 3x traffic growth";
    } else if (isCloud) {
      metrics1 = "reducing cloud costs by 40% while improving performance";
      metrics2 = "achieving auto-scaling for 10x traffic spikes with zero downtime";
      metrics3 = "cutting infrastructure expenses by $120K annually through optimization";
    } else if (isSecurity) {
      metrics1 = "achieving SOC 2 compliance and zero security incidents";
      metrics2 = "reducing vulnerabilities by 85% and passing all penetration tests";
      metrics3 = "implementing zero-trust architecture protecting 100K+ users";
    } else if (isTesting) {
      metrics1 = "increasing test coverage from 40% to 95% and reducing bugs by 70%";
      metrics2 = "automating 90% of test suite, cutting QA time by 60%";
      metrics3 = "catching 95% of bugs pre-production through comprehensive testing";
    } else {
      // Generic metrics as fallback
      metrics1 = "improving system efficiency by 40% and reducing operational costs";
      metrics2 = "scaling to support 100K+ users with 99.9% uptime";
      metrics3 = "reducing processing time by 50% and increasing team productivity by 30%";
    }

    // PRIORITY 1: Role-based outcomes (overrides tech context)
    let outcome;
    if (isBusinessAnalyst) {
      outcome = "enabling data-driven decision making and strategic alignment across business units";
    } else if (isProductManager) {
      outcome = "delivering customer-centric solutions that drive growth and competitive advantage";
    } else if (isDataScience) {
      outcome = "transforming data into actionable insights that power business intelligence";
    } else if (isFinance) {
      outcome = "ensuring financial accuracy, compliance, and strategic resource allocation";
    } else if (isMarketing) {
      outcome = "accelerating customer acquisition and brand awareness through data-driven campaigns";
    } else if (isDesigner) {
      outcome = "delivering intuitive, accessible experiences that delight users and drive adoption";
    } else if (isDatabase) {
      outcome = "ensuring data integrity and high availability across distributed systems";
    } else if (isFrontend) {
      outcome = "delivering seamless user experiences across all devices and browsers";
    } else if (isDevOps) {
      outcome = "enabling rapid, reliable deployments with comprehensive monitoring";
    } else if (isAPI) {
      outcome = "providing robust, well-documented APIs for internal and external consumers";
    } else if (isTeam) {
      outcome = "fostering collaboration and knowledge sharing across engineering teams";
    } else {
      outcome = "ensuring robust, maintainable solutions aligned with business objectives";
    }

    // Calculate score increases based on keyword impact
    const baseImpact = highImpactKeywords.slice(0, 2).reduce((sum, kw) => sum + (kw.impact || 7), 0);
    const suggestion1Score = Math.min(Math.round(baseImpact * 1.2), 20);
    const suggestion2Score = Math.min(Math.round(baseImpact * 0.8), 15);
    const suggestion3Score = Math.min(Math.round(baseImpact * 1.0), 18);

    return [
      {
        id: 1,
        text: `${actionVerbs[0]} ${bullet.split(' ').slice(0, 3).join(' ')} using ${topKeywords[0]} and ${topKeywords[1]}, ${metrics1}`,
        scoreIncrease: suggestion1Score,
        keywords: topKeywords,
        hasMetrics: true
      },
      {
        id: 2,
        text: `${actionVerbs[1]} ${bullet.split(' ').slice(0, 2).join(' ')} leveraging ${topKeywords[0]} and ${topKeywords[1]}, ${outcome}`,
        scoreIncrease: suggestion2Score,
        keywords: topKeywords,
        hasMetrics: false
      },
      {
        id: 3,
        text: `${actionVerbs[2]} ${bullet.split(' ').slice(0, 3).join(' ')} with ${topKeywords[0]} and ${topKeywords[1]}, ${metrics3}`,
        scoreIncrease: suggestion3Score,
        keywords: topKeywords,
        hasMetrics: true
      }
    ];
  }, [highImpactKeywords, currentBullet]);

  const newScore = currentScore + (suggestions.find(s => s.id === selectedSuggestion)?.scoreIncrease || 0);
  const scorePercentage = Math.min(newScore, 100);

  // Helper to format relative time
  const getRelativeTime = () => {
    return "Just now";
  };

  const handleInjectKeyword = (keyword: string) => {
    // Calculate points based on keyword priority
    const keywordData = missingKeywords.find(kw => kw.keyword === keyword);
    const points = keywordData?.impact || (keywordData?.priority === "high" || keywordData?.priority === "critical" ? 8 : 5);

    setOptimizationLog(prev => [{
      timestamp: getRelativeTime(),
      action: `Injected "${keyword}" keyword`,
      points,
      status: "active"
    }, ...prev.map(log => ({ ...log, status: "completed" as const }))]);
  };

  const handleApplySuggestion = () => {
    const suggestion = suggestions.find(s => s.id === selectedSuggestion);
    if (suggestion) {
      // Add log entry for applying suggestion
      setOptimizationLog(prev => [{
        timestamp: getRelativeTime(),
        action: `Applied AI suggestion with ${suggestion.keywords.length} keywords`,
        points: suggestion.scoreIncrease,
        status: "active"
      }, ...prev.map(log => ({ ...log, status: "completed" as const }))]);

      onApplySuggestion(suggestion.text);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 w-full min-h-[400px] lg:min-h-[600px]">
      {/* Left Panel: Target Keywords */}
      <section className="lg:col-span-3 flex flex-col gap-4">
        <div className="glass-panel rounded-xl p-5 flex flex-col max-h-[800px]">
          <div className="mb-6">
            <h3 className="font-display font-bold text-lg text-[#0F172A] mb-1">Target Keywords</h3>
            <p className="text-xs text-[#64748B]">Missing signals detected in job description</p>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
            {/* High Impact */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">bolt</span>
                High Impact
              </h4>
              <div className="space-y-3">
                {highImpactKeywords.map((kw, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-[#F8FAFC]/40 border border-white/5 rounded-lg p-3 hover:border-primary/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-sm font-medium text-[#0F172A] group-hover:text-primary transition-colors">
                        {kw.keyword}
                      </span>
                      <Badge className="text-[10px] bg-[#EF4444]/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/20 font-mono">
                        CRITICAL
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-[#64748B]">Frequency: {kw.frequency || 12}x</span>
                      <button
                        onClick={() => handleInjectKeyword(kw.keyword)}
                        className="bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium px-3 py-1.5 rounded border border-primary/20 flex items-center gap-1 transition-all"
                      >
                        <span className="material-symbols-outlined text-[14px]">add_circle</span>
                        Inject
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Medium Impact */}
            {mediumImpactKeywords.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  Medium Impact
                </h4>
                <div className="space-y-3">
                  {mediumImpactKeywords.map((kw, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (highImpactKeywords.length + i) * 0.1 }}
                      className="bg-[#F8FAFC]/40 border border-white/5 rounded-lg p-3 hover:border-[#475569]/50 transition-colors group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-sm font-medium text-[#0F172A] group-hover:text-[#94A3B8] transition-colors">
                          {kw.keyword}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[#64748B]">Frequency: {kw.frequency || 5}x</span>
                        <button
                          onClick={() => handleInjectKeyword(kw.keyword)}
                          className="bg-slate-700/50 hover:bg-slate-700 text-[#475569] text-xs font-medium px-3 py-1.5 rounded border border-white/5 flex items-center gap-1 transition-all"
                        >
                          <span className="material-symbols-outlined text-[14px]">add_circle</span>
                          Inject
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Center Panel: The Lab */}
      <section className="lg:col-span-6 flex flex-col max-h-[800px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-4">
          <div>
            <h1 className="font-display font-bold text-3xl text-[#0F172A] tracking-tight leading-none">The Lab</h1>
            <p className="text-[#64748B] mt-2 font-light">Optimize your experience description</p>
          </div>
          <div className="flex gap-2">
            <button className="text-xs font-mono text-[#64748B] hover:text-[#0F172A] px-3 py-1 bg-[#F8FAFC]/50 rounded border border-white/5">
              Undo
            </button>
            <button className="text-xs font-mono text-[#64748B] hover:text-[#0F172A] px-3 py-1 bg-[#F8FAFC]/50 rounded border border-white/5">
              Redo
            </button>
          </div>
        </div>

        {/* Original Context */}
        <div className="glass-panel rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider">Current Bullet Point</span>
            <span className="text-xs bg-slate-700/50 text-[#475569] px-2 py-0.5 rounded">
              {jobTitle} @ {company}
            </span>
          </div>
          <p className="text-lg text-[#475569] leading-relaxed font-light border-l-2 border-slate-600 pl-4 py-1">
            {currentBullet}
          </p>
        </div>

        {/* AI Suggestions */}
        <div className="flex-1 glass-panel rounded-xl p-1 relative overflow-hidden flex flex-col">
          {/* Glowing border effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-50"></div>

          <div className="p-5 pb-0 flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-teal-400 animate-pulse">auto_awesome</span>
            <h3 className="font-display font-bold text-[#0F172A]">AI Optimization Suggestions</h3>
            <span className="ml-auto text-xs text-teal-400 border border-teal-400/30 bg-teal-400/10 px-2 py-1 rounded-full font-mono">
              Target: {highImpactKeywords.slice(0, 2).map(kw => kw.keyword).join(" + ")}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 pt-0 space-y-4 custom-scrollbar">
            <AnimatePresence>
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedSuggestion(suggestion.id)}
                  className={`rounded-lg p-5 transition-all relative group cursor-pointer ${
                    selectedSuggestion === suggestion.id
                      ? "bg-[#F8FAFC]/80 border-2 border-teal-500 shadow-[0_0_20px_rgba(100,116,139,0.15)]"
                      : "border border-white/5 bg-[#F8FAFC]/30 hover:bg-[#F8FAFC]/50"
                  }`}
                >
                  <div className="absolute top-4 right-4">
                    <div className={`size-5 rounded-full border-2 flex items-center justify-center ${
                      selectedSuggestion === suggestion.id
                        ? "border-teal-500 bg-teal-500"
                        : "border-slate-600 group-hover:border-slate-400"
                    }`}>
                      {selectedSuggestion === suggestion.id && (
                        <span className="material-symbols-outlined text-[#0F172A] text-[14px] font-bold">check</span>
                      )}
                    </div>
                  </div>

                  <p className={`text-base leading-relaxed pr-8 transition-colors ${
                    selectedSuggestion === suggestion.id ? "text-[#0F172A]" : "text-[#475569] group-hover:text-[#0F172A]"
                  }`}>
                    {suggestion.text.split(new RegExp(`(${suggestion.keywords.join("|")})`)).map((part, i) =>
                      suggestion.keywords.includes(part) ? (
                        <span key={i} className="text-primary font-semibold bg-primary/10 px-1 rounded border border-primary/20">
                          {part}
                        </span>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </p>

                  <div className="mt-4 flex items-center gap-4 pt-4 border-t border-white/5">
                    <span className="text-xs font-mono text-green-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                      +{suggestion.scoreIncrease} Score
                    </span>
                    {suggestion.hasMetrics && (
                      <span className="text-xs font-mono text-[#64748B]">Measurable outcome added</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-5 border-t border-white/10 flex gap-4 bg-[#FFFFFF]/40">
            <Button
              onClick={handleApplySuggestion}
              className="flex-1 bg-primary hover:bg-[#64748B] text-[#0F172A] font-medium py-3 px-4 rounded-lg shadow-lg shadow-slate-600/20 transition-all"
            >
              <span className="material-symbols-outlined mr-2">check_circle</span>
              Apply Selected
            </Button>
            <Button
              variant="outline"
              className="px-6 py-3 rounded-lg border border-white/10 hover:bg-[#FFFFFF]/5 text-[#475569] hover:text-[#0F172A] font-medium transition-colors"
            >
              Edit Manually
            </Button>
          </div>
        </div>
      </section>

      {/* Right Panel: Live Score Tracker */}
      <section className="lg:col-span-3">
        <div className="glass-panel rounded-xl p-6 max-h-[800px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display font-bold text-lg text-[#0F172A]">Live Score</h3>
            <div className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              {suggestions.find(s => s.id === selectedSuggestion)?.scoreIncrease || 0}%
            </div>
          </div>

          {/* Score Visualization */}
          <div className="flex flex-col items-center justify-center mb-10 relative">
            <div className="relative size-48">
              <svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle
                  className="text-[#0F172A]"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                ></circle>
                {/* Progress Circle */}
                <motion.circle
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * scorePercentage) / 100 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="text-primary"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="currentColor"
                  strokeDasharray="251.2"
                  strokeLinecap="round"
                  strokeWidth="8"
                  style={{ filter: "drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))" }}
                ></motion.circle>
              </svg>
              <div className="absolute top-0 left-0 size-full flex flex-col items-center justify-center">
                <motion.span
                  key={scorePercentage}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-display font-bold text-[#0F172A]"
                  style={{ textShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}
                >
                  {scorePercentage}
                </motion.span>
                <span className="text-sm text-[#64748B] uppercase tracking-widest text-[10px] mt-1">Match Score</span>
              </div>
            </div>

            <div className="w-full mt-4">
              <div className="flex justify-between text-xs text-[#64748B] mb-1">
                <span>Junior</span>
                <span>Senior</span>
                <span>Expert</span>
              </div>
              <div className="w-full h-1 bg-[#F8FAFC] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scorePercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#475569]"
                ></motion.div>
              </div>
            </div>
          </div>

          {/* Optimization Log */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-4">Optimization Log</h4>
            <div className="relative flex-1">
              {/* Connecting line for timeline */}
              <div className="absolute left-[7px] top-2 bottom-0 w-px bg-slate-700"></div>

              <div className="space-y-6 pl-6 overflow-y-auto h-full pr-2 pb-4 custom-scrollbar">
                {optimizationLog.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative"
                  >
                    <div className={`absolute -left-[21px] top-1 size-4 rounded-full bg-[#FFFFFF] border-2 z-10 ${
                      log.status === "active" ? "border-primary" : "border-slate-600"
                    }`}></div>
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-mono ${log.status === "active" ? "text-[#64748B]" : "text-[#64748B]"}`}>
                        {log.timestamp}
                      </span>
                      <p className={`text-sm ${log.status === "active" ? "text-[#475569]" : "text-[#64748B]"}`}>
                        {log.action}
                      </p>
                      {log.points > 0 && (
                        <span className={`text-xs font-mono ${log.status === "active" ? "text-green-400" : "text-green-400/70"}`}>
                          +{log.points} pts
                        </span>
                      )}
                      {log.points === 0 && (
                        <span className="text-xs text-[#475569] font-mono">Baseline set</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
