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

interface ApplicationCommanderProps {
  onGenerateCoverLetter: (applicationId: string) => void;
}

export function ApplicationCommander({ onGenerateCoverLetter }: ApplicationCommanderProps) {
  const jobHistory = useQuery(apiAny.jobTracker.getJobHistory);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#22C55E]";
    if (score >= 50) return "text-[#F59E0B]";
    return "text-[#EF4444]";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20";
    if (score >= 50) return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20";
    return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20";
  };

  const handleViewDetails = (job: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedJob(job);
  };

  return (
    <>
      <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] overflow-hidden flex flex-col h-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#64748B]" />
            <h3 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider">Application Commander</h3>
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-[#64748B] hover:text-[#0F172A]">
            View All
          </Button>
        </div>

        <div className="overflow-auto">
          <Table>
            <TableHeader className="bg-[#F8FAFC]">
              <TableRow className="hover:bg-transparent border-[#E2E8F0]">
                <TableHead className="text-xs font-bold text-[#64748B] uppercase w-[300px]">Company & Role</TableHead>
                <TableHead className="text-xs font-bold text-[#64748B] uppercase text-center">Match Score</TableHead>
                <TableHead className="text-xs font-bold text-[#64748B] uppercase text-center">Status</TableHead>
                <TableHead className="text-xs font-bold text-[#64748B] uppercase">Gaps Analysis</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!jobHistory || jobHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-[#64748B]">
                    No active missions. Start a new scan to track applications.
                  </TableCell>
                </TableRow>
              ) : (
                jobHistory.map((job: any, i: number) => (
                  <TableRow
                    key={job._id}
                    className="border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors group cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0F172A] group-hover:text-[#64748B] transition-colors">
                          {job.jobTitle || "Untitled Role"}
                        </span>
                        <span className="text-xs text-[#64748B] flex items-center gap-1">
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
                            className="h-7 text-xs border-[#E2E8F0] bg-[#FFFFFF] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {job.status || "Applied"} <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="bg-[#FFFFFF] border-[#E2E8F0]">
                          <DropdownMenuItem className="text-[#64748B] focus:text-[#0F172A] focus:bg-[#F8FAFC]">Interested</DropdownMenuItem>
                          <DropdownMenuItem className="text-[#64748B] focus:text-[#0F172A] focus:bg-[#F8FAFC]">Applied</DropdownMenuItem>
                          <DropdownMenuItem className="text-[#64748B] focus:text-[#0F172A] focus:bg-[#F8FAFC]">Interviewing</DropdownMenuItem>
                          <DropdownMenuItem className="text-[#22C55E] focus:text-[#22C55E] focus:bg-[#22C55E]/10">Offer</DropdownMenuItem>
                          <DropdownMenuItem className="text-[#EF4444] focus:text-[#EF4444] focus:bg-[#EF4444]/10">Rejected</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      {job.missingKeywords && job.missingKeywords.length > 0 ? (
                        <div className="flex items-center gap-2 text-xs text-[#EF4444]">
                          <AlertCircle className="h-3 w-3" />
                          <span>Missing {job.missingKeywords.length} keywords</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-[#22C55E]">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Strong Match</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
                        onClick={(e) => handleViewDetails(job, e)}
                        title="View Details"
                      >
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
        onGenerateCoverLetter={onGenerateCoverLetter}
      />
    </>
  );
}