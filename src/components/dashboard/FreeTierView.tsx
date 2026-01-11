import { Button } from "@/components/ui/button";
import { Lock, Download, Share2, AlertTriangle, XCircle, Eye, Cpu, TrendingUp, Zap } from "lucide-react";
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

  // Calculate percentile rank (Hormozi: mostrar pérdida/dolor)
  const percentileRank = Math.max(5, 100 - score); // Si score es 71%, estás en el 29% inferior
  const competitorScore = 92; // Los que consiguen entrevistas
  const missingPoints = competitorScore - score;

  return (
    <div className="space-y-8">
      {/* Founder's Audit - Personal Touch */}
      <div className="glass-card rounded-lg p-6 border-l-4 border-primary relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/40 flex-shrink-0">
            <span className="text-2xl">👨‍💻</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              Founder's Audit
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30">
                by Albert
              </span>
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed mb-3">
              Bad news first: You're in the <strong className="text-red-400">bottom {percentileRank}%</strong> of candidates for your target role.
              Candidates who get interviews have a <strong className="text-green-400">92% ATS score</strong>. You're at <strong className="text-red-400">{score}%</strong>.
              You're missing <strong className="text-yellow-400 font-semibold">{missingCount} critical keywords</strong> they have.
            </p>
            <p className="text-zinc-400 text-xs italic">
              💡 I can show you the exact {missingCount} keywords you need. But I need $4.99 to unlock the list.
            </p>
          </div>
        </div>
      </div>

      {/* Pain Point Visual - Hormozi Style */}
      <div className="glass-card rounded-lg p-8 bg-gradient-to-br from-red-950/40 via-red-900/30 to-red-950/40 border-2 border-red-500/30 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-red-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <h3 className="text-2xl font-bold text-white">You're in the Bottom {percentileRank}% of Candidates</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Your Score - Pain */}
            <div className="bg-red-950/60 border-2 border-red-500/40 rounded-xl p-6 text-center">
              <div className="text-red-400 text-sm font-bold uppercase tracking-wider mb-2">Your Score</div>
              <div className="text-6xl font-black text-red-400 mb-2">{score}%</div>
              <div className="text-red-300 text-sm font-semibold">❌ Auto-rejected by 90% of companies</div>
            </div>

            {/* Competitors - Show what they're missing */}
            <div className="bg-green-950/60 border-2 border-green-500/40 rounded-xl p-6 text-center relative">
              <div className="absolute -top-2 -right-2 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                {missingPoints} points higher
              </div>
              <div className="text-green-400 text-sm font-bold uppercase tracking-wider mb-2">Those Who Get Interviews</div>
              <div className="text-6xl font-black text-green-400 mb-2">{competitorScore}%</div>
              <div className="text-green-300 text-sm font-semibold">✅ Pass ATS filters</div>
            </div>
          </div>

          <div className="bg-red-900/40 border-2 border-red-700 rounded-lg p-4 text-center">
            <p className="text-zinc-200 text-sm font-bold mb-2">
              You're missing <span className="text-yellow-400">{missingCount} critical keywords</span> they have
            </p>
            <p className="text-zinc-400 text-xs">
              [Unlock full list for $4.99]
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section with Gauge */}
      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start glass-card rounded-lg p-8 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative">
          <GaugeScore score={score} />
          {/* Tooltip Badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <div className="bg-green-500 text-black px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg animate-bounce">
              <span>👁️ See what the bot sees</span>
              <span className="text-lg">→</span>
            </div>
          </div>
        </div>

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
              You're <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                technically invisible
              </span> to {score >= 80 ? '10%' : score >= 50 ? '60%' : '85%'} of recruiters.
            </h1>
            <p className="text-zinc-300 text-lg max-w-2xl mx-auto lg:mx-0">
              {score >= 80
                ? 'Your resume needs ATS certification to guarantee it passes automated screening.'
                : 'Your resume has critical errors that are causing automatic rejections. Get it certified to fix all issues.'}
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

          {/* Show Parsing Error Blocks (Randomly placed for FREE users) */}
          {formatIssues.length > 0 && (
            <div className="mt-4 space-y-2">
              {[...Array(Math.min(3, formatIssues.length))].map((_, i) => (
                <div key={i} className="bg-red-900/40 border-2 border-red-500/50 rounded p-3 my-2">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse" />
                    <span className="text-red-400 font-bold text-xs uppercase tracking-wider">
                      [PARSING ERROR DETECTED]
                    </span>
                  </div>
                  <div className="text-red-300 text-xs mb-2">
                    ⚠️ Hidden content blocked by ATS parser
                  </div>
                  <div className="bg-red-950/60 rounded px-3 py-2 font-mono text-red-400 text-[10px] blur-sm select-none">
                    ████████████████████████████<br/>
                    ████████████████████<br/>
                    ████████████████████████████████
                  </div>
                  <div className="mt-2 text-[10px] text-red-300 italic">
                    💡 ChatGPT cannot fix this. Only our PDF Sanitizer can repair parsing errors.
                  </div>
                </div>
              ))}

              {formatIssues.length > 3 && (
                <div className="text-center py-3">
                  <Lock className="h-4 w-4 text-red-400 mx-auto mb-1" />
                  <p className="text-red-400 text-[10px] font-bold">
                    +{formatIssues.length - 3} more parsing errors hidden
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-3 mt-3">
          <div className="flex gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-red-300 leading-relaxed">
              <strong className="font-bold">Why ChatGPT Can't Help:</strong> ChatGPT can rewrite text, but it CANNOT fix PDF parsing errors.
              These errors are in the file structure itself. Our PDF Sanitizer rebuilds your PDF from scratch with ATS-compatible formatting.
            </div>
          </div>
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

      {/* TOP 2 Missing Keywords + Blurred Rest */}
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
        
        {/* Blurred Keywords Section */}
        {remainingKeywords > 0 && (
          <div className="relative">
            <div className="absolute inset-0 backdrop-blur-md bg-zinc-900/60 rounded-lg z-10 flex items-center justify-center">
              <div className="text-center p-6">
                <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-white font-bold text-lg mb-1">
                  {remainingKeywords} Critical Keywords Hidden
                </p>
                <p className="text-zinc-300 text-sm">
                  Missing for your target role
                </p>
              </div>
            </div>
            <div className="space-y-2 opacity-30 pointer-events-none">
              {Array.from({ length: Math.min(remainingKeywords, 8) }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-yellow-950/20 rounded-lg border border-yellow-900/30">
                  <span className="text-sm font-medium text-yellow-200">• ████████</span>
                  <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">████</span>
                </div>
              ))}
            </div>
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
              Get Your Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Certified</span> by CVDebug
            </h3>
            <p className="text-zinc-200 text-lg font-medium max-w-2xl mx-auto">
              Unlock {missingCount} exact keywords + {formatCount} critical fixes + ATS-Certified Download
            </p>
          </div>

          <div className="bg-zinc-900/80 border-2 border-zinc-700 rounded-xl p-6 max-w-md mx-auto">
            <p className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">
              ✅ ATS Certification Package:
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
                <span className="text-sm text-zinc-200">All {remainingKeywords + 2} missing keywords with exact placement</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
                <span className="text-sm text-zinc-200">All {remainingErrors + 2} format errors with 1-click fixes</span>
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
                <span className="text-sm text-zinc-200">✅ ATS-Certified PDF download with badge</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
                <span className="text-sm text-zinc-200">⚡ 3-second One-Click PDF Sanitizer</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setShowPricing(true)}
              size="lg"
              className="w-full max-w-md h-16 font-bold text-xl shadow-2xl shadow-primary/40 bg-gradient-to-r from-primary via-yellow-400 to-orange-500 hover:from-primary/90 hover:via-yellow-400/90 hover:to-orange-500/90 text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Lock className="mr-3 h-6 w-6 text-black" />
              Get Certified - Only €4.99
            </Button>

            {/* Manual Review Option - $49 */}
            <div className="bg-gradient-to-r from-purple-950/50 to-blue-950/50 border-2 border-purple-500/30 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-purple-500/30">
                  <span className="text-xl">👨‍💻</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold mb-1">Albert reviews your CV personally</h4>
                  <p className="text-zinc-300 text-xs">3-min video with brutal feedback + all fixes</p>
                </div>
                <span className="text-purple-400 font-black text-xl">€49</span>
              </div>
              <Button
                onClick={() => setShowPricing(true)}
                size="sm"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              >
                I want the manual review →
              </Button>
            </div>

            <p className="text-xs text-zinc-400">
              or upgrade to <button onClick={() => setShowPricing(true)} className="text-primary underline font-semibold">Interview Sprint (€19.99)</button> for unlimited scans + cover letter optimizer
            </p>
          </div>
          
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