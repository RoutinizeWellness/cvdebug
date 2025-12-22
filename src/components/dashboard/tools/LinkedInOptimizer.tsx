import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { TrendingUp, Search, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreGauge } from "./linkedin/ScoreGauge";
import { KeywordCloud } from "./linkedin/KeywordCloud";
import { HeadlineOptimizer } from "./linkedin/HeadlineOptimizer";
import { QuickFixList } from "./linkedin/QuickFixList";
import { LinkedInHeader } from "./linkedin/LinkedInHeader";

const apiAny = api as any;

export function LinkedInOptimizer() {
  const [isScanning, setIsScanning] = useState(false);
  const latestOptimization = useQuery(apiAny.linkedinProfile.getLatestOptimization);
  const optimizeLinkedIn = useAction(apiAny.ai.linkedinOptimizer.optimizeLinkedIn);

  const handleRescan = async () => {
    setIsScanning(true);
    try {
      // For now, we'll use placeholder data since we need profile text input
      toast.info("Please paste your LinkedIn profile text to scan");
      // TODO: Add profile text input dialog
    } catch (error: any) {
      if (error.message === "CREDITS_EXHAUSTED") {
        toast.error("No credits remaining. Please upgrade to continue.");
      } else {
        toast.error("Failed to scan profile. Please try again.");
      }
    } finally {
      setIsScanning(false);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) return `${minutes} mins ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  // Extract real data from latest optimization or show empty state
  const score = latestOptimization?.score || 0;
  const currentHeadline = latestOptimization?.headline?.current || "";
  const optimizedHeadline = latestOptimization?.headline?.optimized || "";
  
  // Extract keywords from optimization result
  const foundKeywords = latestOptimization?.keywordsFound || [];
  const missingKeywords = latestOptimization?.keywordsMissing || [];

  // Extract actionable tips as quick fixes
  const quickFixes = latestOptimization?.actionableTips?.map((tip: any, index: number) => ({
    id: `tip-${index}`,
    title: tip.title || tip,
    description: tip.description,
    completed: tip.completed || false,
  })) || [];

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4">
        <LinkedInHeader
          lastScanned={latestOptimization ? formatTimeAgo(latestOptimization.generatedAt) : "Never"}
          profileUrl={latestOptimization?.linkedinUrl}
          onRescan={handleRescan}
          isScanning={isScanning}
        />
      </div>

      <main className="flex-1 px-6 pb-6 overflow-y-auto">
        {/* Show empty state if no optimization data */}
        {!latestOptimization ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 max-w-md">
              <TrendingUp className="h-16 w-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No LinkedIn Analysis Yet</h3>
              <p className="text-slate-400 text-sm mb-6">
                Click "Re-scan Profile" to analyze your LinkedIn profile and get AI-powered optimization suggestions.
              </p>
              <Button
                onClick={handleRescan}
                className="bg-primary hover:bg-primary/90 text-white font-bold"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Scan Your Profile
              </Button>
            </div>
          </div>
        ) : (
          <>
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Score Card */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Loader2 className="h-24 w-24" />
            </div>
            <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-6">
              Recruiter Visibility Score
            </h3>
            <div className="flex items-center gap-6">
              <ScoreGauge score={score} label={score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work"} />
              <div className="flex-1 flex flex-col gap-2">
                <p className="text-white font-medium leading-snug">
                  {score >= 80 
                    ? "Your profile is highly visible to recruiters!"
                    : "Your profile is visible but misses key technical keywords."}
                </p>
                {score < 80 && (
                  <div className="flex items-center gap-1 text-red-400 text-xs font-medium">
                    <span>⚠️</span>
                    <span>Invisible to {100 - score}% of recruiters</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stat 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                  +12% vs last week
                </span>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Market Positioning</p>
                <p className="text-2xl font-bold text-white">Top 15%</p>
                <p className="text-slate-400 text-xs mt-1">Compared to 1,400+ similar candidates</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Search className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-primary/20 text-primary rounded-full">
                  High Priority
                </span>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Searchability Gap</p>
                <p className="text-2xl font-bold text-white">{missingKeywords.length} Keywords</p>
                <p className="text-slate-400 text-xs mt-1">Missing critical terms for "Senior Frontend"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Headline Optimizer */}
        {currentHeadline && optimizedHeadline && (
          <HeadlineOptimizer 
            currentHeadline={currentHeadline}
            optimizedHeadline={optimizedHeadline}
          />
        )}

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Keyword Cloud */}
          {(foundKeywords.length > 0 || missingKeywords.length > 0) && (
            <KeywordCloud 
              foundKeywords={foundKeywords}
              missingKeywords={missingKeywords}
            />
          )}

          {/* Bio Audit - Placeholder for now */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-white font-bold text-lg mb-4">Bio Audit</h3>
            <p className="text-slate-400 text-sm">
              Bio analysis coming soon. This will show inline suggestions for improving your LinkedIn About section.
            </p>
          </div>
        </div>

        {/* Quick Fix List */}
        {quickFixes.length > 0 && <QuickFixList fixes={quickFixes} />}
        </>
        )}
      </main>
    </div>
  );
}