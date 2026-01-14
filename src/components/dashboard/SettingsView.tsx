import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useState } from "react";

const apiAny = api as any;

interface SettingsViewProps {
  onOpenPricing?: () => void;
}

export function SettingsView({ onOpenPricing }: SettingsViewProps = {}) {
  const user = useQuery(apiAny.users.currentUser);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Calculate sprint progress
  const sprintExpiresAt = user?.sprintExpiresAt || 0;
  const sprintDaysLeft = sprintExpiresAt > Date.now()
    ? Math.ceil((sprintExpiresAt - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  const planName = user?.subscriptionTier === "interview_sprint" ? "Interview Sprint" : "Interview Sprint";
  const validUntil = sprintExpiresAt > Date.now()
    ? new Date(sprintExpiresAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "Not available";

  const userName = user?.name || "Not available";
  const userEmail = user?.email || "Not available";

  // Toast notification handler
  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Copy API key to clipboard
  const handleCopyApiKey = () => {
    const apiKey = user?.apiKey || "";
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      showNotification("API key copied to clipboard");
    }
  };

  // Regenerate API key
  const handleRegenerateApiKey = () => {
    // TODO: Implement API key regeneration
    showNotification("API key regeneration requested");
  };

  // Generate API key
  const handleGenerateApiKey = () => {
    // TODO: Implement API key generation
    showNotification("API key generation requested");
  };

  // Handle documentation
  const handleDocumentation = () => {
    window.open("/blog", "_blank");
  };

  // Handle support
  const handleSupport = () => {
    window.open("/contact", "_blank");
  };

  // Handle password update
  const handleUpdatePassword = () => {
    showNotification("Password update functionality coming soon");
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete all your account data? This action cannot be undone.")) {
      showNotification("Account deletion requested - please contact support to complete");
    }
  };

  // Calculate progress percentage (assuming 30 day sprint)
  const totalSprintDays = 30;
  const daysElapsed = totalSprintDays - sprintDaysLeft;
  const progressPercentage = Math.round((daysElapsed / totalSprintDays) * 100);

  return (
    <div className="flex-1 overflow-y-auto relative bg-[#F8FAFC]">
      <div className="max-w-[1200px] mx-auto px-6 py-8 md:px-10 md:py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold font-display text-[#0F172A] tracking-tight">
              Account & Settings
            </h1>
            <p className="text-[#64748B] font-body">
              Manage your subscription, security, and view your performance stats.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDocumentation}
              className="px-4 py-2 rounded-lg border border-[#E2E8F0] text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors"
            >
              Documentation
            </button>
            <button
              onClick={handleSupport}
              className="px-4 py-2 rounded-lg border border-[#E2E8F0] text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors"
            >
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
            className="lg:col-span-2 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl overflow-hidden relative shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
          >
            <div className="p-6 md:p-8 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-blue-50 text-[#3B82F6] border border-blue-200">
                      Active
                    </span>
                    <p className="text-[#64748B] text-sm font-medium">Current Plan</p>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-[#0F172A] mb-1">
                    {planName}
                  </h2>
                  <p className="text-[#64748B] text-sm">Valid until {validUntil}</p>
                </div>
                <div className="size-12 rounded-full bg-[#F8FAFC] flex items-center justify-center border border-[#E2E8F0]">
                  <span className="material-symbols-outlined text-[#475569]">rocket_launch</span>
                </div>
              </div>

              {/* Progress Bar Component */}
              <div className="flex flex-col gap-2 mb-8">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#0F172A] font-medium">Sprint Progress</span>
                  <span className="text-[#3B82F6] font-mono">{sprintDaysLeft > 0 ? `${sprintDaysLeft} Days Left` : 'Not available'}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-[#64748B] mt-1">
                  <span>Day {daysElapsed}</span>
                  <span>Day {totalSprintDays}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4 border-t border-[#E2E8F0]">
                <button
                  onClick={onOpenPricing}
                  className="gradient-btn px-5 py-2.5 rounded-lg text-[#0F172A] text-sm font-semibold shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all flex items-center gap-2"
                >
                  <span>Manage Subscription</span>
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats Card (Span 1 column) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-cyan-600">monitoring</span>
                <h3 className="text-lg font-bold font-display text-[#0F172A]">Match Score</h3>
              </div>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-[#0F172A] font-display">84%</span>
                <span className="text-[#22C55E] text-sm font-mono flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
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
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2"></stop>
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
                <circle className="fill-white stroke-violet-500 stroke-[1.5]" cx="35" cy="25" r="2"></circle>
                <circle className="fill-white stroke-violet-500 stroke-[1.5]" cx="70" cy="15" r="2"></circle>
                <circle className="fill-white stroke-violet-500 stroke-[1.5]" cx="100" cy="5" r="2"></circle>
              </svg>
              {/* X-Axis Labels */}
              <div className="flex justify-between text-[10px] text-[#64748B] font-mono mt-2 uppercase tracking-wider">
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
            className="lg:col-span-3 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 md:p-8 mt-2 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
          >
            <h3 className="text-xl font-bold font-display text-[#0F172A] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#64748B]">lock</span>
              Security & Privacy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Password Change */}
              <div className="flex flex-col gap-5">
                <h4 className="text-sm font-semibold text-[#475569] uppercase tracking-wide">
                  Change Password
                </h4>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#475569] mb-1.5">
                      Current Password
                    </label>
                    <input
                      className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                      placeholder="••••••••••••"
                      type="password"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#475569] mb-1.5">
                        New Password
                      </label>
                      <input
                        className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                        placeholder="••••••••••••"
                        type="password"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#475569] mb-1.5">
                        Confirm New
                      </label>
                      <input
                        className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                        placeholder="••••••••••••"
                        type="password"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <button
                    onClick={handleUpdatePassword}
                    className="px-4 py-2 rounded-lg bg-[#FFFFFF] text-[#0F172A] text-sm font-medium hover:bg-[#F8FAFC] border border-slate-900 transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              {/* Data & Danger Zone */}
              <div className="flex flex-col gap-6 border-t md:border-t-0 md:border-l border-[#E2E8F0] pt-6 md:pt-0 md:pl-12">
                {/* Privacy Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-medium text-[#0F172A]">Share Analytics Data</h4>
                    <p className="text-xs text-[#64748B] max-w-[280px]">
                      Help us improve CVDebug by sharing anonymous usage statistics.
                    </p>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    onClick={() => setShareAnalytics(!shareAnalytics)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white ${
                      shareAnalytics ? 'bg-[#3B82F6]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-[#FFFFFF] transition duration-200 ease-in-out ${
                        shareAnalytics ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    ></span>
                  </button>
                </div>

                <div className="h-px bg-slate-200 w-full my-2"></div>

                {/* Danger Zone */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-semibold text-[#EF4444] uppercase tracking-wide flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    Danger Zone
                  </h4>
                  <p className="text-xs text-[#64748B]">
                    Deleting your account will remove all your analyzed CVs and reset your sprint progress. This action cannot be undone.
                  </p>
                  <div>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-[#EF4444] text-sm font-medium hover:bg-red-100 hover:border-red-300 transition-colors"
                    >
                      Delete Account Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* API Access section removed - not needed for end users */}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="bg-[#FFFFFF] text-[#0F172A] px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-green-400 text-[20px]">check_circle</span>
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      <style>{`
        .gradient-btn {
          background: linear-gradient(135deg, #3B82F6 0%, #6366f1 100%);
        }
        @keyframes slide-up {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
