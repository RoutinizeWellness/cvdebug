import { useQuery } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ArrowUpRight } from "lucide-react";

import { api } from "@/convex/_generated/api";

// Cast to any to avoid deep type instantiation errors
const apiAny = api as any;

export function ScoreHistory() {
  const resumes = useQuery(apiAny.resumes.getResumes, {});

  if (!resumes || resumes.length < 2) return null;

  // Sort by creation time ascending to show progress
  const sortedResumes = [...resumes]
    .filter(r => r.score !== undefined && r.score > 0)
    .sort((a, b) => a._creationTime - b._creationTime);

  if (sortedResumes.length === 0) return null;

  const latest = sortedResumes[sortedResumes.length - 1];
  const first = sortedResumes[0];
  const improvement = (latest.score || 0) - (first.score || 0);

  return (
    <div className="mt-6">
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
        <TrendingUp className="h-4 w-4" /> Version History
      </h3>
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Improvement</p>
            <p className={`text-lg font-bold ${improvement >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'} flex items-center gap-1`}>
              {improvement > 0 ? '+' : ''}{improvement} points
              {improvement > 0 && <ArrowUpRight className="h-4 w-4" />}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Latest Score</p>
            <p className="text-lg font-bold text-foreground">{latest.score}</p>
          </div>
        </div>
        
        <div className="relative h-24 w-full flex items-end gap-2">
          {sortedResumes.map((resume, i) => (
            <div key={resume._id} className="flex-1 flex flex-col items-center gap-1 group relative">
              <div 
                className={`w-full rounded-t-sm transition-all duration-500 ${
                  i === sortedResumes.length - 1 ? 'bg-primary' : 'bg-primary/20 group-hover:bg-primary/40'
                }`}
                style={{ height: `${resume.score}%` }}
              ></div>
              <span className="text-[10px] text-muted-foreground absolute -bottom-5 w-max opacity-0 group-hover:opacity-100 transition-opacity">
                v{i + 1}: {resume.score}
              </span>
            </div>
          ))}
        </div>
        <div className="h-px bg-border w-full mt-0"></div>
        <div className="flex justify-between mt-1">
            <span className="text-[10px] text-muted-foreground">v1</span>
            <span className="text-[10px] text-muted-foreground">Current</span>
        </div>
      </div>
    </div>
  );
}