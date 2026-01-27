import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface NewsletterCaptureProps {
  context: "landing" | "post-scan" | "dashboard";
  variant?: "inline" | "modal" | "banner";
}

export function NewsletterCapture({ context, variant = "inline" }: NewsletterCaptureProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const subscribeNewsletter = useMutation(api.newsletter.subscribe);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    setIsLoading(true);
    try {
      await subscribeNewsletter({ email, source: context });
      setIsSubmitted(true);
      toast.success("🎉 You're in! Check your inbox for your first tip.");
    } catch (error) {
      toast.error("Something went wrong. Try again?");
    } finally {
      setIsLoading(false);
    }
  };

  // Different copy based on context
  const getCopy = () => {
    switch (context) {
      case "post-scan":
        return {
          headline: "Want the cheat code?",
          subtext: "Get a weekly email with one ATS trick that actually works. No fluff, just actionable tips from analyzing 10,000+ resumes.",
          cta: "Send me the tips"
        };
      case "dashboard":
        return {
          headline: "The Resume Debugger Newsletter",
          subtext: "Weekly breakdown of what's working in 2026. Real data from real job searches.",
          cta: "Subscribe"
        };
      default: // landing
        return {
          headline: "Don't let your resume collect dust",
          subtext: "Even if you're not job hunting now, stay sharp. One tip per week to keep your resume interview-ready.",
          cta: "Get free tips"
        };
    }
  };

  const copy = getCopy();

  if (variant === "banner") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#1E293B] to-[#334155] rounded-xl p-6 text-white"
      >
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{copy.headline}</h3>
                  <p className="text-white/90 text-sm mb-4">{copy.subtext}</p>
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-white text-[#1E293B] hover:bg-white/90 font-bold whitespace-nowrap"
                    >
                      {isLoading ? "..." : copy.cta}
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 py-3"
            >
              <CheckCircle className="h-6 w-6 text-[#22C55E]" />
              <div>
                <p className="font-bold">You're all set!</p>
                <p className="text-sm text-white/90">Check your inbox for your first tip.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Inline variant (default)
  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-[#1E293B]" />
              <h3 className="text-[#0F172A] font-bold">{copy.headline}</h3>
            </div>
            <p className="text-[#64748B] text-sm mb-4">{copy.subtext}</p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-[#E2E8F0]"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-[#1E293B] to-[#334155] text-white font-bold whitespace-nowrap"
              >
                {isLoading ? "..." : copy.cta}
              </Button>
            </form>
            <p className="text-[10px] text-[#94A3B8] mt-2">
              No spam. Unsubscribe anytime. One email per week, max.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 py-2"
          >
            <div className="w-10 h-10 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-[#22C55E]" />
            </div>
            <div>
              <p className="font-bold text-[#0F172A]">You're on the list! 🎉</p>
              <p className="text-sm text-[#64748B]">First tip landing in your inbox soon.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
