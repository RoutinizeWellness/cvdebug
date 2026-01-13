import { Lock, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface PaywalledKeywordsProps {
  missingCount: number;
  previewKeywords?: string[];
  price?: string;
  onUnlock?: () => void;
  onBack?: () => void;
}

export function PaywalledKeywords({
  missingCount,
  previewKeywords = [
    "TypeScript",
    "React Testing Library",
    "CI/CD Pipelines",
    "GraphQL",
    "Docker",
    "Kubernetes",
    "Next.js",
    "Tailwind CSS",
    "AWS",
    "Agile Methodology",
    "System Design",
    "Microfrontends",
  ],
  price = "$4.99",
  onUnlock,
  onBack,
}: PaywalledKeywordsProps) {
  return (
    <div className="glass-card rounded-xl relative overflow-hidden flex-1 border-t-2 border-t-accent/50">
      <div className="p-4 border-b border-[#E2E8F0]/50 bg-[#F8FAFC]/30 flex items-center justify-between">
        <h3 className="text-[#0F172A] font-bold flex items-center gap-2">
          <Search className="h-5 w-5 text-accent" />
          Missing Keywords
        </h3>
        <span className="bg-[#EF4444]/20 text-red-400 text-xs px-2 py-0.5 rounded font-mono border border-red-500/20 animate-pulse">
          {missingCount} MISSING
        </span>
      </div>

      {/* Blurred Content Layer */}
      <div
        aria-hidden="true"
        className="p-5 flex flex-wrap gap-2 filter blur-[6px] opacity-40 select-none pointer-events-none"
      >
        {previewKeywords.map((keyword, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-slate-700 rounded-full text-sm text-[#475569] border border-slate-600"
          >
            {keyword}
          </span>
        ))}
      </div>

      {/* Paywall Overlay Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 z-20 flex items-center justify-center p-6"
      >
        <div className="glass-paywall w-full max-w-sm rounded-xl p-6 shadow-2xl flex flex-col items-center text-center ring-1 ring-white/10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
            className="size-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          >
            <Lock className="h-6 w-6 text-[#0F172A]" />
          </motion.div>

          <h4 className="text-xl font-bold text-[#0F172A] mb-2">Unlock Full Report</h4>
          <p className="text-[#475569] text-sm mb-6 leading-relaxed">
            You are missing{" "}
            <span className="text-red-400 font-bold">{missingCount} critical signals</span>{" "}
            for this role. 92% of interviewed candidates have these keywords.
          </p>

          <div className="w-full space-y-3">
            {onUnlock && (
              <Button
                onClick={onUnlock}
                className="w-full bg-gradient-to-r from-[#840bda] to-accent hover:to-blue-500 text-[#0F172A] font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-primary/50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Fix My CV Now</span>
                <span className="bg-[#FFFFFF]/20 px-1.5 py-0.5 rounded text-xs font-medium">
                  {price}
                </span>
              </Button>
            )}
            {onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full bg-transparent hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] font-medium py-2.5 px-4 rounded-lg border border-[#E2E8F0] transition-colors text-sm"
              >
                Back to Dashboard
              </Button>
            )}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-[#64748B]">
            <ShieldCheck className="h-3 w-3" />
            Secure 256-bit SSL encrypted payment
          </div>
        </div>
      </motion.div>
    </div>
  );
}
