import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/use-currency";

const apiAny = api as any;

export function SubscriptionView() {
  const user = useQuery(apiAny.users.currentUser);
  const [timeRemaining, setTimeRemaining] = useState({ days: 4, hours: 12, minutes: 30 });
  const { formatPrice } = useCurrency();

  // Calculate sprint countdown
  useEffect(() => {
    const updateCountdown = () => {
      if (user?.sprintExpiresAt) {
        const now = Date.now();
        const diff = user.sprintExpiresAt - now;

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeRemaining({ days, hours, minutes });
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [user?.sprintExpiresAt]);

  const currentPlan = user?.subscriptionTier || "free";
  const isFreeTier = currentPlan === "free";
  const isSingleScan = currentPlan === "single_scan";
  const isInterviewSprint = currentPlan === "interview_sprint";

  // Calculate remaining credits
  const currentCredits = user?.credits || 0;

  const sprintExpiresAt = user?.sprintExpiresAt || 0;
  const daysUntilReset = sprintExpiresAt > Date.now()
    ? Math.ceil((sprintExpiresAt - Date.now()) / (1000 * 60 * 60 * 24))
    : 15;

  return (
    <div className="flex-1 overflow-y-auto bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center bg-fixed relative">
      <div className="absolute inset-0 bg-[#F8FAFC]/95 backdrop-blur-sm"></div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Top Breadcrumbs & Actions */}
        <header className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => window.history.back()}
              className="text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              Settings
            </button>
            <span className="material-symbols-outlined text-[#475569] text-[16px]">chevron_right</span>
            <span className="text-[#0F172A] font-medium">Subscription</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#64748B] hover:text-[#0F172A] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-[#64748B] hover:text-[#0F172A] transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
        </header>

        <div className="px-8 pb-12 flex flex-col gap-10 max-w-7xl mx-auto w-full">
          {/* Page Heading */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">Subscription Management</h2>
            <p className="text-[#64748B] max-w-2xl text-lg">
              Manage your current plan, billing details, and unlock premium interview preparation sprints.
            </p>
          </motion.div>

          {/* Current Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#FFFFFF] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group border-2 border-[#E2E8F0] hover:border-[#8B5CF6]/30 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#64748B]/5 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none"></div>

            <div className="flex flex-col gap-5 relative z-10 max-w-xl flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] px-3 py-1.5 rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
                  <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                  <span className="text-xs font-bold uppercase tracking-wide">Current Plan</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                  </span>
                  <span className="text-[#22C55E] text-xs font-bold uppercase tracking-wide">Active</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-black text-[#0F172A] mb-2 flex items-center gap-2 flex-wrap">
                  {isFreeTier && (
                    <>
                      <span>Free Preview</span>
                      <span className="material-symbols-outlined text-[#64748B] text-[28px]">preview</span>
                    </>
                  )}
                  {isSingleScan && (
                    <>
                      <span>Single Scan</span>
                      <span className="material-symbols-outlined text-[#8B5CF6] text-[28px]">bolt</span>
                    </>
                  )}
                  {isInterviewSprint && (
                    <>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#64748B]">Interview Sprint</span>
                      <span className="material-symbols-outlined text-[#8B5CF6] text-[28px]">rocket_launch</span>
                    </>
                  )}
                </h3>
                <p className="text-[#475569] text-base leading-relaxed">
                  {isFreeTier && "Free basic scan to see where you stand. Upgrade to unlock full analysis and premium features."}
                  {isSingleScan && (
                    <>
                      You have <span className="text-[#8B5CF6] font-bold">{currentCredits} scan credit</span> remaining. Includes unlimited re-scans for 24 hours.
                    </>
                  )}
                  {isInterviewSprint && (
                    <>
                      You have <span className="text-[#8B5CF6] font-bold">unlimited scans</span> for{" "}
                      <span className="text-[#0F172A] font-bold bg-[#8B5CF6]/10 px-2 py-0.5 rounded">{daysUntilReset} days</span>. Expires on{" "}
                      <span className="text-[#0F172A] font-bold">{new Date(sprintExpiresAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => toast.info("Billing history feature coming soon")}
                className="text-[#475569] hover:text-[#0F172A] text-sm font-semibold px-4 py-2.5 transition-colors hover:bg-[#F8FAFC] rounded-lg border border-transparent hover:border-[#E2E8F0] text-center"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  Billing History
                </span>
              </button>
              {!isFreeTier && (
                <button className="bg-[#F8FAFC] hover:bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#EF4444]/50 text-[#475569] hover:text-[#EF4444] px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                    Cancel Plan
                  </span>
                </button>
              )}
            </div>
          </motion.div>

          {/* Pricing Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-[#0F172A]">Upgrade Options</h3>
              <span className="text-xs text-[#64748B] font-medium">Pay once, use forever</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* Single Scan */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#FFFFFF] rounded-2xl p-6 md:p-7 flex flex-col h-full border border-[#E2E8F0] hover:border-[#8B5CF6]/50 hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)] transition-all duration-300 group relative overflow-hidden"
              >
                {/* Subtle background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/5 rounded-full blur-2xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] group-hover:border-[#8B5CF6]/30 transition-colors">
                      <span className="material-symbols-outlined text-[#64748B] group-hover:text-[#8B5CF6] text-[24px] transition-colors">bolt</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-[#0F172A]">Single Scan</h4>
                      <p className="text-[#64748B] text-xs mt-0.5 font-medium uppercase tracking-wide">One-time payment</p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-black text-[#0F172A]">€9.99</span>
                    <span className="text-[#64748B] text-base">/once</span>
                  </div>

                  <div className="space-y-3.5 mb-8 flex-1">
                    {[
                      { icon: "verified", text: "Full ATS Analysis" },
                      { icon: "key", text: "Complete Keyword Report" },
                      { icon: "auto_fix_high", text: "Formatting Audit + Fixes" },
                      { icon: "autorenew", text: "Unlimited Re-scans (24h)" },
                      { icon: "shield_with_heart", text: "PDF Sanitization" }
                    ].map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="p-1 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
                          <span className="material-symbols-outlined text-[#8B5CF6] text-[16px]">{feature.icon}</span>
                        </div>
                        <p className="text-sm text-[#475569] font-medium leading-relaxed">{feature.text}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    disabled={isSingleScan}
                    className="w-full py-3.5 rounded-xl border-2 border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] font-bold hover:bg-[#FFFFFF] hover:border-[#8B5CF6]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-lg text-base"
                  >
                    {isSingleScan ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        Current Plan
                      </span>
                    ) : (
                      "Get Single Scan"
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Interview Sprint (Highlighted) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative rounded-2xl p-6 md:p-7 flex flex-col h-full border-2 border-[#F3E8FF] bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#F3E8FF]/30 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)] transform hover:scale-[1.02] hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.5)] transition-all duration-300 group overflow-hidden"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/5 via-transparent to-[#64748B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Best Value Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#8B5CF6] text-[#FFFFFF] text-xs font-black px-5 py-1.5 rounded-full shadow-xl shadow-[#8B5CF6]/40 border-2 border-[#8B5CF6]/30 animate-pulse">
                    <span className="flex items-center gap-1.5">
                      BEST VALUE - SAVE 60%
                    </span>
                  </div>
                </div>

                <div className="relative z-10 pt-2">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 group-hover:shadow-lg group-hover:shadow-[#8B5CF6]/20 transition-all">
                      <span className="material-symbols-outlined text-[#8B5CF6] text-[24px]">rocket_launch</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-black text-[#0F172A] flex items-center gap-2">
                        Interview Sprint
                      </h4>
                      <p className="text-[#8B5CF6] text-xs mt-0.5 font-bold uppercase tracking-wide">7 Days Unlimited</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-3 mb-2">
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#64748B]">{formatPrice('sprint_7day')}</span>
                    <span className="text-[#64748B] line-through text-xl font-bold">{formatPrice('interview_sprint')}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <div className="px-2.5 py-1 rounded-md bg-[#22C55E]/10 border border-[#22C55E]/30">
                      <p className="text-[#22C55E] text-xs font-bold">60% OFF</p>
                    </div>
                    <p className="text-[#64748B] text-xs italic">Joined by 1,200+ candidates</p>
                  </div>

                  <div className="space-y-3.5 mb-8 flex-1">
                    {[
                      { icon: "all_inclusive", text: "Unlimited Scans (7 Days)" },
                      { icon: "psychology", text: "AI Keyword Suggestions" },
                      { icon: "description", text: "Cover Letter Generator" },
                      { icon: "work", text: "LinkedIn Optimizer" },
                      { icon: "support_agent", text: "Priority Support" }
                    ].map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="p-1 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
                          <span className="material-symbols-outlined text-[#8B5CF6] text-[16px]">{feature.icon}</span>
                        </div>
                        <p className="text-sm text-[#0F172A] font-semibold leading-relaxed">{feature.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Social Proof */}
                  <div className="mb-6 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-6 w-6 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#64748B] border-2 border-[#FFFFFF]"></div>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-[#8B5CF6]">1,200+ Success Stories</span>
                    </div>
                    <p className="text-[10px] text-[#64748B] leading-tight">
                      "Got interviews at <span className="text-[#0F172A] font-bold">Google</span> & <span className="text-[#0F172A] font-bold">Netflix</span> in one week"
                    </p>
                  </div>

                  <button
                    disabled={isInterviewSprint}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#8B5CF6]/90 hover:to-[#6366F1]/90 text-[#FFFFFF] font-black shadow-[0_10px_40px_-10px_rgba(139,92,246,0.5)] hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.7)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-base"
                  >
                    {isInterviewSprint ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        Current Plan
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Start Interview Sprint
                        <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </span>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* FAQ or Trust Section Footer */}
          <div className="mt-8 border-t border-[#E2E8F0] pt-8 flex flex-col md:flex-row justify-between items-center text-[#64748B] text-sm">
            <p>© 2026 CVDebug Inc. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a className="hover:text-[#475569] transition-colors" href="/privacy">
                Privacy Policy
              </a>
              <a className="hover:text-[#475569] transition-colors" href="/terms">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid #E2E8F0;
        }
      `}</style>
    </div>
  );
}
