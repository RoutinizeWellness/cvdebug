import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Target, FileText, TrendingUp, Calendar, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Cast to any to avoid deep type instantiation errors
const apiAny = api as any;

export function MissionStats() {
  const jobHistory = useQuery(apiAny.jobTracker.getJobHistory);
  const applications = useQuery(apiAny.applications.getAllApplications);
  
  const jobsAnalyzed = jobHistory?.length || 0;
  const avgScore = jobHistory && jobHistory.length > 0
    ? Math.round(jobHistory.reduce((acc: number, curr: any) => acc + (curr.score || 0), 0) / jobHistory.length)
    : 0;
  
  const keywordsMatched = jobHistory 
    ? jobHistory.reduce((acc: number, curr: any) => acc + (curr.missingKeywords ? 20 - curr.missingKeywords.length : 20), 0)
    : 0;

  // Calculate interview probability based on real data
  const interviewingCount = applications?.filter((app: any) => app.status === 'interviewing').length || 0;
  const totalApps = applications?.length || 0;
  const interviewProb = totalApps > 0 
    ? Math.round((interviewingCount / totalApps) * 100) 
    : avgScore > 70 ? 65 : avgScore > 50 ? 40 : 15;

  const getProbLabel = (prob: number) => {
    if (prob >= 60) return "High";
    if (prob >= 30) return "Medium";
    return "Low";
  };

  // Detect ATS system from real application URLs
  const getDetectedATS = () => {
    if (!applications || applications.length === 0) return "None Detected";
    
    // Check recent applications for known ATS domains
    for (const app of applications) {
      if (app.jobUrl) {
        const url = app.jobUrl.toLowerCase();
        if (url.includes("greenhouse.io")) return "Greenhouse";
        if (url.includes("lever.co")) return "Lever";
        if (url.includes("workday")) return "Workday";
        if (url.includes("icims")) return "iCIMS";
        if (url.includes("ashby")) return "Ashby";
        if (url.includes("bamboohr")) return "BambooHR";
        if (url.includes("smartrecruiters")) return "SmartRecruiters";
      }
    }
    return "Generic ATS";
  };

  const detectedATS = getDetectedATS();

  return (
    <div className="space-y-4">
      {/* ATS Detection Badge */}
      <div className="bg-gradient-to-r from-primary/10 to-teal-500/10 border border-primary/30 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/20">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Target ATS Detected</p>
            <p className="text-xs text-zinc-400">
              {detectedATS === "None Detected" 
                ? "Add job URLs to detect ATS system" 
                : "Optimizing parsing for this system"}
            </p>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/30 font-bold">
            {detectedATS}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between h-24">
          <div className="flex items-center gap-2 text-zinc-500">
            <FileText className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Jobs Analyzed</span>
          </div>
          <div className="text-2xl font-black text-white">{jobsAnalyzed}</div>
        </div>

        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between h-24">
          <div className="flex items-center gap-2 text-zinc-500">
            <Target className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Keywords Matched</span>
          </div>
          <div className="text-2xl font-black text-white">{keywordsMatched}</div>
        </div>

        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between h-24">
          <div className="flex items-center gap-2 text-zinc-500">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Avg. Score</span>
          </div>
          <div className={`text-2xl font-black ${avgScore >= 75 ? 'text-[#00FF41]' : avgScore >= 50 ? 'text-yellow-500' : 'text-zinc-500'}`}>
            {avgScore}%
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between h-24">
          <div className="flex items-center gap-2 text-zinc-500">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Interview Prob.</span>
          </div>
          <div className="text-2xl font-black text-white">
            {getProbLabel(interviewProb)}
          </div>
          <div className="text-xs text-zinc-500 -mt-1">{interviewProb}%</div>
        </div>
      </div>
    </div>
  );
}