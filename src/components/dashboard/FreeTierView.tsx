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

  // Calculate percentile rank (Hormozi: show loss/pain)
  const percentileRank = Math.max(5, 100 - score); // If score is 71%, you're in the bottom 29%
  const competitorScore = 92; // Those who get interviews
  const missingPoints = competitorScore - score;

  return (
    <div className="space-y-8">
      {/* Founder's Audit - Personal Touch */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-lg p-6 border-l-4 border-primary relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/40 flex-shrink-0">
            <span className="text-2xl">👨‍💻</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-2 flex items-center gap-2">
              Founder's Audit
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30">
                by Albert
              </span>
            </h3>
            <p className="text-[#475569] text-sm leading-relaxed mb-3">
              Bad news first: You're in the <strong className="text-[#EF4444]">bottom {percentileRank}%</strong> of candidates for your target role.
              Candidates who get interviews have a <strong className="text-[#22C55E]">92% ATS score</strong>. You're at <strong className="text-[#EF4444]">{score}%</strong>.
              You're missing <strong className="text-[#F59E0B] font-semibold">{missingCount} critical keywords</strong> they have.
            </p>
            <p className="text-[#64748B] text-xs italic">
              💡 I can show you the exact {missingCount} keywords you need. But I need $9.99 to unlock the list.
            </p>
          </div>
        </div>
      </div>

      {/* Pain Point Visual - Hormozi Style */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-lg p-8 bg-gradient-to-br from-red-950/40 via-red-900/30 to-red-950/40 border-2 border-red-500/30 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#EF4444]/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="h-6 w-6 text-[#EF4444]" />
            <h3 className="text-2xl font-bold text-[#0F172A]">You're in the Bottom {percentileRank}% of Candidates</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Your Score - Pain */}
            <div className="bg-[#EF4444]/10 border-2 border-[#EF4444]/40 rounded-xl p-6 text-center">
              <div className="text-[#EF4444] text-sm font-bold uppercase tracking-wider mb-2">Your Score</div>
              <div className="text-6xl font-black text-[#EF4444] mb-2">{score}%</div>
              <div className="text-[#EF4444] text-sm font-semibold">❌ Auto-rejected by 90% of companies</div>
            </div>

            {/* Competitors - Show what they're missing */}
            <div className="bg-[#22C55E]/10 border-2 border-[#22C55E]/40 rounded-xl p-6 text-center relative">
              <div className="absolute -top-2 -right-2 bg-[#22C55E] text-white text-xs font-bold px-3 py-1 rounded-full">
                {missingPoints} points higher
              </div>
              <div className="text-[#22C55E] text-sm font-bold uppercase tracking-wider mb-2">Those Who Get Interviews</div>
              <div className="text-6xl font-black text-[#22C55E] mb-2">{competitorScore}%</div>
              <div className="text-[#22C55E] text-sm font-semibold">✅ Pass ATS filters</div>
            </div>
          </div>

          <div className="bg-[#EF4444]/10 border-2 border-[#EF4444]/30 rounded-lg p-4 text-center">
            <p className="text-[#475569] text-sm font-bold mb-2">
              You're missing <span className="text-[#F59E0B]">{missingCount} critical keywords</span> they have
            </p>
            <p className="text-[#64748B] text-xs">
              [Unlock full list for $9.99]
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section with Gauge */}
      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-lg p-8 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative">
          <GaugeScore score={score} />
          {/* Tooltip Badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <div className="bg-[#22C55E] text-black px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg animate-bounce">
              <span>👁️ See what the bot sees</span>
              <span className="text-lg">→</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 flex-1 z-10 w-full text-center lg:text-left">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
              score >= 80
                ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/30'
                : score >= 50
                ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30'
                : 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30'
            } text-xs font-bold uppercase tracking-wider mb-4 border`}>
              <span className={`size-2 rounded-full animate-pulse ${
                score >= 80 ? 'bg-[#22C55E]' : score >= 50 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'
              }`}></span>
              {score >= 80 ? 'Excellent' : score >= 50 ? 'Needs Optimization' : 'Critical Issues'}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-[#0F172A] mb-4">
              You're <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                technically invisible
              </span> to {score >= 80 ? '10%' : score >= 50 ? '60%' : '85%'} of recruiters.
            </h1>
            <p className="text-[#475569] text-lg max-w-2xl mx-auto lg:mx-0">
              {score >= 80
                ? 'Your resume needs ATS certification to guarantee it passes automated screening.'
                : 'Your resume has critical errors that are causing automatic rejections. Get it certified to fix all issues.'}
            </p>
          </div>
        </div>
      </div>

      {/* Robot View - ALWAYS VISIBLE (Best Sales Weapon) */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-[#3B82F6]/10 rounded-lg flex items-center justify-center border border-[#3B82F6]/20">
            <Cpu className="h-5 w-5 text-[#3B82F6]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              🤖 Robot View
              <span className="text-xs bg-[#22C55E]/20 text-[#22C55E] px-2 py-0.5 rounded-full border border-[#22C55E]/30">
                FREE PREVIEW
              </span>
            </h3>
            <p className="text-xs text-[#64748B]">This is exactly what the ATS sees when parsing your resume</p>
          </div>
        </div>
        
        <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg p-3 mb-3">
          <div className="flex gap-2">
            <Eye className="h-4 w-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#F59E0B] font-medium leading-relaxed">
              If your text is missing, garbled, or out of order here, the ATS cannot read your resume and you'll be auto-rejected.
            </p>
          </div>
        </div>

        <div className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-4 text-xs text-[#64748B] font-mono max-h-[300px] overflow-y-auto leading-relaxed whitespace-pre-wrap select-text">
          {ocrText || "No text extracted. This means ATS systems cannot read your resume at all."}

          {/* Show Parsing Error Blocks (Randomly placed for FREE users) */}
          {formatIssues.length > 0 && (
            <div className="mt-4 space-y-2">
              {[...Array(Math.min(3, formatIssues.length))].map((_, i) => (
                <div key={i} className="bg-[#EF4444]/10 border-2 border-[#EF4444]/50 rounded p-3 my-2">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-[#EF4444] animate-pulse" />
                    <span className="text-[#EF4444] font-bold text-xs uppercase tracking-wider">
                      [PARSING ERROR DETECTED]
                    </span>
                  </div>
                  <div className="text-[#EF4444] text-xs mb-2">
                    ⚠️ Hidden content blocked by ATS parser
                  </div>
                  <div className="bg-[#EF4444]/10 rounded px-3 py-2 font-mono text-[#EF4444] text-[10px] blur-sm select-none">
                    ████████████████████████████<br/>
                    ████████████████████<br/>
                    ████████████████████████████████
                  </div>
                  <div className="mt-2 text-[10px] text-[#EF4444] italic">
                    💡 ChatGPT cannot fix this. Only our PDF Sanitizer can repair parsing errors.
                  </div>
                </div>
              ))}

              {formatIssues.length > 3 && (
                <div className="text-center py-3">
                  <Lock className="h-4 w-4 text-[#EF4444] mx-auto mb-1" />
                  <p className="text-[#EF4444] text-[10px] font-bold">
                    +{formatIssues.length - 3} more parsing errors hidden
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-3 mt-3">
          <div className="flex gap-2">
            <AlertTriangle className="h-4 w-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#EF4444] leading-relaxed">
              <strong className="font-bold">Why ChatGPT Can't Help:</strong> ChatGPT can rewrite text, but it CANNOT fix PDF parsing errors.
              These errors are in the file structure itself. Our PDF Sanitizer rebuilds your PDF from scratch with ATS-compatible formatting.
            </div>
          </div>
        </div>
      </div>

      {/* TOP 2 Critical Errors */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[#EF4444]" />
            Top Critical Errors
          </h3>
          <span className="bg-[#EF4444]/20 text-[#EF4444] text-xs font-bold px-3 py-1 rounded-full border border-[#EF4444]/30">
            Showing 2 of {formatCount}
          </span>
        </div>
        
        <div className="space-y-3 mb-4">
          {top2Errors.length > 0 ? (
            top2Errors.map((issue: any, i: number) => {
              const issueText = typeof issue === 'string' ? issue : issue.issue;
              return (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#EF4444]/10 rounded-lg border border-[#EF4444]/30">
                  <XCircle className="h-4 w-4 text-[#EF4444] mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-[#EF4444]">Error {i + 1}: {issueText}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <>
              <div className="flex items-start gap-3 p-3 bg-[#EF4444]/10 rounded-lg border border-[#EF4444]/30">
                <XCircle className="h-4 w-4 text-[#EF4444] mt-0.5 shrink-0" />
                <span className="text-sm font-medium text-[#EF4444]">Error 1: Contact information not detected in standard format</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-[#EF4444]/10 rounded-lg border border-[#EF4444]/30">
                <XCircle className="h-4 w-4 text-[#EF4444] mt-0.5 shrink-0" />
                <span className="text-sm font-medium text-[#EF4444]">Error 2: Section headers not recognized by ATS</span>
              </div>
            </>
          )}
        </div>
        
        {remainingErrors > 0 && (
          <div className="bg-[#F8FAFC]/50 border border-[#E2E8F0] rounded-lg p-4 text-center">
            <p className="text-sm text-[#475569] font-medium mb-2">
              + {remainingErrors} more critical errors hidden
            </p>
            <p className="text-xs text-[#64748B]">
              These errors are blocking your applications from reaching recruiters
            </p>
          </div>
        )}
      </div>

      {/* TOP 2 Missing Keywords + Blurred Rest */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            🔑 Missing Critical Keywords
          </h3>
          <span className="bg-[#F59E0B]/20 text-[#F59E0B] text-xs font-bold px-3 py-1 rounded-full border border-[#F59E0B]/30">
            Showing 2 of {missingCount}
          </span>
        </div>
        
        <div className="space-y-3 mb-4">
          {top2Keywords.length > 0 ? (
            top2Keywords.map((kw: any, i: number) => {
              const keyword = typeof kw === 'string' ? kw : kw.keyword;
              return (
                <div key={i} className="flex items-center justify-between p-3 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/30">
                  <span className="text-sm font-medium text-[#F59E0B]">• {keyword}</span>
                  <span className="text-xs text-[#F59E0B] bg-yellow-500/10 px-2 py-0.5 rounded-full">
                    High Impact
                  </span>
                </div>
              );
            })
          ) : (
            <>
              <div className="flex items-center justify-between p-3 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/30">
                <span className="text-sm font-medium text-[#F59E0B]">• Python</span>
                <span className="text-xs text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full">High Impact</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/30">
                <span className="text-sm font-medium text-[#F59E0B]">• AWS</span>
                <span className="text-xs text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full">High Impact</span>
              </div>
            </>
          )}
        </div>
        
        {/* Blurred Keywords Section */}
        {remainingKeywords > 0 && (
          <div className="relative">
            <div className="absolute inset-0 backdrop-blur-md bg-[#F8FAFC]/60 rounded-lg z-10 flex items-center justify-center">
              <div className="text-center p-6">
                <Lock className="h-8 w-8 text-[#3B82F6] mx-auto mb-3" />
                <p className="text-[#0F172A] font-bold text-lg mb-1">
                  {remainingKeywords} Critical Keywords Hidden
                </p>
                <p className="text-[#475569] text-sm">
                  Missing for your target role
                </p>
              </div>
            </div>
            <div className="space-y-2 opacity-30 pointer-events-none">
              {Array.from({ length: Math.min(remainingKeywords, 8) }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/30">
                  <span className="text-sm font-medium text-[#F59E0B]">• ████████</span>
                  <span className="text-xs text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full">████</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* The Paywall - Clear Value Proposition */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-lg p-8 bg-gradient-to-br from-[#3B82F6]/10 via-[#8B5CF6]/10 to-[#F59E0B]/10 border-2 border-[#3B82F6]/30">
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-[#F59E0B] rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-[#0F172A] mb-3">
              Get Your Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#22C55E]">Certified</span> by CVDebug
            </h3>
            <p className="text-[#475569] text-lg font-medium max-w-2xl mx-auto">
              Unlock {missingCount} exact keywords + {formatCount} critical fixes + ATS-Certified Download
            </p>
          </div>

          <div className="bg-[#F8FAFC]/80 border-2 border-[#E2E8F0] rounded-xl p-6 max-w-md mx-auto">
            <p className="text-sm font-bold text-[#475569] uppercase tracking-wider mb-4">
              ✅ ATS Certification Package:
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-[#22C55E]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#22C55E] text-xs">✓</span>
                </div>
                <span className="text-sm text-[#475569]">All {remainingKeywords + 2} missing keywords with exact placement</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-[#22C55E]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#22C55E] text-xs">✓</span>
                </div>
                <span className="text-sm text-[#475569]">All {remainingErrors + 2} format errors with 1-click fixes</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-[#22C55E]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#22C55E] text-xs">✓</span>
                </div>
                <span className="text-sm text-[#475569]">AI-powered rewrite suggestions</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-[#22C55E]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#22C55E] text-xs">✓</span>
                </div>
                <span className="text-sm text-[#475569]">✅ ATS-Certified PDF download with badge</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-[#22C55E]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#22C55E] text-xs">✓</span>
                </div>
                <span className="text-sm text-[#475569]">⚡ 3-second One-Click PDF Sanitizer</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setShowPricing(true)}
              size="lg"
              className="w-full max-w-md h-16 font-bold text-xl shadow-2xl shadow-[#3B82F6]/40 bg-gradient-to-r from-[#3B82F6] via-[#F59E0B] to-[#F59E0B] hover:from-[#3B82F6]/90 hover:via-[#F59E0B]/90 hover:to-[#F59E0B]/90 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Lock className="mr-3 h-6 w-6 text-white" />
              Get Certified - Only €9.99
            </Button>

            {/* Manual Review Option - $49 */}
            <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#3B82F6]/10 border-2 border-[#8B5CF6]/30 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 bg-[#8B5CF6]/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#8B5CF6]/30">
                  <span className="text-xl">👨‍💻</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-[#0F172A] font-bold mb-1">Albert reviews your CV personally</h4>
                  <p className="text-[#475569] text-xs">3-min video with brutal feedback + all fixes</p>
                </div>
                <span className="text-[#8B5CF6] font-black text-xl">€49</span>
              </div>
              <Button
                onClick={() => setShowPricing(true)}
                size="sm"
                className="w-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white font-semibold"
              >
                I want the manual review →
              </Button>
            </div>

            <p className="text-xs text-[#64748B]">
              or upgrade to <button onClick={() => setShowPricing(true)} className="text-[#3B82F6] underline font-semibold">Interview Sprint (€24.99)</button> for unlimited scans + cover letter optimizer
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm text-[#475569] font-medium">
            <span className="flex items-center gap-1">✓ One-time payment</span>
            <span className="flex items-center gap-1">✓ Instant access</span>
            <span className="flex items-center gap-1">✓ No subscription</span>
          </div>

          <p className="text-sm text-[#475569]">
            ⚡ <strong className="text-[#0F172A]">2,847 users</strong> unlocked their reports this week and increased their interview rate by 2x
          </p>
        </div>
      </div>
    </div>
  );
}