import { motion } from "framer-motion";
import { Sparkles, Zap, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConversionBannerProps {
  currentScore: number;
  onUpgrade: () => void;
}

export function ConversionBanner({ currentScore, onUpgrade }: ConversionBannerProps) {
  // Calculate bracket and potential
  const targetScore = 95;
  const scoreDifference = targetScore - currentScore;
  const bracket = currentScore >= 80 ? "80%" : currentScore >= 60 ? "60%" : "40%";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="w-full"
    >
      {/* Main Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-0 -right-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative p-6 md:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left: Message */}
            <div className="flex-1 space-y-3">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-primary">Current Bracket: {bracket}</span>
              </div>

              {/* Main Headline */}
              <h3 className="text-2xl md:text-3xl font-black text-[#0F172A] leading-tight">
                You are in the <span className="text-primary">{bracket} bracket</span>.
              </h3>

              {/* Subheadline */}
              <p className="text-base md:text-lg text-[#475569] font-medium max-w-2xl">
                Unlock the <span className="font-bold text-[#0F172A]">Sprint Engine</span> to reach{" "}
                <span className="font-bold text-emerald-600">95%</span> and match{" "}
                <span className="font-bold text-[#0F172A]">FAANG signals</span> instantly.
              </p>

              {/* Benefits List */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span><span className="font-bold text-[#0F172A]">+{scoreDifference} points</span> boost potential</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span><span className="font-bold text-[#0F172A]">FAANG-level</span> keywords</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  <span><span className="font-bold text-[#0F172A]">24-hour</span> access</span>
                </div>
              </div>
            </div>

            {/* Right: CTA */}
            <div className="flex flex-col gap-3 lg:min-w-[280px]">
              {/* Primary CTA Button */}
              <Button
                onClick={onUpgrade}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 font-bold">
                  <Zap className="w-5 h-5" />
                  Get 24-Hour Sprint Pass
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>

              {/* Price Info */}
              <div className="text-center space-y-1">
                <p className="text-sm text-[#64748B]">
                  One-time payment • <span className="font-bold text-[#0F172A]">$29</span>
                </p>
                <p className="text-xs text-[#94A3B8]">
                  Fix everything in 24 hours. No subscription.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom: Social Proof Bar */}
          <div className="mt-6 pt-6 border-t border-primary/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 border-2 border-white flex items-center justify-center text-white text-xs font-bold">A</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold">M</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold">S</div>
                  </div>
                  <span className="text-sm text-[#64748B]">
                    <span className="font-bold text-[#0F172A]">2,847</span> devs upgraded this week
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-[#64748B]">
                  Avg. score increase: <span className="font-bold text-emerald-600">+23 points</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Strip */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-emerald-500">lock</span>
          <span>Secure 256-bit Encrypted Checkout</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-primary">verified</span>
          <span>Money-back guarantee</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-amber-500">schedule</span>
          <span>Access expires in 24h</span>
        </div>
      </div>
    </motion.div>
  );
}
