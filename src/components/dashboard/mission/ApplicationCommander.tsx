import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Briefcase, MoreHorizontal, ArrowRight, AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { KeywordSniperPanel } from "./KeywordSniperPanel";
import { useState } from "react";

// Cast to any to avoid deep type instantiation errors
const apiAny = api as any;

export function ApplicationCommander() {
  const jobHistory = useQuery(apiAny.jobTracker.getJobHistory);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#00FF41]";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/20";
    if (score >= 50) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
  };

  return (
    <>
      <div className="rounded-xl border border-zinc-800 bg-[#0A0A0A] overflow-hidden flex flex-col h-full">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-zinc-400" />
            <h3 className="font-bold text-sm text-zinc-200 uppercase tracking-wider">Application Commander</h3>
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-zinc-500 hover:text-white">
            View All
          </Button>
        </div>

        <div className="overflow-auto">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="hover:bg-transparent border-zinc-800">
                <TableHead className="text-xs font-bold text-zinc-500 uppercase w-[300px]">Company & Role</TableHead>
                <TableHead className="text-xs font-bold text-zinc-500 uppercase text-center">Match Score</TableHead>
                <TableHead className="text-xs font-bold text-zinc-500 uppercase text-center">Status</TableHead>
                <TableHead className="text-xs font-bold text-zinc-500 uppercase">Gaps Analysis</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!jobHistory || jobHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-zinc-500">
                    No active missions. Start a new scan to track applications.
                  </TableCell>
                </TableRow>
              ) : (
                jobHistory.map((job: any, i: number) => (
                  <TableRow 
                    key={job._id} 
                    className="border-zinc-800 hover:bg-zinc-900/30 transition-colors group cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-200 group-hover:text-white transition-colors">
                          {job.jobTitle || "Untitled Role"}
                        </span>
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          {job.company || "Unknown Company"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="relative h-10 w-10 flex items-center justify-center">
                          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-zinc-800"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className={`${getScoreColor(job.score || 0)} transition-all duration-1000 ease-out`}
                              strokeDasharray={`${job.score || 0}, 100`}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                          </svg>
                          <span className={`text-[10px] font-black ${getScoreColor(job.score || 0)}`}>
                            {job.score || 0}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {job.status || "Applied"} <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="bg-[#0A0A0A] border-zinc-800">
                          <DropdownMenuItem className="text-zinc-400 focus:text-white focus:bg-zinc-800">Interested</DropdownMenuItem>
                          <DropdownMenuItem className="text-zinc-400 focus:text-white focus:bg-zinc-800">Applied</DropdownMenuItem>
                          <DropdownMenuItem className="text-zinc-400 focus:text-white focus:bg-zinc-800">Interviewing</DropdownMenuItem>
                          <DropdownMenuItem className="text-green-500 focus:text-green-400 focus:bg-green-900/20">Offer</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500 focus:text-red-400 focus:bg-red-900/20">Rejected</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      {job.missingKeywords && job.missingKeywords.length > 0 ? (
                        <div className="flex items-center gap-2 text-xs text-red-400">
                          <AlertCircle className="h-3 w-3" />
                          <span>Missing {job.missingKeywords.length} keywords</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-green-500">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Strong Match</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <KeywordSniperPanel 
        open={!!selectedJob} 
        onOpenChange={(open) => !open && setSelectedJob(null)} 
        job={selectedJob} 
      />
    </>
  );
}