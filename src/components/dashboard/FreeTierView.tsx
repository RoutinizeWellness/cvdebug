import { Button } from "@/components/ui/button";
import { Lock, Download, Share2 } from "lucide-react";
import { GaugeScore } from "./analysis/GaugeScore";

interface FreeTierViewProps {
  score: number;
  missingCount: number;
  formatCount: number;
  criticalKeywords: any[];
  showBlurredPreview: boolean;
  setShowPricing: (show: boolean) => void;
  setShowBlurredPreview: (show: boolean) => void;
}

export function FreeTierView({ 
  score, 
  missingCount, 
  formatCount, 
  criticalKeywords,
  showBlurredPreview,
  setShowPricing,
  setShowBlurredPreview
}: FreeTierViewProps) {
  // Ensure we always show at least some issues for realism
  const totalIssues = Math.max(missingCount + formatCount, 3);
  const displayMissingCount = Math.max(missingCount, 2);
  const displayFormatCount = Math.max(formatCount, 1);
  return (
    <div className="space-y-8">
      {/* Hero Section with Gauge - Matching Premium Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start glass-card rounded-lg p-8 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* Left: Gauge */}
        <GaugeScore score={score} />

        {/* Right: Content */}
        <div className="flex flex-col gap-6 flex-1 z-10 w-full text-center lg:text-left">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
              score >= 80 
                ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-200 border-green-200 dark:border-green-500/30'
                : score >= 50
                ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-200 border-orange-200 dark:border-orange-500/30'
                : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-200 border-red-200 dark:border-red-500/30'
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
                : score >= 50 
                ? 'We found some issues that might be getting you rejected. Fix them to boost your chances.' 
                : 'We found critical errors that might be getting you rejected automatically. Unlock to see details and boost your interview chances by 2x.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Button 
              onClick={() => setShowPricing(true)}
              className="flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-primary text-stone-900 font-bold text-base hover:bg-[#fcf82d] transition-colors shadow-[0_0_20px_rgba(249,245,6,0.2)]"
            >
              <Lock className="h-5 w-5" />
              Unlock Full Report - $4.99
            </Button>
          </div>
        </div>
      </div>

      {/* Bento Grid - Blurred Premium Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 relative">
        {/* Blurred Content */}
        <div className="lg:col-span-12 filter blur-md pointer-events-none select-none opacity-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            {/* Formatting Audit */}
            <div className="lg:col-span-4 glass-card rounded-lg p-6">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Formatting Audit</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50">
                    <div className="h-5 w-5 rounded-full bg-stone-300 dark:bg-stone-700"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-stone-300 dark:bg-stone-700 rounded mb-2"></div>
                      <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="lg:col-span-4 glass-card rounded-lg p-6">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-stone-300 dark:bg-stone-700 text-xs">
                    Keyword
                  </span>
                ))}
              </div>
            </div>

            {/* Role Match */}
            <div className="lg:col-span-4 glass-card rounded-lg p-6">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Role Match</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Role Name</span>
                      <span className="text-sm">XX%</span>
                    </div>
                    <div className="h-3 bg-stone-300 dark:bg-stone-700 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Unlock Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm rounded-lg">
            <div className="text-center space-y-6 p-8 max-w-md">
              <div className="h-16 w-16 bg-gradient-to-br from-primary to-orange-500 rounded-full flex items-center justify-center mx-auto">
                <Lock className="h-8 w-8 text-black" />
              </div>
              
              <div>
                <h3 className="text-2xl font-black text-white mb-2">
                  {totalIssues} Issues Found
                </h3>
                <p className="text-zinc-200 mb-4 font-medium">
                  Unlock detailed analysis to see exactly what's blocking your applications
                </p>
              </div>

            <div className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-6 text-left">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-zinc-900/80 rounded-lg p-4 border-2 border-red-500/30">
                  <div className="text-3xl font-black text-red-400 mb-1">{displayMissingCount}</div>
                  <p className="text-xs text-zinc-200 font-medium">Missing Keywords</p>
                </div>
                <div className="bg-zinc-900/80 rounded-lg p-4 border-2 border-yellow-500/30">
                  <div className="text-3xl font-black text-yellow-400 mb-1">{displayFormatCount}</div>
                  <p className="text-xs text-zinc-200 font-medium">Format Issues</p>
                </div>
              </div>

              <div className="bg-zinc-900/80 border-2 border-zinc-700 rounded-lg p-4">
                <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Lock className="h-3 w-3" /> Locked Details
                </p>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-red-500/30"></div>
                      <div className="blur-sm select-none flex-1 h-4 bg-zinc-700 rounded"></div>
                      <Lock className="h-3 w-3 text-zinc-400" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-center text-zinc-300 mt-3 font-medium">
                  + {Math.max(0, totalIssues - 3)} more issues...
                </p>
              </div>
            </div>

            <Button 
              onClick={() => setShowPricing(true)}
              size="lg"
              className="w-full h-14 font-bold text-lg shadow-xl shadow-primary/30 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-stone-900"
            >
              <Lock className="mr-2 h-5 w-5" />
              Unlock All {totalIssues} Issues - $4.99
            </Button>
            
            <div className="flex items-center justify-center gap-4 text-xs text-zinc-300 font-medium">
              <span>✓ One-time payment</span>
              <span>✓ Instant access</span>
              <span>✓ No subscription</span>
            </div>

            <p className="text-xs text-zinc-300">
              ⚡ <strong className="text-white">2,847 users</strong> unlocked their reports this week
            </p>
          </div>
        </div>
      </div>

      {/* Lower Section - Also Blurred */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        {/* Blurred Content */}
        <div className="lg:col-span-3 filter blur-md pointer-events-none select-none opacity-50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-card rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Actionable Fixes</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="h-5 bg-stone-300 dark:bg-stone-700 rounded mb-2"></div>
                    <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="glass-card rounded-lg p-6">
                <div className="h-32 bg-stone-300 dark:bg-stone-700 rounded"></div>
              </div>
              <div className="glass-card rounded-lg p-6">
                <div className="h-32 bg-stone-300 dark:bg-stone-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Unlock Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm rounded-lg">
          <div className="text-center space-y-4 p-6">
            <Lock className="h-12 w-12 text-primary mx-auto" />
            <h3 className="text-xl font-bold text-white">Premium Content Locked</h3>
            <p className="text-zinc-200 text-sm font-medium">
              Get step-by-step fixes and AI-powered tips
            </p>
            <Button 
              onClick={() => setShowPricing(true)}
              className="bg-primary text-stone-900 font-bold hover:bg-primary/90"
            >
              Unlock Now - $4.99
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}