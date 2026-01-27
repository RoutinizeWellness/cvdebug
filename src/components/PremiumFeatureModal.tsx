import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface PremiumFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  feature: string;
  plan: "single_scan" | "interview_sprint";
}

export function PremiumFeatureModal({
  isOpen,
  onClose,
  onUpgrade,
  feature,
  plan
}: PremiumFeatureModalProps) {
  const planConfig = {
    single_scan: {
      name: "Single Scan",
      price: "€4.99",
      priceSubtext: "one-time",
      color: "from-[#64748B] to-[#06B6D4]",
      icon: Lock,
      features: [
        "1 ATS Resume Scan",
        "Full ATS Score Analysis",
        "Keyword Matching Report",
        "Formatting Issue Detection",
        "Robot Vision View",
        "Downloadable Report"
      ]
    },
    interview_sprint: {
      name: "Interview Sprint",
      price: "€24.99",
      priceSubtext: "per month",
      color: "from-[#1E293B] to-[#EC4899]",
      icon: Crown,
      features: [
        "✨ Everything in Single Scan",
        "Unlimited Resume Scans",
        "AI-Powered Resume Rewriter",
        "Bullet Point Optimizer",
        "Keyword Auto-Injection",
        "Cover Letter Generator",
        "LinkedIn Profile Optimizer",
        "Interview Prep Tools",
        "Job Application Tracker",
        "Priority Support"
      ]
    }
  };

  const config = planConfig[plan];
  const Icon = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#FFFFFF] border-2 border-[#E2E8F0]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${config.color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-[#0F172A]">
                Premium Feature
              </DialogTitle>
              <DialogDescription className="text-[#64748B]">
                Unlock with {config.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Feature Highlight */}
        <div className="bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] border border-[#E2E8F0] rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 bg-[#64748B]/10 rounded-lg">
              <Sparkles className="h-5 w-5 text-[#64748B]" />
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A] mb-1">
                {feature}
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                This powerful feature helps you stand out to recruiters and beat ATS systems with AI-powered optimization.
              </p>
            </div>
          </div>
        </div>

        {/* Plan Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`relative overflow-hidden rounded-xl border-2 bg-gradient-to-br ${config.color} p-[2px]`}
        >
          <div className="bg-[#FFFFFF] rounded-lg p-6">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-[#0F172A]">{config.price}</span>
              <span className="text-[#64748B]">/ {config.priceSubtext}</span>
            </div>

            <h4 className="font-bold text-[#0F172A] mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#F59E0B]" />
              What's Included:
            </h4>

            <ul className="space-y-2.5 mb-6">
              {config.features.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-2 text-sm text-[#475569]"
                >
                  <Check className="h-4 w-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>

            <Button
              onClick={onUpgrade}
              className={`w-full h-12 bg-gradient-to-r ${config.color} hover:opacity-90 text-white font-bold text-base shadow-lg`}
            >
              <Icon className="h-5 w-5 mr-2" />
              Upgrade to {config.name}
            </Button>
          </div>
        </motion.div>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#64748B] pt-2">
          <Check className="h-3.5 w-3.5 text-[#22C55E]" />
          <span>10,000+ professionals upgraded • 30-day guarantee</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
