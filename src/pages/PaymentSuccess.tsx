import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RocketIcon, CheckCircle2, Timer, Download, ArrowRight, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

const apiAny: any = api;

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get("transaction_id") || searchParams.get("orderId");
  
  // Fetch latest payment if no transaction ID provided
  const latestPayment = useQuery(apiAny.billing.getUserLatestPayment);
  const generateReceipt = useAction(apiAny.receipts.generateReceipt);
  
  const [isDownloading, setIsDownloading] = useState(false);

  // Use transaction ID from URL or latest payment
  const effectiveTransactionId = transactionId || latestPayment?.transactionId;
  const payment = useQuery(
    apiAny.billing.getPaymentByTransaction,
    effectiveTransactionId ? { transactionId: effectiveTransactionId } : "skip"
  );

  const orderId = payment?.transactionId || "#CVD-PENDING";
  const email = payment?.userEmail || searchParams.get("email") || "user@example.com";
  const userName = payment?.userName || "User";
  const plan = payment?.plan || "interview_sprint";
  const amount = payment?.amount || 19.99;

  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDownloadReceipt = async () => {
    if (!effectiveTransactionId) {
      toast.error("No transaction ID available");
      return;
    }

    setIsDownloading(true);
    try {
      const receipt = await generateReceipt({ transactionId: effectiveTransactionId });
      
      // Create a blob and download
      const blob = new Blob([receipt.text], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CVDebug-Receipt-${receipt.data.orderId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success("Receipt downloaded successfully");
    } catch (error) {
      console.error("Failed to download receipt:", error);
      toast.error("Failed to download receipt");
    } finally {
      setIsDownloading(false);
    }
  };

  // Confetti animation
  const confettiColors = ["#3B82F6", "#8B5CF6", "#FFFFFF"];
  const confettiElements = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
  }));

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col relative overflow-hidden text-white font-display">
      {/* Confetti Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confettiElements.map((confetti) => (
          <motion.div
            key={confetti.id}
            className="absolute w-2.5 h-2.5 rounded-sm"
            style={{
              left: confetti.left,
              backgroundColor: confetti.color,
            }}
            initial={{ y: -100, rotate: 0, opacity: 1 }}
            animate={{ y: "100vh", rotate: 360, opacity: 0 }}
            transition={{
              duration: confetti.duration,
              delay: confetti.delay,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,rgba(15,23,42,0)_70%)] pointer-events-none z-0" />

      {/* Navbar */}
      <header className="relative z-20 flex items-center justify-between border-b border-slate-800 bg-[#0F172A]/80 backdrop-blur-md px-6 lg:px-10 py-4">
        <div className="flex items-center gap-3 text-white">
          <div className="size-8 flex items-center justify-center rounded bg-gradient-to-br from-[#4F46E5] to-[#3B82F6]">
            <span className="material-symbols-outlined text-[20px]">terminal</span>
          </div>
          <h2 className="text-white text-xl font-bold leading-tight tracking-tight">CVDebug</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex text-slate-400 text-sm gap-2 font-mono items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Operational
          </div>
          <div className="bg-gradient-to-br from-primary to-teal-600 rounded-full size-9 border border-slate-700 flex items-center justify-center text-white font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-panel w-full max-w-2xl rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#3B82F6] opacity-80" />

          <div className="flex flex-col items-center text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8 relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="relative bg-slate-800/50 border border-[#8B5CF6]/30 rounded-full p-5 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                <RocketIcon className="h-12 w-12 text-transparent bg-clip-text bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6]" style={{ fill: "url(#gradient)" }} />
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </motion.div>

            {/* Meta Text */}
            <p className="text-[#3B82F6] font-mono text-sm tracking-widest uppercase mb-4 font-bold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Payment Successful
            </p>

            {/* Headline */}
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 tracking-tight">
              {plan === "interview_sprint" ? "Sprint Activated." : "Scan Unlocked."}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                Let's land that job.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-slate-400 text-base sm:text-lg max-w-md mb-10 leading-relaxed">
              {plan === "interview_sprint" 
                ? "Your 7-day intense preparation roadmap has been generated. Access your dashboard to begin the sprint."
                : "Your resume scan is now unlocked. Access your dashboard to view the full analysis."}
            </p>

            {/* Timer Section - Only for Sprint */}
            {plan === "interview_sprint" && (
              <div className="w-full max-w-lg mb-10">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Timer className="h-4 w-4 text-[#8B5CF6] animate-pulse" />
                  <p className="text-slate-400 text-xs uppercase tracking-widest font-mono">
                    Access Expiration Countdown
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-3 sm:gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-700/50 backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.1)] animate-[subtle-pulse_3s_infinite]">
                  {/* Days */}
                  <div className="flex flex-col items-center">
                    <div className="bg-slate-800 w-full py-3 rounded-lg border border-slate-700/50 flex items-center justify-center mb-2">
                      <span className="text-2xl sm:text-3xl font-mono font-bold text-white">
                        {String(timeLeft.days).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono uppercase">Days</span>
                  </div>

                  {/* Hours */}
                  <div className="flex flex-col items-center">
                    <div className="bg-slate-800 w-full py-3 rounded-lg border border-slate-700/50 flex items-center justify-center mb-2">
                      <span className="text-2xl sm:text-3xl font-mono font-bold text-white">
                        {String(timeLeft.hours).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono uppercase">Hours</span>
                  </div>

                  {/* Minutes */}
                  <div className="flex flex-col items-center">
                    <div className="bg-slate-800 w-full py-3 rounded-lg border border-slate-700/50 flex items-center justify-center mb-2">
                      <span className="text-2xl sm:text-3xl font-mono font-bold text-white">
                        {String(timeLeft.minutes).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono uppercase">Mins</span>
                  </div>

                  {/* Seconds */}
                  <div className="flex flex-col items-center">
                    <div className="bg-slate-800 w-full py-3 rounded-lg border border-slate-700/50 flex items-center justify-center mb-2">
                      <span className="text-2xl sm:text-3xl font-mono font-bold text-[#8B5CF6]">
                        {String(timeLeft.seconds).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono uppercase">Secs</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button
                onClick={() => navigate("/dashboard")}
                className="group relative flex items-center justify-center gap-3 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] hover:opacity-90 transition-all duration-300 text-white font-medium py-6 px-8 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] w-full sm:w-auto overflow-hidden h-auto"
              >
                <span className="relative z-10">Go to Mission Control</span>
                <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
              </Button>

              <Button
                variant="outline"
                onClick={handleDownloadReceipt}
                disabled={isDownloading || !effectiveTransactionId}
                className="flex items-center justify-center gap-2 bg-transparent border border-slate-600 hover:border-slate-400 hover:bg-slate-800/30 transition-all text-slate-300 font-medium py-6 px-8 rounded-lg w-full sm:w-auto h-auto"
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Download Receipt
              </Button>
            </div>

            {/* Footer Meta */}
            <div className="mt-8 pt-6 border-t border-slate-800/60 w-full flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 font-mono gap-2">
              <span>
                Order ID: <span className="text-slate-300">{orderId}</span>
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                Receipt sent to {email}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Background Abstract Element */}
        <div className="absolute bottom-0 right-0 w-1/3 opacity-10 pointer-events-none mix-blend-screen">
          <div className="w-full aspect-square bg-contain bg-no-repeat bg-right-bottom" />
        </div>
      </main>
    </div>
  );
}