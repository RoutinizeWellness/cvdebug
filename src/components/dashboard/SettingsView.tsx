import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Rocket,
  TrendingUp,
  Lock,
  AlertTriangle,
  Key,
  ExternalLink,
  Copy,
  BookOpen,
  HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";

const apiAny = api as any;

export function SettingsView() {
  const user = useQuery(apiAny.users.currentUser);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);

  // Calculate sprint progress
  const sprintExpiresAt = user?.sprintExpiresAt || 0;
  const sprintDaysLeft = sprintExpiresAt > Date.now()
    ? Math.ceil((sprintExpiresAt - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;
  const sprintProgress = Math.max(0, Math.min(100, ((30 - sprintDaysLeft) / 30) * 100));

  // Mock match score improvement (in real app, would come from analytics)
  const matchScore = 84;
  const matchScoreImprovement = 15;

  const handlePasswordUpdate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    // In real implementation, would call a mutation
    toast.success("Password updated successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText("sk_live_...9x8z");
    toast.success("API key copied to clipboard");
  };

  const handleRegenerateKey = () => {
    toast.success("API key regenerated");
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast.error("Account deletion is not implemented in this demo");
    }
  };

  const planName = user?.subscriptionTier === "interview_sprint" ? "Interview Sprint" : "Free Plan";
  const planExpiry = sprintExpiresAt > Date.now()
    ? new Date(sprintExpiresAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "No active subscription";

  return (
    <div className="relative min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="layout-container flex flex-col max-w-[1200px] mx-auto px-6 py-8 md:px-10 md:py-12 relative z-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold font-display text-white tracking-tight">
              Account & Settings
            </h1>
            <p className="text-slate-400 font-body">
              Manage your subscription, security, and view your performance stats.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Documentation
            </Button>
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Support
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plan Section (Span 2 columns) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass-panel rounded-xl overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
            <div className="p-6 md:p-8 flex flex-col justify-between h-full relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {user?.subscriptionTier === "interview_sprint" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/20">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-500/20 text-slate-400 border border-slate-500/20">
                        Free
                      </span>
                    )}
                    <p className="text-slate-400 text-sm font-medium">Current Plan</p>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">
                    {planName}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    {user?.subscriptionTier === "interview_sprint" ? `Valid until ${planExpiry}` : "Upgrade to unlock all features"}
                  </p>
                </div>
                <div className="size-12 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Progress Bar Component */}
              {user?.subscriptionTier === "interview_sprint" && sprintDaysLeft > 0 && (
                <div className="flex flex-col gap-2 mb-8">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white font-medium">Sprint Progress</span>
                    <span className="text-blue-400 font-mono">{sprintDaysLeft} Days Left</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sprintProgress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Day {30 - sprintDaysLeft}</span>
                    <span>Day 30</span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800/50">
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all">
                  <span>Manage Subscription</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-700 hover:border-slate-500 text-white bg-transparent"
                >
                  View Billing History
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Card (Span 1 column) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-[60px] pointer-events-none"></div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-violet-400">monitoring</span>
                <h3 className="text-lg font-bold font-display text-white">Match Score</h3>
              </div>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-white font-display">{matchScore}%</span>
                <span className="text-emerald-400 text-sm font-mono flex items-center bg-emerald-400/10 px-1.5 py-0.5 rounded">
                  <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
                  +{matchScoreImprovement}%
                </span>
              </div>
            </div>

            {/* Chart SVG */}
            <div className="relative h-32 w-full mt-auto">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 40 Q 25 35, 35 25 T 70 15 T 100 5 L 100 50 L 0 50 Z"
                  fill="url(#chartGradient)"
                />
                <path
                  d="M0 40 Q 25 35, 35 25 T 70 15 T 100 5"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeLinecap="round"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Data Points */}
                <circle className="fill-slate-900 stroke-violet-400 stroke-[1.5]" cx="35" cy="25" r="2" />
                <circle className="fill-slate-900 stroke-violet-400 stroke-[1.5]" cx="70" cy="15" r="2" />
                <circle className="fill-slate-900 stroke-violet-400 stroke-[1.5]" cx="100" cy="5" r="2" />
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 glass-panel rounded-xl p-6 md:p-8 border border-slate-800 mt-2"
          >
            <h3 className="text-xl font-bold font-display text-white mb-6 flex items-center gap-2">
              <Lock className="h-5 w-5 text-slate-400" />
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
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                      placeholder="••••••••••••"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        New Password
                      </label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                        placeholder="••••••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Confirm New
                      </label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                        placeholder="••••••••••••"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <Button
                    onClick={handlePasswordUpdate}
                    variant="outline"
                    className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
                  >
                    Update Password
                  </Button>
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
                  <Switch
                    checked={shareAnalytics}
                    onCheckedChange={setShareAnalytics}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>

                <div className="h-px bg-slate-800 w-full my-2"></div>

                {/* Danger Zone */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wide flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Danger Zone
                  </h4>
                  <p className="text-xs text-slate-500">
                    Deleting your account will remove all your analyzed CVs and reset your sprint
                    progress. This action cannot be undone.
                  </p>
                  <div>
                    <Button
                      onClick={handleDeleteAccount}
                      variant="outline"
                      className="border-red-900/50 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:border-red-800"
                    >
                      Delete Account Data
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* API Usage Logs (Mini Section) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 glass-panel rounded-xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-800 rounded-lg">
                <Key className="h-5 w-5 text-slate-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display">API Access</h4>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                    {showApiKey ? "sk_live_1234567890abcdef9x8z" : "sk_live_...9x8z"}
                  </code>
                  <button
                    onClick={handleCopyApiKey}
                    className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full md:w-auto">
              <Button
                onClick={handleRegenerateKey}
                variant="outline"
                className="w-full md:w-auto border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Regenerate Key
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
