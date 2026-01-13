import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Briefcase, Building2, TrendingUp, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function JobTrackerView() {
  const jobHistory = useQuery(api.jobTracker.getJobHistory);

  if (!jobHistory) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (jobHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Briefcase className="h-16 w-16 text-zinc-700 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">No Job Applications Tracked Yet</h3>
        <p className="text-zinc-400 max-w-md">
          Start uploading resumes with job descriptions to track your application scores and see your progress over time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Targeted Match History</h2>
          <p className="text-zinc-500">Track application progress and keyword gaps</p>
        </div>
        <div className="text-sm text-zinc-400">
          {jobHistory.length} {jobHistory.length === 1 ? 'application' : 'applications'} tracked
        </div>
      </div>

      <div className="grid gap-4">
        {jobHistory.map((job: any, index: number) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-6 hover:border-primary/30 transition-all group"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {job.jobTitle || "Untitled Position"}
                    </h3>
                    {job.company && (
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Building2 className="h-4 w-4" />
                        {job.company}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(job.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                  <div className="text-zinc-600">•</div>
                  <Badge variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-400">
                    {job.status || "Applied"}
                  </Badge>
                </div>
              </div>

              <div className="flex-1 border-l border-zinc-800 pl-6 md:block hidden">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Keyword Gap Analysis</h4>
                {job.missingKeywords && job.missingKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {job.missingKeywords.slice(0, 5).map((kw: string, i: number) => (
                      <Badge key={i} variant="secondary" className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border-0">
                        {kw}
                      </Badge>
                    ))}
                    {job.missingKeywords.length > 5 && (
                      <span className="text-xs text-zinc-500 self-center">+{job.missingKeywords.length - 5} more</span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-500 text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Strong keyword match!</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 min-w-[100px]">
                <div className="flex items-center gap-2">
                  <TrendingUp className={`h-5 w-5 ${
                    (job.score || 0) >= 80 ? 'text-green-500' : 
                    (job.score || 0) >= 50 ? 'text-yellow-500' : 
                    'text-zinc-500'
                  }`} />
                  <span className={`text-3xl font-black ${
                    (job.score || 0) >= 80 ? 'text-green-500' : 
                    (job.score || 0) >= 50 ? 'text-yellow-500' : 
                    'text-zinc-500'
                  }`}>
                    {job.score || 0}
                  </span>
                </div>
                <div className="w-full">
                  <Progress value={job.score || 0} className="h-1.5 bg-zinc-800" />
                </div>
                <div className="text-xs text-zinc-500 font-medium">Match Score</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}