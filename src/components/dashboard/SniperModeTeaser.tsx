import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock, Target, Zap, TrendingUp } from "lucide-react";

interface SniperModeTeaserProps {
  totalMissingKeywords: number;
  visibleKeywords: string[];
  lockedKeywordsCount: number;
  onUnlock: () => void;
  currentScore: number;
  potentialScore: number;
}

export function SniperModeTeaser({
  totalMissingKeywords,
  visibleKeywords,
  lockedKeywordsCount,
  onUnlock,
  currentScore,
  potentialScore
}: SniperModeTeaserProps) {

  if (totalMissingKeywords === 0) return null;

  const impactPercentage = potentialScore - currentScore;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950/50 via-slate-900 to-rose-950/50 border-2 border-amber-500/30 p-6 shadow-[0_0_60px_rgba(245,158,11,0.15)]"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="relative">
        {/* Header with Lock Icon */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/50">
              <Target className="h-7 w-7 text-slate-900" />
            </div>
            <div>
              <h3 className="text-slate-900 text-xl font-bold flex items-center gap-2">
                Sniper Mode
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full border border-amber-500/30">
                  BLOQUEADO
                </span>
              </h3>
              <p className="text-slate-500 text-sm">Keywords de alto impacto detectadas</p>
            </div>
          </div>
        </div>

        {/* Main Message */}
        <div className="bg-white/80 rounded-xl p-5 mb-5 border border-amber-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Zap className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-slate-900 font-bold text-lg">
                Te faltan {totalMissingKeywords} keywords para esta posición
              </p>
              <p className="text-slate-500 text-sm">
                Aquí tienes las {visibleKeywords.length} más críticas:
              </p>
            </div>
          </div>

          {/* Visible Keywords */}
          <div className="flex flex-wrap gap-2 mb-4">
            {visibleKeywords.map((keyword, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30 text-sm font-mono font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>

          {/* Locked Keywords Indicator */}
          {lockedKeywordsCount > 0 && (
            <div className="flex items-center gap-2 p-3 bg-slate-50/60 rounded-lg border border-slate-200">
              <Lock className="h-5 w-5 text-slate-500" />
              <span className="text-slate-600 text-sm font-medium">
                + {lockedKeywordsCount} keywords más esperando ser desbloqueadas
              </span>
            </div>
          )}
        </div>

        {/* Impact Visualization */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-200">
            <p className="text-slate-500 text-xs mb-1">Score Actual</p>
            <p className="text-slate-900 text-3xl font-bold font-mono">{currentScore}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl p-4 border border-emerald-500/30 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="text-emerald-400 text-xs mb-1">Score Potencial</p>
            <p className="text-slate-900 text-3xl font-bold font-mono flex items-baseline gap-2">
              {potentialScore}
              <span className="text-emerald-400 text-sm font-medium">
                +{impactPercentage}
              </span>
            </p>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg p-4 mb-5 border border-amber-500/20">
          <p className="text-amber-200 text-sm font-medium text-center">
            🎯 Desbloquea las otras {lockedKeywordsCount} keywords con <span className="text-slate-900 font-bold">Sniper Mode</span> por solo <span className="text-amber-400 font-black text-lg">$4.99</span>
          </p>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onUnlock}
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-900 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all rounded-xl"
        >
          <Target className="h-5 w-5 mr-2" />
          Desbloquear Sniper Mode
          <Zap className="h-5 w-5 ml-2" />
        </Button>

        {/* Social Proof */}
        <div className="mt-4 text-center">
          <p className="text-slate-500 text-xs">
            ⚡ <span className="text-slate-900 font-medium">1,847 usuarios</span> desbloquearon Sniper Mode este mes
          </p>
        </div>
      </div>
    </motion.div>
  );
}
