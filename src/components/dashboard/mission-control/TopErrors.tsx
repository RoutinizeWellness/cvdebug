import { Bug, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";

const apiAny = api as any;

interface Error {
  type: "CRIT" | "WARN" | "INFO";
  message: string;
  details: string;
}

export function TopErrors() {
  // Fetch REAL data from backend
  const resumes = useQuery(apiAny.resumes.getResumes);

  const { errors, resumeTitle } = useMemo(() => {
    const latestResume = resumes && resumes.length > 0
      ? resumes.find((r: any) => r.status === "completed" && r.score) || resumes[0]
      : null;

    if (!latestResume) {
      return {
        errors: [],
        resumeTitle: "No CV loaded"
      };
    }

    const calculatedErrors: Error[] = [];

    // Get missing keywords
    const missingKeywords = latestResume.missingKeywords || [];
    const topMissingKeywords = Array.isArray(missingKeywords)
      ? missingKeywords.slice(0, 3)
      : [];

    // Add missing keywords as errors
    topMissingKeywords.forEach((kw: any, index: number) => {
      const keyword = typeof kw === 'string' ? kw : kw.keyword || kw.term;
      if (keyword && index === 0) {
        calculatedErrors.push({
          type: "CRIT",
          message: `Missing critical keyword "${keyword}"`,
          details: "match_score impact: -10%",
        });
      } else if (keyword) {
        calculatedErrors.push({
          type: "WARN",
          message: `Missing keyword "${keyword}"`,
          details: "match_score impact: -5%",
        });
      }
    });

    // Add formatting issues from resume analysis
    const formatIssues = latestResume.formatIssues || [];
    if (formatIssues.length > 0) {
      const topIssue = formatIssues[0];
      const issueMessage = typeof topIssue === 'string' ? topIssue : topIssue.message || topIssue.issue;
      if (issueMessage) {
        calculatedErrors.push({
          type: calculatedErrors.length === 0 ? "CRIT" : "WARN",
          message: issueMessage,
          details: "formatting - affects ATS parsing",
        });
      }
    }

    // If no errors, add success message
    if (calculatedErrors.length === 0) {
      calculatedErrors.push({
        type: "INFO",
        message: "No critical issues found",
        details: "Resume is well-optimized",
      });
    }

    return {
      errors: calculatedErrors.slice(0, 3), // Show max 3 errors
      resumeTitle: latestResume.title || latestResume.fileName || "Master_CV.pdf"
    };
  }, [resumes]);

  const getErrorColor = (type: string) => {
    switch (type) {
      case "CRIT":
        return "text-rose-500";
      case "WARN":
        return "text-[#F59E0B]";
      default:
        return "text-[#3B82F6]";
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[#0F172A] text-lg font-bold flex items-center gap-2">
          <Bug className="h-5 w-5 text-rose-500" />
          Top Errors
        </h3>
        <span className="text-xs text-[#64748B] font-mono">{resumeTitle}</span>
      </div>

      <div className="glass-panel rounded-xl flex flex-col h-full bg-[#0d1117] border-[#E2E8F0] overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] shadow-black/50">
        {/* Terminal Header */}
        <div className="bg-[#161b22] px-4 py-2 flex items-center gap-2 border-b border-[#E2E8F0]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></div>
          </div>
          <span className="ml-2 text-[10px] text-[#64748B] font-mono">console — bash</span>
        </div>

        {/* Terminal Body */}
        <div className="p-4 font-mono text-xs flex flex-col gap-3 overflow-y-auto flex-1">
          {errors.map((error, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex gap-3 group cursor-pointer"
            >
              <span className={`${getErrorColor(error.type)} font-bold shrink-0`}>
                [{error.type}]
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-[#475569] group-hover:text-[#0F172A] transition-colors">
                  {error.message}
                </span>
                <span className="text-[#475569]">{error.details}</span>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-2 items-center mt-2 animate-pulse"
          >
            <span className="text-[#22C55E]">➜</span>
            <span className="w-2 h-4 bg-[#F8FAFC]0 block"></span>
          </motion.div>
        </div>

        {/* Action Button */}
        <div className="p-3 border-t border-[#E2E8F0] bg-[#161b22]">
          <Button className="w-full flex items-center justify-center gap-2 rounded-md h-8 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-bold border border-rose-500/20 hover:border-rose-500/40 transition-all">
            <Wrench className="h-4 w-4" />
            DEBUG MASTER CV
          </Button>
        </div>
      </div>
    </section>
  );
}
