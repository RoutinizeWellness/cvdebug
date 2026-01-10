import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";

const apiAny = api as any;

// Mock billing history data
const billingHistory = [
  { date: "Sep 29, 2023", description: "Interview Sprint - Monthly", amount: "$19.99", status: "Paid" },
  { date: "Aug 29, 2023", description: "Interview Sprint - Monthly", amount: "$19.99", status: "Paid" },
  { date: "Jul 15, 2023", description: "Single Mission", amount: "$4.99", status: "Paid" },
];

export function SettingsView() {
  const user = useQuery(apiAny.users.currentUser);

  // Calculate sprint progress
  const sprintExpiresAt = user?.sprintExpiresAt || 0;
  const sprintDaysLeft = sprintExpiresAt > Date.now()
    ? Math.ceil((sprintExpiresAt - Date.now()) / (1000 * 60 * 60 * 24))
    : 5; // Default to 5 days for demo

  const planName = user?.subscriptionTier === "interview_sprint" ? "Interview Sprint" : "Interview Sprint";
  const nextPaymentDate = sprintExpiresAt > Date.now()
    ? new Date(sprintExpiresAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "Oct 29, 2023";

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A] overflow-y-auto">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#3B82F6]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#8B5CF6]/10 rounded-full blur-[100px]"></div>

        {/* Abstract Confetti */}
        <div className="absolute rounded-full top-[10%] left-[20%] w-2 h-2 bg-[#8B5CF6] opacity-30 animate-float"></div>
        <div className="absolute rotate-45 top-[15%] right-[25%] w-2 h-2 bg-[#3B82F6] opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute rounded-sm top-[40%] left-[80%] w-2 h-2 bg-emerald-400 opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative flex min-h-screen w-full flex-col z-10">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-white/10 px-8 py-4 backdrop-blur-md bg-[#0F172A]/80 sticky top-0 z-50">
          <div className="flex items-center gap-4 text-white">
            <div className="size-8 flex items-center justify-center rounded bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] text-white">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>terminal</span>
            </div>
            <h2 className="text-white text-xl font-display font-bold leading-tight tracking-tight">CVDebug</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-white/5 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              SYSTEM ONLINE
            </div>
            <button className="flex items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold transition-all">
              <span className="truncate">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto py-12 px-4 md:px-8">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 animate-float"
            style={{ animationDuration: '8s' }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Manage Your Subscription</h1>
            <p className="text-slate-400 text-lg">
              Manage plan details and billing. Current plan: <span className="text-[#8B5CF6] font-semibold">{planName}</span>
            </p>
          </motion.div>

          {/* Current Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card bg-[#1E293B]/60 rounded-2xl p-8 mb-16 relative overflow-hidden border border-[#8B5CF6]/30 shadow-[0_0_40px_-10px_rgba(139,92,246,0.2)]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white font-display">{planName}</h2>
                  <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Active
                  </span>
                </div>
                <p className="text-slate-400">Unlimited access to all AI tools & premium features.</p>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-12 mt-2 md:mt-0">
                <div className="text-left md:text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Next Payment</p>
                  <p className="text-white font-mono text-lg">{nextPaymentDate}</p>
                  <p className="text-sm text-[#8B5CF6] font-medium">Renews in {sprintDaysLeft} days</p>
                </div>
                <button className="w-full md:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-medium transition-all flex items-center justify-center gap-2 group shadow-lg">
                  <span>Manage Billing</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform text-slate-400 group-hover:text-white">open_in_new</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16 items-start">
            {/* Free Diagnostic */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 rounded-2xl flex flex-col h-full border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 duration-300"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2 font-display">Free Diagnostic</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white tracking-tight">$0</span>
                  <span className="text-slate-500 font-medium">/forever</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">
                Basic resume parsing to check formatting health and ATS readability.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="material-symbols-outlined text-slate-500 text-lg mt-0.5">check</span>
                  <span>Basic Format Check</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="material-symbols-outlined text-slate-500 text-lg mt-0.5">check</span>
                  <span>1 Upload / Month</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="material-symbols-outlined text-slate-500 text-lg mt-0.5">check</span>
                  <span>Standard Support</span>
                </li>
              </ul>
              <button className="w-full py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 text-sm font-medium transition-colors">
                Downgrade
              </button>
            </motion.div>

            {/* Single Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 rounded-2xl flex flex-col h-full border border-[#3B82F6]/40 shadow-[0_0_20px_rgba(59,130,246,0.05)] relative hover:border-[#3B82F6]/60 transition-all hover:-translate-y-1 duration-300"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2 font-display">Single Mission</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white tracking-tight">$4.99</span>
                  <span className="text-slate-500 font-medium">/one-time</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">
                Complete deep scan for a specific job application to maximize impact.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm text-white">
                  <span className="material-symbols-outlined text-[#3B82F6] text-lg mt-0.5">check_circle</span>
                  <span>Deep ATS Scan</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white">
                  <span className="material-symbols-outlined text-[#3B82F6] text-lg mt-0.5">check_circle</span>
                  <span>Keyword Gap Analysis</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white">
                  <span className="material-symbols-outlined text-[#3B82F6] text-lg mt-0.5">check_circle</span>
                  <span>Detailed PDF Report</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white">
                  <span className="material-symbols-outlined text-[#3B82F6] text-lg mt-0.5">check_circle</span>
                  <span>3 Re-scans included</span>
                </li>
              </ul>
              <button className="w-full py-2.5 rounded-lg border border-[#3B82F6]/50 text-[#3B82F6] hover:bg-[#3B82F6]/10 text-sm font-medium transition-colors">
                Switch Plan
              </button>
            </motion.div>

            {/* Interview Sprint (Current) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6 rounded-2xl flex flex-col h-full border-2 border-[#8B5CF6] shadow-[0_0_30px_rgba(139,92,246,0.25)] relative transform lg:-translate-y-4 z-10 bg-[#1E293B]/80"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg border border-white/20">
                Most Popular
              </div>
              <div className="mb-4 mt-2">
                <h3 className="text-lg font-semibold text-white mb-2 font-display">Interview Sprint</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white tracking-tight">$19.99</span>
                  <span className="text-slate-500 font-medium">/month</span>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-6 flex-grow leading-relaxed">
                Maximum power for aggressive job hunting. All tools unlocked.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <span className="material-symbols-outlined text-[#8B5CF6] text-lg mt-0.5">verified</span>
                  <span>Unlimited AI Sniper</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <span className="material-symbols-outlined text-[#8B5CF6] text-lg mt-0.5">verified</span>
                  <span>Job Tracker Pro</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <span className="material-symbols-outlined text-[#8B5CF6] text-lg mt-0.5">verified</span>
                  <span>Cover Letter Generator</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <span className="material-symbols-outlined text-[#8B5CF6] text-lg mt-0.5">verified</span>
                  <span>LinkedIn Optimization</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <span className="material-symbols-outlined text-[#8B5CF6] text-lg mt-0.5">verified</span>
                  <span>Priority Support</span>
                </li>
              </ul>
              <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-bold text-sm shadow-lg shadow-blue-500/20 cursor-default flex justify-center items-center gap-2">
                <span>Current Plan</span>
                <span className="material-symbols-outlined text-sm">lock</span>
              </button>
            </motion.div>
          </div>

          {/* Billing History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="animate-float"
            style={{ animationDuration: '9s' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white font-display">Billing History</h2>
              <button className="text-sm text-[#3B82F6] hover:text-white transition-colors flex items-center gap-1 group">
                View All Invoices
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>

            <div className="glass-card rounded-xl overflow-hidden border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5 text-xs uppercase text-slate-400 font-mono tracking-wider">
                      <th className="p-4 font-medium">Date</th>
                      <th className="p-4 font-medium">Description</th>
                      <th className="p-4 font-medium">Amount</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {billingHistory.map((item, index) => (
                      <tr key={index} className={`${index < billingHistory.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors group`}>
                        <td className="p-4 text-slate-300 font-mono">{item.date}</td>
                        <td className="p-4 text-white font-medium">{item.description}</td>
                        <td className="p-4 text-slate-300">{item.amount}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Download Receipt">
                            <span className="material-symbols-outlined text-lg">download</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
