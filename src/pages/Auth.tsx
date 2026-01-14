import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router";
import { useSearchParams } from "react-router";
import { Loader2, Terminal, Mail, Key, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getDeviceFingerprint } from "@/lib/deviceFingerprint";
import { motion } from "framer-motion";

const apiAny: any = api;

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const [searchParams] = useSearchParams();
  const storeUser = useMutation(apiAny.users.storeUser);
  const plan = searchParams.get("plan");
  const payment = searchParams.get("payment");
  
  useEffect(() => {
    if (isAuthenticated) {
      getDeviceFingerprint().then(fingerprint => {
        storeUser({ deviceFingerprint: fingerprint });
      }).catch(err => {
        console.error("Failed to get fingerprint:", err);
        storeUser();
      });
    }
  }, [isAuthenticated, storeUser]);
  
  let redirectUrl = "/dashboard";
  const params = new URLSearchParams();
  if (plan) params.append("plan", plan);
  if (payment) params.append("payment", payment);
  
  if (params.toString()) {
    redirectUrl = `/dashboard?${params.toString()}`;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden">
        {/* Background glow */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-[120px]"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          {/* Logo with glow */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur-2xl"></div>
            <div className="relative h-16 w-16 bg-[#FFFFFF] backdrop-blur-sm rounded-full flex items-center justify-center border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          </div>

          {/* Loading text */}
          <div className="flex flex-col items-center gap-2">
            <div className="h-2 w-32 bg-[#F8FAFC] rounded-full overflow-hidden border border-[#E2E8F0]">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <p className="text-sm text-[#475569] font-mono">Initializing session...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectUrl} replace />;
  }

  const clerkAppearance = {
    elements: {
      rootBox: "w-full flex justify-center",
      card: "shadow-none border-none w-full bg-transparent p-0 flex flex-col items-center",
      headerTitle: "hidden",
      headerSubtitle: "hidden",
      header: "hidden",
      footer: "hidden",
      footerAction: "hidden",
      footerActionLink: "hidden",
      footerActionText: "hidden",
      formButtonPrimary: "bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)] hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.5)] transition-all rounded-lg py-3 font-bold w-full border-0 transform hover:-translate-y-0.5",
      formFieldLabel: "text-xs font-mono text-[#3B82F6] font-medium tracking-wide uppercase ml-1 mb-1.5",
      formFieldInput: "block w-full pl-10 pr-3 py-3 bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.2)] font-mono transition-all duration-300",
      formFieldRow: "w-full space-y-1",
      formFieldInputGroup: "w-full relative group",
      form: "w-full flex flex-col gap-5",
      identityPreviewText: "hidden",
      identityPreviewEditButton: "hidden",
      footerPages: "hidden",
      footerPagesLink: "hidden",
      socialButtonsBlockButton: "flex-1 flex items-center justify-center gap-2 h-11 rounded-lg bg-[#F8FAFC] hover:bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#3B82F6] transition-all duration-200 text-sm font-medium text-[#475569] hover:text-[#0F172A] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]",
      socialButtonsBlockButtonText: "text-[#475569] font-medium",
      socialButtonsIconButton: "text-[#0F172A]",
      dividerLine: "border-[#E2E8F0]",
      dividerText: "text-[#64748B] text-xs font-mono uppercase tracking-widest mx-4",
      formFieldAction: "text-xs text-[#3B82F6] hover:text-[#8B5CF6] transition-colors",
      otpCodeFieldInput: "bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] rounded-lg transition-all duration-300",
      formResendCodeLink: "text-[#3B82F6] hover:text-[#8B5CF6] font-medium",
      identityPreview: "bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg",
      formFieldSuccessText: "text-emerald-500 font-semibold text-xs",
      formFieldErrorText: "text-red-500 font-semibold text-xs",
      alertText: "text-[#475569] text-sm",
      alert: "bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3",
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#0F172A] overflow-hidden relative font-display antialiased">
      {/* Enhanced background ambient glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-secondary/15 via-teal-500/10 to-transparent rounded-full blur-[140px] translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-gradient-to-br from-primary/10 via-blue-500/8 to-transparent rounded-full blur-[120px] -translate-y-1/4 -translate-x-1/4"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/5 to-pink-500/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Subtle noise texture overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      {/* Left Side - Technical Blueprint */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col border-r border-[#E2E8F0] overflow-hidden">
        {/* Glassmorphism backdrop */}
        <div className="absolute inset-0 bg-[#FFFFFF]/70 backdrop-blur-3xl"></div>

        {/* Animated grid pattern overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none" style={{
          backgroundSize: '50px 50px',
          backgroundImage: 'linear-gradient(to right, rgba(59, 130, 246, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 92, 246, 0.04) 1px, transparent 1px)'
        }}>
          {/* Gradient overlay on grid */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/[0.02] to-transparent"></div>
        </div>

        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center opacity-30 mix-blend-luminosity" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80')"
          }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/90 to-[#F8FAFC]/60"></div>
        </div>

        <div className="relative z-20 flex flex-col justify-between h-full p-12">
          {/* Logo */}
          <div>
            <motion.div
              className="mb-8 relative inline-block"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative bg-[#FFFFFF] backdrop-blur-sm border border-[#E2E8F0] rounded-xl px-6 py-4">
                <Logo showText={true} iconClassName="h-10 w-auto" textClassName="text-2xl" />
              </div>
            </motion.div>
          </div>

          {/* Main content */}
          <div className="max-w-md">
            {/* Scanning status card */}
            <motion.div
              className="relative mb-8 p-6 rounded-lg border border-primary/20 bg-[#FFFFFF] backdrop-blur-sm overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Scanning line animation */}
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_10px_#3B82F6]"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />

              <div className="flex flex-col gap-2 font-mono text-xs text-primary/80">
                <div className="flex justify-between">
                  <span>&gt; ANALYZING_STRUCTURE...</span>
                  <span className="text-emerald-500">OK</span>
                </div>
                <div className="flex justify-between">
                  <span>&gt; PARSING_KEYWORDS...</span>
                  <span className="text-emerald-500">OK</span>
                </div>
                <div className="flex justify-between">
                  <span>&gt; OPTIMIZING_ATS_SCORE...</span>
                  <span className="animate-pulse text-secondary">PROCESSING</span>
                </div>
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold text-[#0F172A] mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Debug your career history with precision.
            </motion.h1>
            <motion.p
              className="text-[#475569] font-body text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Use our advanced engineering tools to refactor your resume and deploy your best professional profile.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 relative z-10">
        <motion.div
          className="w-full max-w-[440px] flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-2">
            <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight mb-2">Initialize Session</h2>
            <p className="text-[#475569] font-body text-sm">Enter your credentials to access the console</p>
          </div>

          {/* Enhanced glass card */}
          <div className="relative">
            {/* Glow effect behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl blur-xl opacity-40"></div>

            <div className="relative bg-[#FFFFFF] backdrop-blur-2xl border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 w-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
              <div className="flex flex-col gap-6">
              {/* Toggle between Sign In / Sign Up */}
              <div className="bg-[#F8FAFC] p-1 rounded-lg flex mb-2 border border-[#E2E8F0]">
                <button
                  onClick={() => setIsSignIn(true)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    isSignIn
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)]'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsSignIn(false)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    !isSignIn
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)]'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {isSignIn ? (
                <SignIn
                  routing="hash"
                  forceRedirectUrl={redirectUrl}
                  appearance={clerkAppearance}
                />
              ) : (
                <SignUp
                  routing="hash"
                  forceRedirectUrl={redirectUrl}
                  appearance={clerkAppearance}
                />
              )}
              </div>
            </div>
          </div>
          
          {/* Footer text */}
          <div className="text-center">
            <p className="text-sm text-[#475569]">
              {isSignIn ? "No account found?" : "Already have an account?"}
              <a
                onClick={() => setIsSignIn(!isSignIn)}
                className="font-medium text-[#3B82F6] hover:text-[#8B5CF6] transition-colors font-mono ml-1 cursor-pointer"
              >
                [{isSignIn ? "Deploy new profile" : "Sign in"}]
              </a>
            </p>
          </div>

          {/* System status */}
          <div className="mt-8 flex justify-center gap-6 opacity-40 hover:opacity-100 transition-opacity duration-300">
            <span className="text-xs font-mono text-[#64748B]">v2.4.0-stable</span>
            <div className="h-4 w-[1px] bg-[#E2E8F0]"></div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
              <span className="text-xs font-mono text-[#64748B]">System Operational</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}