import { Lock, Sparkles, Crown } from "lucide-react";
import { motion } from "framer-motion";

interface PremiumFeatureBadgeProps {
  plan: "single_scan" | "interview_sprint";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function PremiumFeatureBadge({
  plan,
  size = "md",
  showIcon = true
}: PremiumFeatureBadgeProps) {
  const config = {
    single_scan: {
      label: "Single Scan",
      price: "€4.99",
      color: "from-[#3B82F6] to-[#06B6D4]",
      icon: Lock
    },
    interview_sprint: {
      label: "Interview Sprint",
      price: "€24.99",
      color: "from-[#8B5CF6] to-[#EC4899]",
      icon: Crown
    }
  };

  const { label, price, color, icon: Icon } = config[plan];

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-3 py-1 gap-1.5",
    lg: "text-sm px-4 py-1.5 gap-2"
  };

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center bg-gradient-to-r ${color} text-white font-bold rounded-full ${sizeClasses[size]} shadow-lg`}
    >
      {showIcon && <Icon className={size === "sm" ? "h-3 w-3" : size === "md" ? "h-3.5 w-3.5" : "h-4 w-4"} />}
      <span>{label}</span>
      <span className="opacity-90">{price}</span>
    </motion.span>
  );
}
