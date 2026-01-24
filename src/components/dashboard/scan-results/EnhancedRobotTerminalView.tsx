import { Terminal, Cpu, Zap, Shield, Activity, Target, TrendingUp, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Cast to any to avoid deep type instantiation errors
const apiAny = api as any;

interface LogEntry {
  line: number;
  type: "info" | "ok" | "warn" | "critical" | "fail" | "command" | "metric";
  message: string;
  detail?: string;
}

interface EnhancedRobotTerminalViewProps {
  resumeId: Id<"resumes">;
  autoAnimate?: boolean;
}

export function EnhancedRobotTerminalView({
  resumeId,
  autoAnimate = true,
}: EnhancedRobotTerminalViewProps) {
  const [displayedLogs, setDisplayedLogs] = useState<LogEntry[]>([]);
  const [cpuUsage, setCpuUsage] = useState(45);
  const [memUsage, setMemUsage] = useState(62);
  const [scanProgress, setScanProgress] = useState(0);

  // Fetch user and resume data
  const user = useQuery(apiAny.users.currentUser);
  const resume = useQuery(apiAny.resumes.getResumeById, { id: resumeId });

  // Generate precise logs based on actual resume analysis
  const generatePreciseLogs = (): LogEntry[] => {
    if (!resume || !resume.analysis) {
      return getLoadingLogs();
    }

    const logs: LogEntry[] = [];
    let lineNum = 1;

    // Header
    logs.push({
      line: lineNum++,
      type: "command",
      message: "./ats-scanner --mode=deep --engine=neural-v4 --precision=high"
    });

    logs.push({
      line: lineNum++,
      type: "info",
      message: "[INIT] 🤖 ATS Robot Engine v4.2.0 - Neural Network Active"
    });

    logs.push({
      line: lineNum++,
      type: "ok",
      message: `[OK] ✓ CV loaded: ${resume.title} • ${resume.mimeType}`
    });

    // Experience Level Detection
    const experienceLevel = user?.experienceLevel || resume.experienceLevel;
    if (experienceLevel) {
      const levelLabels: Record<string, string> = {
        internship: "Internship/Entry (0-1 yrs)",
        entry: "Entry Level (0-2 yrs)",
        junior: "Junior (2-4 yrs)",
        mid: "Mid-Level (4-7 yrs)",
        senior: "Senior (7-10 yrs)",
        lead: "Lead/Staff (10+ yrs)",
        executive: "Executive (C-level)"
      };

      logs.push({
        line: lineNum++,
        type: "ok",
        message: `[DETECT] ✓ Experience level: ${levelLabels[experienceLevel] || experienceLevel}`
      });
    }

    // Role Detection
    if (resume.category) {
      logs.push({
        line: lineNum++,
        type: "info",
        message: `[ANALYZE] 🧠 Role detected: ${resume.category}`
      });
    }

    // Score Analysis
    const score = resume.score || 0;
    const scoreBreakdown = resume.scoreBreakdown;

    logs.push({
      line: lineNum++,
      type: "info",
      message: "[SCAN] 📊 Running comprehensive ATS analysis..."
    });

    // Keywords Analysis
    if (scoreBreakdown?.keywords !== undefined) {
      const keywordScore = scoreBreakdown.keywords;
      if (keywordScore >= 70) {
        logs.push({
          line: lineNum++,
          type: "ok",
          message: `[KEYWORDS] ✓ Keyword optimization: ${keywordScore}/100 - Strong match`
        });
      } else if (keywordScore >= 50) {
        logs.push({
          line: lineNum++,
          type: "warn",
          message: `[KEYWORDS] ⚠️  Keyword optimization: ${keywordScore}/100 - Needs improvement`
        });
      } else {
        logs.push({
          line: lineNum++,
          type: "critical",
          message: `[KEYWORDS] ❌ Keyword optimization: ${keywordScore}/100 - Critical gaps detected`
        });
      }
    }

    // Format Analysis
    if (scoreBreakdown?.format !== undefined) {
      const formatScore = scoreBreakdown.format;
      if (formatScore >= 70) {
        logs.push({
          line: lineNum++,
          type: "ok",
          message: `[FORMAT] ✓ Document structure: ${formatScore}/100 - ATS-friendly`
        });
      } else if (formatScore >= 50) {
        logs.push({
          line: lineNum++,
          type: "warn",
          message: `[FORMAT] ⚠️  Document structure: ${formatScore}/100 - Formatting issues found`
        });
      } else {
        logs.push({
          line: lineNum++,
          type: "fail",
          message: `[FORMAT] ❌ Document structure: ${formatScore}/100 - Major formatting problems`
        });
      }
    }

    // Completeness Analysis
    if (scoreBreakdown?.completeness !== undefined) {
      const completenessScore = scoreBreakdown.completeness;
      if (completenessScore >= 70) {
        logs.push({
          line: lineNum++,
          type: "ok",
          message: `[COMPLETE] ✓ Content completeness: ${completenessScore}/100 - Well-rounded`
        });
      } else if (completenessScore >= 50) {
        logs.push({
          line: lineNum++,
          type: "warn",
          message: `[COMPLETE] ⚠️  Content completeness: ${completenessScore}/100 - Missing sections`
        });
      } else {
        logs.push({
          line: lineNum++,
          type: "critical",
          message: `[COMPLETE] ❌ Content completeness: ${completenessScore}/100 - Critical sections missing`
        });
      }
    }

    // Parse analysis for specific issues
    try {
      const analysis = JSON.parse(resume.analysis);

      // Format Issues
      if (analysis.formatIssues && analysis.formatIssues.length > 0) {
        logs.push({
          line: lineNum++,
          type: "info",
          message: `[ISSUES] 🔍 Found ${analysis.formatIssues.length} formatting issues:`
        });

        analysis.formatIssues.slice(0, 5).forEach((issue: any) => {
          const issueType = issue.issue || issue.type || "Issue";
          const issueSeverity = issue.severity || "medium";

          const logType = issueSeverity === "critical" ? "critical" :
                         issueSeverity === "high" ? "fail" : "warn";

          logs.push({
            line: lineNum++,
            type: logType,
            message: `         → ${issueType}`,
            detail: issue.fix || issue.suggestion
          });
        });
      }

      // Missing Keywords
      if (analysis.missingKeywords && analysis.missingKeywords.length > 0) {
        logs.push({
          line: lineNum++,
          type: "info",
          message: `[KEYWORDS] 📝 Missing ${analysis.missingKeywords.length} critical keywords:`
        });

        analysis.missingKeywords.slice(0, 5).forEach((kw: any) => {
          const keyword = kw.keyword || kw;
          const priority = kw.priority || "medium";

          const logType = priority === "critical" ? "critical" :
                         priority === "high" ? "fail" : "warn";

          logs.push({
            line: lineNum++,
            type: logType,
            message: `         → "${keyword}"`,
            detail: kw.context || kw.section
          });
        });
      }

      // Matched Keywords (successes)
      if (analysis.matchedKeywords && analysis.matchedKeywords.length > 0) {
        logs.push({
          line: lineNum++,
          type: "ok",
          message: `[KEYWORDS] ✓ Found ${analysis.matchedKeywords.length} matching keywords`
        });
      }

    } catch (e) {
      // If analysis can't be parsed, show generic message
      logs.push({
        line: lineNum++,
        type: "info",
        message: "[ANALYZE] 📊 Detailed analysis available in report"
      });
    }

    // Experience-Level Specific Feedback
    if (experienceLevel) {
      logs.push({
        line: lineNum++,
        type: "info",
        message: "[ADAPTIVE] 🎯 Applying experience-level adjustments..."
      });

      switch (experienceLevel) {
        case "internship":
        case "entry":
          logs.push({
            line: lineNum++,
            type: "info",
            message: `         → Entry-level evaluation: Focus on potential, projects, and education`
          });
          if (score < 60) {
            logs.push({
              line: lineNum++,
              type: "ok",
              message: `         → Score boosted: Reduced penalty for limited work experience`
            });
          }
          break;

        case "junior":
          logs.push({
            line: lineNum++,
            type: "info",
            message: `         → Junior evaluation: Expect some quantifiable results`
          });
          break;

        case "mid":
          logs.push({
            line: lineNum++,
            type: "warn",
            message: `         → Mid-level evaluation: Metrics and project ownership expected`
          });
          break;

        case "senior":
        case "lead":
          logs.push({
            line: lineNum++,
            type: "critical",
            message: `         → Senior evaluation: Leadership, architecture, and impact metrics required`
          });
          break;

        case "executive":
          logs.push({
            line: lineNum++,
            type: "critical",
            message: `         → Executive evaluation: Business impact, revenue, and strategic initiatives required`
          });
          break;
      }
    }

    // Final Score
    logs.push({
      line: lineNum++,
      type: "info",
      message: "[PROCESS] ⚙️  Calculating final ATS compatibility score..."
    });

    if (score >= 80) {
      logs.push({
        line: lineNum++,
        type: "ok",
        message: `[RESULT] ✓ ATS Score: ${score}/100 - Excellent! Strong candidate profile`
      });
    } else if (score >= 65) {
      logs.push({
        line: lineNum++,
        type: "ok",
        message: `[RESULT] ✓ ATS Score: ${score}/100 - Good! Minor improvements recommended`
      });
    } else if (score >= 50) {
      logs.push({
        line: lineNum++,
        type: "warn",
        message: `[RESULT] ⚠️  ATS Score: ${score}/100 - Fair! Significant improvements needed`
      });
    } else {
      logs.push({
        line: lineNum++,
        type: "fail",
        message: `[RESULT] ❌ ATS Score: ${score}/100 - Critical! Major revisions required`
      });
    }

    logs.push({
      line: lineNum++,
      type: "ok",
      message: "[COMPLETE] ✓ Scan finished • Full report available below"
    });

    return logs;
  };

  const getLoadingLogs = (): LogEntry[] => {
    return [
      { line: 1, type: "command", message: "./ats-scanner --mode=deep --engine=neural-v4" },
      { line: 2, type: "info", message: "[INIT] 🤖 Loading resume data..." },
      { line: 3, type: "info", message: "[WAIT] ⏳ Processing..." }
    ];
  };

  const logData = resume ? generatePreciseLogs() : getLoadingLogs();

  useEffect(() => {
    if (!autoAnimate) {
      setDisplayedLogs(logData);
      return;
    }

    setDisplayedLogs([]);

    // Animate logs appearing one by one
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < logData.length) {
        setDisplayedLogs((prev) => [...prev, logData[currentIndex]]);
        currentIndex++;
        setScanProgress(Math.round((currentIndex / logData.length) * 100));
      } else {
        clearInterval(interval);
      }
    }, 120); // Slightly faster for more logs

    return () => clearInterval(interval);
  }, [autoAnimate, logData, resume]);

  // Simulate CPU and memory fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage((prev) => Math.min(95, Math.max(35, prev + (Math.random() - 0.5) * 10)));
      setMemUsage((prev) => Math.min(85, Math.max(50, prev + (Math.random() - 0.5) * 8)));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getLogColor = (type: string) => {
    switch (type) {
      case "ok":
        return "text-[#22C55E] drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]";
      case "warn":
        return "text-[#F59E0B] drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]";
      case "critical":
      case "fail":
        return "text-[#EF4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]";
      case "command":
        return "text-[#64748B]";
      case "metric":
        return "text-[#3B82F6] drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]";
      default:
        return "text-[#94a3b8]";
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case "ok":
        return "✓";
      case "warn":
        return "⚠";
      case "critical":
      case "fail":
        return "✗";
      case "metric":
        return "◆";
      default:
        return "●";
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-[#050810] via-[#0c1220] to-[#050810] border-2 border-[#64748B]/40 rounded-2xl overflow-hidden shadow-[0_0_60px_-15px_rgba(59,130,246,0.7),0_0_30px_-10px_rgba(139,92,246,0.5)] flex flex-col h-full min-h-[500px] sm:min-h-[400px]">
      {/* Animated grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, #64748B 1px, transparent 1px),
            linear-gradient(to bottom, #64748B 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#64748B] rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: "100%",
              opacity: 0.3,
            }}
            animate={{
              y: "-10%",
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Animated corner glow */}
      <motion.div
        className="absolute top-0 left-0 w-64 h-64 bg-[#64748B]/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-64 h-64 bg-[#1E293B]/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Terminal Header */}
      <div className="relative z-10 bg-gradient-to-r from-[#1e293b]/95 via-[#1e3a52]/95 to-[#1e293b]/95 backdrop-blur-xl px-4 py-3 border-b-2 border-[#64748B]/40">
        <div className="flex items-center justify-between gap-3">
          {/* Left side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex gap-1.5">
              <motion.div
                className="w-3 h-3 rounded-full bg-[#EF4444] shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [0.9, 1, 0.9],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="w-3 h-3 rounded-full bg-[#F59E0B] shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [0.9, 1, 0.9],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
              <motion.div
                className="w-3 h-3 rounded-full bg-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [0.9, 1, 0.9],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              />
            </div>

            <motion.div
              className="ml-2 sm:ml-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 rounded-lg text-xs font-mono text-[#64748B] border border-[#64748B]/50 backdrop-blur-sm shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              animate={{ borderColor: ["rgba(59,130,246,0.3)", "rgba(59,130,246,0.8)", "rgba(59,130,246,0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">ats_deep_scan.log</span>
              <span className="sm:hidden">scan.log</span>
            </motion.div>

            <AnimatePresence>
              {displayedLogs.length < logData.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-[#22C55E]/10 rounded-lg border border-[#22C55E]/40 text-[10px] text-[#22C55E] font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                >
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <Activity className="h-3 w-3" />
                  ANALYZING
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right side - System stats */}
          <div className="hidden md:flex items-center gap-3 text-[10px] font-mono">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 rounded border border-[#64748B]/30">
              <Cpu className="h-3 w-3 text-[#64748B]" />
              <span className="text-[#64748B]">CPU</span>
              <motion.span
                className="text-[#64748B] font-bold min-w-[32px] text-right"
                animate={{ color: cpuUsage > 70 ? "#F59E0B" : "#64748B" }}
              >
                {cpuUsage.toFixed(0)}%
              </motion.span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 rounded border border-[#1E293B]/30">
              <Shield className="h-3 w-3 text-[#1E293B]" />
              <span className="text-[#64748B]">MEM</span>
              <span className="text-[#1E293B] font-bold min-w-[32px] text-right">{memUsage.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {displayedLogs.length < logData.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 h-1 bg-black/40 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-[#64748B] via-[#1E293B] to-[#22C55E]"
              initial={{ width: "0%" }}
              animate={{ width: `${scanProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </div>

      {/* Terminal Body */}
      <div className="relative z-10 p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-y-auto custom-scrollbar flex-1">
        {/* Scan line effect */}
        {autoAnimate && displayedLogs.length < logData.length && (
          <motion.div
            className="absolute left-0 right-0 h-[3px] pointer-events-none z-20"
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-[#64748B] to-transparent shadow-[0_0_20px_10px_rgba(59,130,246,0.8)]" />
          </motion.div>
        )}

        <div className="text-[#94a3b8] space-y-0.5 relative z-10">
          <AnimatePresence mode="popLayout">
            {displayedLogs.map((log, index) => (
              <motion.div
                key={`${log.line}-${index}`}
                initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-start gap-2 sm:gap-3 group hover:bg-white/5 px-2 sm:px-3 py-1.5 rounded-lg transition-all duration-200 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
              >
                {/* Line number with glow */}
                <motion.span
                  className="text-[#475569] select-none text-xs shrink-0 font-bold tabular-nums min-w-[24px]"
                  whileHover={{ color: "#64748B", textShadow: "0 0 8px rgba(59,130,246,0.8)" }}
                >
                  {String(log.line).padStart(2, "0")}
                </motion.span>

                {/* Icon indicator */}
                <span className={`${getLogColor(log.type)} shrink-0 text-sm`}>
                  {getLogIcon(log.type)}
                </span>

                {/* Content */}
                {log.type === "command" ? (
                  <div className="flex-1 break-words">
                    <span className="text-[#64748B] font-bold drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">root@ats-robot</span>
                    <span className="text-[#64748B]">:</span>
                    <span className="text-[#1E293B] font-bold drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">~/deep-scan</span>
                    <span className="text-[#22C55E] font-bold drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">$</span>
                    <span className="text-white/90 ml-2">{log.message}</span>
                  </div>
                ) : (
                  <div className="flex-1 break-words">
                    <motion.span
                      className={`${getLogColor(log.type)} font-medium`}
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: 1 }}
                    >
                      {log.message}
                    </motion.span>
                    {log.detail && (
                      <div className="text-[#64748B] text-xs mt-1 ml-4">
                        {log.detail}
                      </div>
                    )}
                  </div>
                )}

                {/* Timestamp on hover */}
                <motion.span
                  className="opacity-0 group-hover:opacity-100 text-[10px] text-[#64748B] shrink-0 transition-opacity"
                  initial={{ opacity: 0 }}
                >
                  {new Date().toLocaleTimeString('en-US', { hour12: false })}
                </motion.span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Cursor */}
          {autoAnimate && displayedLogs.length === logData.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5"
            >
              <span className="text-[#475569] select-none text-xs font-bold tabular-nums min-w-[24px]">
                {String(logData.length + 1).padStart(2, "0")}
              </span>
              <span className="text-[#22C55E]">✓</span>
              <span className="text-[#64748B] font-bold drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">root@ats-robot</span>
              <span className="text-[#64748B]">:</span>
              <span className="text-[#1E293B] font-bold drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">~/deep-scan</span>
              <span className="text-[#22C55E] font-bold drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">$</span>
              <motion.span
                className="inline-block w-2 h-4 bg-[#64748B] align-middle ml-2 shadow-[0_0_15px_5px_rgba(59,130,246,1)]"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom status bar with enhanced info */}
      <div className="relative z-10 bg-gradient-to-r from-[#1e293b]/95 via-[#1e3a52]/95 to-[#1e293b]/95 backdrop-blur-xl px-4 py-2 border-t-2 border-[#64748B]/40">
        <div className="flex items-center justify-between text-xs">
          {/* Left status */}
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              className="flex items-center gap-1.5"
              animate={{ opacity: displayedLogs.length < logData.length ? [0.7, 1, 0.7] : 1 }}
              transition={{ duration: 1.5, repeat: displayedLogs.length < logData.length ? Infinity : 0 }}
            >
              <motion.div
                className="w-2 h-2 rounded-full shadow-[0_0_8px_2px_rgba(34,197,94,0.8)]"
                animate={{
                  backgroundColor: displayedLogs.length < logData.length
                    ? ["#22C55E", "#64748B", "#22C55E"]
                    : "#22C55E"
                }}
                transition={{ duration: 2, repeat: displayedLogs.length < logData.length ? Infinity : 0 }}
              />
              <span className="font-mono font-bold text-[#22C55E] hidden sm:inline">
                {displayedLogs.length < logData.length ? "ANALYZING" : "COMPLETE"}
              </span>
            </motion.div>

            <span className="text-[#64748B] font-mono hidden md:inline">•</span>

            <div className="flex items-center gap-1.5 text-[#64748B] font-mono">
              <Zap className="h-3 w-3 text-[#F59E0B]" />
              <span className="hidden sm:inline">Lines:</span>
              <span className="text-white font-bold">{displayedLogs.length}</span>
              <span className="text-[#64748B]">/</span>
              <span>{logData.length}</span>
            </div>

            {displayedLogs.length === logData.length && resume && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-[#22C55E]/10 rounded border border-[#22C55E]/40"
              >
                <span className="text-[10px] text-[#22C55E] font-bold">
                  ✓ SCORE: {resume.score || 0}/100
                </span>
              </motion.div>
            )}
          </div>

          {/* Right info */}
          <div className="flex items-center gap-3">
            <span className="text-[#64748B] font-mono hidden sm:inline text-[10px]">
              Neural Engine v4.2.0
            </span>
            <div className="flex items-center gap-1 text-[10px]">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#64748B]"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[#64748B] font-bold hidden sm:inline">SECURE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Corner accent lights */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#64748B]/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#1E293B]/20 blur-3xl rounded-full pointer-events-none" />
    </div>
  );
}
