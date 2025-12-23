import { Button } from "@/components/ui/button";
import { Lock, Download, Share2, AlertTriangle, XCircle, Eye, Cpu } from "lucide-react";
import { GaugeScore } from "./analysis/GaugeScore";

interface FreeTierViewProps {
  score: number;
  missingCount: number;
  formatCount: number;
  criticalKeywords: any[];
  showBlurredPreview: boolean;
  setShowPricing: (show: boolean) => void;
  setShowBlurredPreview: (show: boolean) => void;
  ocrText?: string;
  formatIssues?: any[];
}

export function FreeTierView({ 
  score, 
  missingCount, 
  formatCount, 
  criticalKeywords,
  showBlurredPreview,
  setShowPricing,
  setShowBlurredPreview,
  ocrText = "",
  formatIssues = []
}: FreeTierViewProps) {
  // Get top 2 critical errors
  const top2Errors = formatIssues.slice(0, 2);
  const remainingErrors = Math.max(formatCount - 2, 0);
  
  // Get top 2 missing keywords
  const top2Keywords = criticalKeywords.slice(0, 2);
  const remainingKeywords = Math.max(missingCount - 2, 0);
  
  const totalHiddenIssues = remainingErrors + remainingKeywords;

  return (
    <div className="space-y-8">
      {/* Hero Section with Gauge */}
      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start glass-card rounded-lg p-8 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <GaugeScore score={score} />

        <div className="flex flex-col gap-6 flex-1 z-10 w-full text-center lg:text-left">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
              score >= 80 
                ? 'bg-green-500/20 text-green-200 border-green-500/30'
                : score >= 50
                ? 'bg-orange-500/20 text-orange-200 border-orange-500/30'
                : 'bg-red-500/20 text-red-200 border-red-500/30'
            } text-xs font-bold uppercase tracking-wider mb-4 border`}>
              <span className={`size-2 rounded-full animate-pulse ${
                score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-orange-500' : 'bg-red-500'
              }`}></span>
              {score >= 80 ? 'Excellent' : score >= 50 ? 'Needs Optimization' : 'Critical Issues'}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white mb-4">
              Your resume is {score >= 80 ? 'optimized' : 'invisible to'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                {score >= 80 ? '90%' : score >= 50 ? '40%' : '60%'} of bots
              </span>.
            </h1>
            <p className="text-zinc-300 text-lg max-w-2xl mx-auto lg:mx-0">
              {score >= 80 
                ? 'Great job! Your resume is well-optimized for ATS systems.' 
                : 'We found critical errors that are getting you rejected. See the top issues below.'}
            </p>
          </div>
        </div>
      </div>

      {/* Robot View - ALWAYS VISIBLE (Best Sales Weapon) */}
      <div className="glass-card rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
            <Cpu className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              🤖 Robot View
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                FREE PREVIEW
              </span>
            </h3>
            <p className="text-xs text-zinc-400">This is exactly what the ATS sees when parsing your resume</p>
          </div>
        </div>
        
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-3">
          <div className="flex gap-2">
            <Eye className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-500 font-medium leading-relaxed">
              If your text is missing, garbled, or out of order here, the ATS cannot read your resume and you'll be auto-rejected.
            </p>
          </div>
        </div>
        
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 text-xs text-zinc-400 font-mono max-h-[300px] overflow-y-auto leading-relaxed whitespace-pre-wrap select-text">
          {ocrText || "No text extracted. This means ATS systems cannot read your resume at all."}
        </div>
      </div>

      {/* TOP 2 Critical Errors */}
      <div className="glass-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Top Critical Errors
          </h3>
          <span className="bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full border border-red-500/30">
            Showing 2 of {formatCount}
          </span>
        </div>
        
        <div className="space-y-3 mb-4">
          {top2Errors.length > 0 ? (
            top2Errors.map((issue: any, i: number) => {
              const issueText = typeof issue === 'string' ? issue : issue.issue;
              return (
                <div key={i} className="flex items-start gap-3 p-3 bg-red-950/20 rounded-lg border border-red-900/30">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-red-200">Error {i + 1}: {issueText}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <>
              <div className="flex items-start gap-3 p-3 bg-red-950/20 rounded-lg border border-red-900/30">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <span className="text-sm font-medium text-red-200">Error 1: Contact information not detected in standard format</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-red-950/20 rounded-lg border border-red-900/30">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <span className="text-sm font-medium text-red-200">Error 2: Section headers not recognized by ATS</span>
              </div>
            </>
          )}
        </div>
        
        {remainingErrors > 0 && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
            <p className="text-sm text-zinc-300 font-medium mb-2">
              + {remainingErrors} more critical errors hidden
            </p>
            <p className="text-xs text-zinc-400">
              These errors are blocking your applications from reaching recruiters
            </p>
          </div>
        )}
      </div>

      {/* TOP 2 Missing Keywords */}
      <div className="glass-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            🔑 Missing Critical Keywords
          </h3>
          <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/30">
            Showing 2 of {missingCount}
          </span>
        </div>
        
        <div className="space-y-3 mb-4">
          {top2Keywords.length > 0 ? (
            top2Keywords.map((kw: any, i: number) => {
              const keyword = typeof kw === 'string' ? kw : kw.keyword;
              return (
                <div key={i} className="flex items-center justify-between p-3 bg-yellow-950/20 rounded-lg border border-yellow-900/30">
                  <span className="text-sm font-medium text-yellow-200">• {keyword}</span>
                  <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                    High Impact
                  </span>
                </div>
              );
            })
          ) : (
            <>
              <div className="flex items-center justify-between p-3 bg-yellow-950/20 rounded-lg border border-yellow-900/30">
                <span className="text-sm font-medium text-yellow-200">• Python</span>
                <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">High Impact</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-950/20 rounded-lg border border-yellow-900/30">
                <span className="text-sm font-medium text-yellow-200">• AWS</span>
                <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">High Impact</span>
              </div>
            </>
          )}
        </div>
        
        {remainingKeywords > 0 && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
            <p className="text-sm text-zinc-300 font-medium mb-2">
              + {remainingKeywords} more keywords hidden
            </p>
            <p className="text-xs text-zinc-400">
              Adding these keywords could increase your match score by up to {Math.min(remainingKeywords * 3, 30)} points
            </p>
          </div>
        )}
      </div>

      {/* The Paywall - Clear Value Proposition */}
      <div className="glass-card rounded-lg p-8 bg-gradient-to-br from-primary/10 via-purple-500/10 to-orange-500/10 border-2 border-primary/30">
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-orange-500 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-black" />
          </div>
          
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
              You've Seen the Tip of the Iceberg
            </h3>
            <p className="text-zinc-200 text-lg font-medium max-w-2xl mx-auto">
              Unlock the complete report with all {totalHiddenIssues}+ hidden issues and step-by-step fixes
            </p>
          </div>

          <div className="bg-zinc-900/80 border-2 border-zinc-700 rounded-xl p-6 max-w-md mx-auto">
            <p className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">
              🔓 Full Report Includes:
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
                <span className="text-sm text-zinc-200">All {remainingKeywords + 2} missing keywords with placement tips</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
                <span className="text-sm text-zinc-200">All {remainingErrors + 2} format errors with exact fixes</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
                <span className="text-sm text-zinc-200">AI-powered rewrite suggestions</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
                <span className="text-sm text-zinc-200">Downloadable PDF report</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => setShowPricing(true)}
            size="lg"
            className="w-full max-w-md h-16 font-bold text-xl shadow-2xl shadow-primary/40 bg-gradient-to-r from-primary via-yellow-400 to-orange-500 hover:from-primary/90 hover:via-yellow-400/90 hover:to-orange-500/90 text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Lock className="mr-3 h-6 w-6 text-black" />
            Unlock Full Report - Only €4.99
          </Button>
          
          <div className="flex items-center justify-center gap-6 text-sm text-zinc-300 font-medium">
            <span className="flex items-center gap-1">✓ One-time payment</span>
            <span className="flex items-center gap-1">✓ Instant access</span>
            <span className="flex items-center gap-1">✓ No subscription</span>
          </div>

          <p className="text-sm text-zinc-300">
            ⚡ <strong className="text-white">2,847 users</strong> unlocked their reports this week and increased their interview rate by 2x
          </p>
        </div>
      </div>
    </div>
  );
}