import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Sparkles, TrendingUp } from "lucide-react";

interface CreditsExhaustedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentScore?: number;
  onUpgrade: () => void;
}

export function CreditsExhaustedModal({ open, onOpenChange, currentScore, onUpgrade }: CreditsExhaustedModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-zinc-900 to-black border-2 border-red-500/30">
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-600 mb-4 animate-pulse">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl font-black text-white">
            Credits Exhausted
          </DialogTitle>
          <DialogDescription className="text-center space-y-6 pt-4">
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <p className="text-lg font-bold text-white mb-2">
                You've used your free diagnostic scan.
              </p>
              {currentScore !== undefined && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-sm text-zinc-400">Your CV Score:</span>
                  <span className={`text-3xl font-black ${
                    currentScore >= 80 ? 'text-green-500' : 
                    currentScore >= 50 ? 'text-yellow-500' : 
                    'text-red-500'
                  }`}>
                    {currentScore}%
                  </span>
                </div>
              )}
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                <p className="text-sm text-zinc-300 font-medium">
                  <span className="text-red-400 font-bold">⚠️ Critical:</span> Your resume is missing 20+ keywords that ATS systems scan for.
                </p>
              </div>
              <p className="text-zinc-400 text-sm">
                Without fixing these gaps, your application will be <span className="text-red-400 font-bold">automatically rejected</span> before any human sees it.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-left">
                <Sparkles className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white">Unlock Full Analysis</p>
                  <p className="text-xs text-zinc-400">See all 20+ missing keywords with exact placement suggestions</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <TrendingUp className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white">ATS Optimization Guide</p>
                  <p className="text-xs text-zinc-400">Step-by-step fixes to boost your score to 85%+</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
              <p className="text-2xl font-black text-white mb-1">€4.99</p>
              <p className="text-xs text-zinc-400">One-time payment • No subscription • Instant access</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-3 flex-col sm:flex-row">
          <Button 
            onClick={onUpgrade}
            className="w-full sm:w-auto font-bold text-base h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Unlock Full Report - €4.99
          </Button>
          <Button 
            variant="ghost"
            onClick={() => onOpenChange(false)} 
            className="w-full sm:w-auto text-zinc-400 hover:text-white"
          >
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
