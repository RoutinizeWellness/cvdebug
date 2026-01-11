import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useState } from "react";

const apiAny = api as any;

export function SettingsView() {
  const user = useQuery(apiAny.users.currentUser);
  const [shareAnalytics, setShareAnalytics] = useState(true);

  // Calculate sprint progress
  const sprintExpiresAt = user?.sprintExpiresAt || 0;
  const sprintDaysLeft = sprintExpiresAt > Date.now()
    ? Math.ceil((sprintExpiresAt - Date.now()) / (1000 * 60 * 60 * 24))
    : 12;

  const planName = user?.subscriptionTier === "interview_sprint" ? "Interview Sprint" : "Interview Sprint";
  const validUntil = sprintExpiresAt > Date.now()
    ? new Date(sprintExpiresAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "Dec 24, 2023";

  const userName = user?.name || "Alex Dev";
  const userEmail = user?.email || "alex@cvdebug.com";

  // Calculate progress percentage (assuming 30 day sprint)
  const totalSprintDays = 30;
  const daysElapsed = totalSprintDays - sprintDaysLeft;
  const progressPercentage = Math.round((daysElapsed / totalSprintDays) * 100);

  return (
    <div className="flex-1 overflow-y-auto relative bg-[#0F172A]">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 py-8 md:px-10 md:py-12 relative z-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold font-display text-white tracking-tight">
              Account & Settings
            </h1>
            <p className="text-slate-400 font-body">
              Manage your subscription, security, and view your performance stats.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
              Documentation
            </button>
            <button className="px-4 py-2 rounded-lg border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
              Support
            </button>
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plan Section (Span 2 columns) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass-panel rounded-xl overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
            <div className="p-6 md:p-8 flex flex-col justify-between h-full relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/20">
                      Active
                    </span>
                    <p className="text-slate-400 text-sm font-medium">Current Plan</p>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">
                    {planName}
                  </h2>
                  <p className="text-slate-400 text-sm">Valid until {validUntil}</p>
                </div>
                <div className="size-12 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700">
                  <span className="material-symbols-outlined text-white">rocket_launch</span>
                </div>
              </div>

              {/* Progress Bar Component */}
              <div className="flex flex-col gap-2 mb-8">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white font-medium">Sprint Progress</span>
                  <span className="text-blue-400 font-mono">{sprintDaysLeft} Days Left</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Day {daysElapsed}</span>
                  <span>Day {totalSprintDays}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800/50">
                <button className="gradient-btn px-5 py-2.5 rounded-lg text-white text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center gap-2">
                  <span>Manage Subscription</span>
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </button>
                <button className="px-5 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 text-white text-sm font-medium transition-colors bg-transparent">
                  View Billing History
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats Card (Span 1 column) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-[60px] pointer-events-none"></div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-violet-400">monitoring</span>
                <h3 className="text-lg font-bold font-display text-white">Match Score</h3>
              </div>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-white font-display">84%</span>
                <span className="text-emerald-400 text-sm font-mono flex items-center bg-emerald-400/10 px-1.5 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
                  +15%
                </span>
              </div>
            </div>

            {/* Chart SVG */}
            <div className="relative h-32 w-full mt-auto">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path
                  d="M0 40 Q 25 35, 35 25 T 70 15 T 100 5 L 100 50 L 0 50 Z"
                  fill="url(#chartGradient)"
                ></path>
                <path
                  d="M0 40 Q 25 35, 35 25 T 70 15 T 100 5"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeLinecap="round"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                ></path>
                {/* Data Points */}
                <circle className="fill-bg-slate-deep stroke-violet-400 stroke-[1.5]" cx="35" cy="25" r="2"></circle>
                <circle className="fill-bg-slate-deep stroke-violet-400 stroke-[1.5]" cx="70" cy="15" r="2"></circle>
                <circle className="fill-bg-slate-deep stroke-violet-400 stroke-[1.5]" cx="100" cy="5" r="2"></circle>
              </svg>
              {/* X-Axis Labels */}
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2 uppercase tracking-wider">
                <span>Wk 1</span>
                <span>Wk 2</span>
                <span>Wk 3</span>
                <span>Wk 4</span>
              </div>
            </div>
          </motion.div>

          {/* Security Section (Full Width) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 glass-panel rounded-xl p-6 md:p-8 border border-slate-800 mt-2"
          >
            <h3 className="text-xl font-bold font-display text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">lock</span>
              Security & Privacy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Password Change */}
              <div className="flex flex-col gap-5">
                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                  Change Password
                </h4>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Current Password
                    </label>
                    <input
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                      placeholder="••••••••••••"
                      type="password"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        New Password
                      </label>
                      <input
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                        placeholder="••••••••••••"
                        type="password"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Confirm New
                      </label>
                      <input
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                        placeholder="••••••••••••"
                        type="password"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <button className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 border border-slate-700 transition-colors">
                    Update Password
                  </button>
                </div>
              </div>

              {/* Data & Danger Zone */}
              <div className="flex flex-col gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-12">
                {/* Privacy Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-medium text-white">Share Analytics Data</h4>
                    <p className="text-xs text-slate-500 max-w-[280px]">
                      Help us improve CVDebug by sharing anonymous usage statistics.
                    </p>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    onClick={() => setShareAnalytics(!shareAnalytics)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                      shareAnalytics ? 'bg-blue-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                        shareAnalytics ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    ></span>
                  </button>
                </div>

                <div className="h-px bg-slate-800 w-full my-2"></div>

                {/* Danger Zone */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wide flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    Danger Zone
                  </h4>
                  <p className="text-xs text-slate-500">
                    Deleting your account will remove all your analyzed CVs and reset your sprint progress. This action cannot be undone.
                  </p>
                  <div>
                    <button className="px-4 py-2 rounded-lg border border-red-900/50 bg-red-500/5 text-red-400 text-sm font-medium hover:bg-red-500/10 hover:border-red-800 transition-colors">
                      Delete Account Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* API Usage Logs (Mini Section) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3 glass-panel rounded-xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-800 rounded-lg">
                <span className="material-symbols-outlined text-slate-400">api</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display">API Access</h4>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                    sk_live_...9x8z
                  </code>
                  <button className="text-blue-400 hover:text-blue-300 text-xs font-medium">
                    Copy
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full md:w-auto">
              <button className="w-full md:w-auto px-4 py-2 rounded-lg border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
                Regenerate Key
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .glass-panel {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(51, 65, 85, 0.5);
        }
        .gradient-btn {
          background: linear-gradient(135deg, #3B82F6 0%, #6366f1 100%);
        }
        .fill-bg-slate-deep {
          fill: #1E293B;
        }
      `}</style>
    </div>
  );
}
