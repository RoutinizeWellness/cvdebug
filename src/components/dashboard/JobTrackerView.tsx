import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Briefcase, Building2, TrendingUp, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { Button } from "@/components/ui/button";

interface JobTrackerViewProps {
  onCreateNew?: () => void;
}

export function JobTrackerView({ onCreateNew }: JobTrackerViewProps) {
  const jobHistory = useQuery(api.jobTracker.getJobHistory);

  if (!jobHistory) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-[#1E293B] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (jobHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Briefcase className="h-16 w-16 text-[#E2E8F0] mb-4" />
        <h3 className="text-xl font-bold text-[#0F172A] mb-2">No Job Applications Tracked Yet</h3>
        <p className="text-[#64748B] max-w-md mb-8">
          Start uploading resumes with job descriptions to track your application scores and see your progress over time.
        </p>
        <Button
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
        >
          Create My First Application
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Success Analytics</h2>
          <p className="text-[#64748B]">Track application progress and keyword gaps</p>
        </div>
        <div className="text-sm text-[#64748B]">
          {jobHistory.length} {jobHistory.length === 1 ? 'application' : 'applications'} tracked
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Briefcase className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Total Applications</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{jobHistory.length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Avg. Match Score</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {Math.round(jobHistory.reduce((acc: number, job: any) => acc + (job.score || 0), 0) / jobHistory.length) || 0}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Strong Matches</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {jobHistory.filter((job: any) => (job.score || 0) >= 70).length}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {jobHistory.map((job: any, index: number) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 hover:border-[#1E293B]/30 transition-all group shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#1E293B]/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-[#1E293B]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#1E293B] transition-colors">
                      {job.jobTitle || "Untitled Position"}
                    </h3>
                    {job.company && (
                      <div className="flex items-center gap-2 text-sm text-[#64748B]">
                        <Building2 className="h-4 w-4" />
                        {job.company}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-[#64748B]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(job.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-[#E2E8F0]">•</div>
                  <Badge variant="outline" className="bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]">
                    {job.status || "Applied"}
                  </Badge>
                </div>
              </div>

              <div className="flex-1 border-l border-[#E2E8F0] pl-6 md:block hidden">
                <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">Keyword Gap Analysis</h4>
                {job.missingKeywords && job.missingKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {job.missingKeywords.slice(0, 5).map((kw: string, i: number) => (
                      <Badge key={i} variant="secondary" className="bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 border-[#EF4444]/30">
                        {kw}
                      </Badge>
                    ))}
                    {job.missingKeywords.length > 5 && (
                      <span className="text-xs text-[#64748B] self-center">+{job.missingKeywords.length - 5} more</span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[#22C55E] text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Strong keyword match!</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 min-w-[100px]">
                <div className="flex items-center gap-2">
                  <TrendingUp className={`h-5 w-5 ${(job.score || 0) >= 80 ? 'text-[#22C55E]' :
                    (job.score || 0) >= 50 ? 'text-[#F59E0B]' :
                      'text-[#64748B]'
                    }`} />
                  <span className={`text-3xl font-black ${(job.score || 0) >= 80 ? 'text-[#22C55E]' :
                    (job.score || 0) >= 50 ? 'text-[#F59E0B]' :
                      'text-[#64748B]'
                    }`}>
                    {job.score || 0}
                  </span>
                </div>
                <div className="w-full">
                  <Progress value={job.score || 0} className="h-1.5 bg-[#E2E8F0]" />
                </div>
                <div className="text-xs text-[#64748B] font-medium">Match Score</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
