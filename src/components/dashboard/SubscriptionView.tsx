import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const apiAny = api as any;

export function SubscriptionView() {
  const user = useQuery(apiAny.users.currentUser);
  const [timeRemaining, setTimeRemaining] = useState({ days: 4, hours: 12, minutes: 30 });

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
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"></div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Top Breadcrumbs & Actions */}
        <header className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-2 text-sm">
            <a className="text-slate-400 hover:text-white transition-colors" href="#">
              Settings
            </a>
            <span className="material-symbols-outlined text-slate-600 text-[16px]">chevron_right</span>
            <span className="text-white font-medium">Subscription</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
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
            <h2 className="text-3xl font-bold text-white tracking-tight">Subscription Management</h2>
            <p className="text-slate-400 max-w-2xl text-lg">
              Manage your current plan, billing details, and unlock premium interview preparation sprints.
            </p>
          </motion.div>

          {/* Current Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex flex-col gap-4 relative z-10 max-w-xl">
              <div className="flex items-center gap-3">
                <span className="bg-slate-700/50 border border-slate-600 text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-md uppercase tracking-wide">
                  Current Plan
                </span>
                <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Active
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {isFreeTier && "Free Preview"}
                  {isSingleScan && "Single Scan"}
                  {isInterviewSprint && "Interview Sprint"}
                </h3>
                <p className="text-slate-400">
                  {isFreeTier && "Free basic scan to see where you stand. Upgrade to unlock full analysis."}
                  {isSingleScan && (
                    <>
                      You have <span className="text-white font-medium">{currentCredits} scan credit</span> remaining. Includes unlimited re-scans for 24h.
                    </>
                  )}
                  {isInterviewSprint && (
                    <>
                      You have unlimited scans for <span className="text-white font-medium">{daysUntilReset} days</span>. Expires on{" "}
                      <span className="text-white font-medium">{new Date(sprintExpiresAt).toLocaleDateString('es-ES')}</span>.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 relative z-10 shrink-0">
              <a className="text-slate-300 hover:text-white text-sm font-medium px-4 py-2 transition-colors" href="#">
                Billing History
              </a>
              {!isFreeTier && (
                <button className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-slate-900/40">
                  Cancel Plan
                </button>
              )}
            </div>
          </motion.div>

          {/* Pricing Section */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-semibold text-white">Upgrade Options</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Single Scan */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel rounded-2xl p-6 flex flex-col h-full border-slate-700/50 hover:border-slate-600 transition-colors"
              >
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-white">Single Scan</h4>
                  <p className="text-slate-400 text-sm mt-1">One-time payment</p>
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold text-white">€4.99</span>
                  <span className="text-slate-500">/once</span>
                </div>
                <div className="space-y-3 mb-8 flex-1">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <p className="text-sm text-slate-300">Full ATS Analysis</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <p className="text-sm text-slate-300">Complete Keyword Report</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <p className="text-sm text-slate-300">Formatting Audit + Fixes</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <p className="text-sm text-slate-300">Unlimited Re-scans (24h)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <p className="text-sm text-slate-300">PDF Sanitization</p>
                  </div>
                </div>
                <button
                  disabled={isSingleScan}
                  className="w-full py-3 rounded-xl border border-slate-600 bg-transparent text-white font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSingleScan ? "Current Plan" : "Get Single Scan"}
                </button>
              </motion.div>

              {/* Interview Sprint (Highlighted) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-panel relative rounded-2xl p-6 flex flex-col h-full border-cyan-500/50 bg-gradient-to-b from-slate-800/80 to-slate-900/90 glow-violet transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-cyan-500/30">
                  🚀 BEST VALUE - SAVE 60%
                </div>
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    Interview Sprint
                    <span className="material-symbols-outlined text-cyan-400 text-[20px]">rocket_launch</span>
                  </h4>
                  <p className="text-slate-400 text-sm mt-1">7 Days Unlimited Access</p>
                  <p className="text-slate-500 text-xs mt-1 italic">Joined by 1,200+ candidates</p>
                </div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold text-white">€19.99</span>
                  <span className="text-slate-500 line-through text-lg">€49.99</span>
                </div>
                <div className="space-y-3 mb-8 flex-1">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-cyan-400 text-[20px]">check_circle</span>
                    <p className="text-sm text-slate-300">Unlimited Scans (7 Days)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-cyan-400 text-[20px]">check_circle</span>
                    <p className="text-sm text-slate-300">AI Keyword Suggestions</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-cyan-400 text-[20px]">check_circle</span>
                    <p className="text-sm text-slate-300">Cover Letter Generator</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-cyan-400 text-[20px]">check_circle</span>
                    <p className="text-sm text-slate-300">LinkedIn Optimizer</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-cyan-400 text-[20px]">check_circle</span>
                    <p className="text-sm text-slate-300">Priority Support</p>
                  </div>
                </div>
                <button
                  disabled={isInterviewSprint}
                  className="w-full py-3 rounded-xl bg-primary-gradient text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isInterviewSprint ? "Current Plan" : "Start Interview Sprint"}
                </button>
              </motion.div>
            </div>
          </div>

          {/* FAQ or Trust Section Footer */}
          <div className="mt-8 border-t border-slate-800/60 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
            <p>© 2026 CVDebug Inc. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a className="hover:text-slate-300 transition-colors" href="#">
                Privacy Policy
              </a>
              <a className="hover:text-slate-300 transition-colors" href="#">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .glass-panel {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .glow-violet {
          box-shadow: 0 0 20px -5px rgba(139, 92, 246, 0.3);
        }
        .glow-blue {
          box-shadow: 0 0 20px -5px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
}
