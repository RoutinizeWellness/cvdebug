import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router";
import { useSearchParams } from "react-router";
import { Loader2, Zap, Shield, Target } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
          <div className="h-4 w-32 bg-primary/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectUrl} />;
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
      formButtonPrimary: "bg-gradient-to-r from-blue-500 to-primary hover:from-blue-600 hover:to-primary/90 text-white shadow-[0_0_30px_-5px_rgba(59,130,246,0.6)] hover:shadow-[0_0_40px_-5px_rgba(59,130,246,0.8)] transition-all rounded-lg py-3 font-bold w-full border-0",
      formFieldLabel: "text-slate-300 text-sm font-semibold",
      formFieldInput: "bg-slate-900/50 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] rounded-lg h-12 transition-all w-full backdrop-blur-sm",
      formFieldRow: "w-full",
      formFieldInputGroup: "w-full",
      form: "w-full flex flex-col gap-4",
      identityPreviewText: "hidden",
      identityPreviewEditButton: "hidden",
      footerPages: "hidden",
      footerPagesLink: "hidden",
      socialButtonsBlockButton: "bg-slate-900/50 border-2 border-slate-700 text-white hover:bg-slate-800/50 hover:border-slate-600 hover:shadow-[0_0_20px_-5px_rgba(148,163,184,0.3)] transition-all rounded-lg w-full backdrop-blur-sm",
      socialButtonsBlockButtonText: "text-white font-semibold",
      socialButtonsIconButton: "text-white",
      dividerLine: "bg-slate-700",
      dividerText: "text-slate-500 text-xs uppercase tracking-wider font-semibold",
      formFieldAction: "text-blue-400 hover:text-blue-300 font-semibold",
      otpCodeFieldInput: "bg-slate-900/50 border-2 border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm",
      formResendCodeLink: "text-blue-400 hover:text-blue-300 font-semibold",
      identityPreview: "bg-slate-900/50 border-2 border-slate-700 rounded-lg backdrop-blur-sm",
      formFieldSuccessText: "text-emerald-400 font-semibold",
      formFieldErrorText: "text-red-400 font-semibold",
      alertText: "text-slate-300",
      alert: "bg-slate-900/50 border-2 border-slate-700 rounded-lg backdrop-blur-sm",
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900 text-white overflow-hidden relative">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(124,58,237,0.15)_0%,_transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(59,130,246,0.1)_0%,_transparent_50%)]"></div>
      
      {/* Left Side - Blueprint Visualization */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 border-r border-slate-800/50">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800"></div>
        
        {/* Animated Blueprint */}
        <motion.div 
          className="relative z-10 w-full max-w-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Blueprint Header */}
          <div className="mb-8 space-y-2">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Zap className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">ATS Analysis Engine</h2>
            </motion.div>
            <motion.p 
              className="text-slate-400 text-sm font-mono"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Real-time resume parsing & optimization
            </motion.p>
          </div>

          {/* Blueprint Visualization */}
          <div className="relative bg-slate-950/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-xl p-8 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]">
            {/* Scanning Lines Animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Resume Outline */}
            <div className="relative space-y-4">
              {/* Header Section */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="h-3 w-1/3 bg-blue-400/40 rounded"></div>
                <div className="h-2 w-1/4 bg-slate-600/40 rounded"></div>
              </motion.div>

              {/* Scanning Indicators */}
              <div className="flex gap-2 my-4">
                <motion.div 
                  className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-wider"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Shield className="inline h-3 w-3 mr-1" />
                  ATS Compatible
                </motion.div>
                <motion.div 
                  className="px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-wider"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Target className="inline h-3 w-3 mr-1" />
                  98% Match
                </motion.div>
              </div>

              {/* Content Blocks */}
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="space-y-1.5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div className="h-2 w-full bg-slate-700/40 rounded"></div>
                    <div className="h-2 w-5/6 bg-slate-700/30 rounded"></div>
                    <div className="h-2 w-4/6 bg-slate-700/20 rounded"></div>
                  </motion.div>
                ))}
              </div>

              {/* Laser Scan Lines */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                animate={{ y: [0, 300] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>

          {/* Stats */}
          <motion.div 
            className="mt-6 grid grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="text-center">
              <div className="text-2xl font-black text-blue-400">98%</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Parse Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-primary">2.3s</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Avg Scan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-400">15K+</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Optimized</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Logo showText={false} className="mb-4" iconClassName="h-16 w-16" />
            <h1 className="text-3xl font-black tracking-tight text-white">CVDebug</h1>
            <p className="text-slate-400 text-sm mt-2 font-semibold">Engineering-Grade Resume Optimization</p>
          </div>

          {/* Glassmorphism Card */}
          <div className="relative bg-slate-900/40 backdrop-blur-xl border-2 border-slate-700/50 rounded-2xl shadow-[0_0_80px_-12px_rgba(124,58,237,0.3)] p-8">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-primary/20 rounded-2xl blur opacity-30"></div>
            
            <div className="relative">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                  {isSignIn ? "Welcome Back" : "Start Your Mission"}
                </h2>
                <p className="text-slate-400 text-sm">
                  {isSignIn 
                    ? "Access your optimization dashboard" 
                    : "Join thousands optimizing their careers"}
                </p>
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
              
              <div className="mt-6 text-center text-sm border-t border-slate-700/50 pt-6">
                <span className="text-slate-400">
                  {isSignIn ? "New to CVDebug? " : "Already have an account? "}
                </span>
                <button 
                  onClick={() => setIsSignIn(!isSignIn)}
                  className="font-bold text-blue-400 hover:text-blue-300 hover:underline transition-all ml-1"
                >
                  {isSignIn ? "Create account" : "Sign in"}
                </button>
              </div>
            </div>
          </div>
          
          {/* Footer Links */}
          <div className="mt-6 flex justify-center items-center space-x-4 text-xs text-slate-600">
            <span className="text-slate-700">•</span>
            <a href="/terms" className="hover:text-slate-400 transition-colors">Terms</a>
            <span className="text-slate-700">•</span>
            <a href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</a>
            <span className="text-slate-700">•</span>
            <a href="https://x.com/Aherme13" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">Support</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}