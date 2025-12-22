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
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
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
      formButtonPrimary: "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all rounded-lg py-3 font-bold w-full border-0 transform hover:-translate-y-0.5",
      formFieldLabel: "text-xs font-mono text-primary font-medium tracking-wide uppercase ml-1 mb-1.5",
      formFieldInput: "block w-full pl-10 pr-3 py-3 bg-slate-900/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.4)] font-mono transition-all duration-300",
      formFieldRow: "w-full space-y-1",
      formFieldInputGroup: "w-full relative group",
      form: "w-full flex flex-col gap-5",
      identityPreviewText: "hidden",
      identityPreviewEditButton: "hidden",
      footerPages: "hidden",
      footerPagesLink: "hidden",
      socialButtonsBlockButton: "flex-1 flex items-center justify-center gap-2 h-11 rounded-lg bg-slate-800/50 hover:bg-slate-700/70 border border-slate-700 hover:border-slate-600 transition-all duration-200 text-sm font-medium text-slate-200 hover:text-white shadow-sm hover:shadow-md hover:shadow-primary/10",
      socialButtonsBlockButtonText: "text-slate-200 font-medium",
      socialButtonsIconButton: "text-white",
      dividerLine: "border-slate-700/60",
      dividerText: "text-slate-500 text-xs font-mono uppercase tracking-widest mx-4",
      formFieldAction: "text-xs text-slate-400 hover:text-white transition-colors",
      otpCodeFieldInput: "bg-slate-900/80 border border-slate-700 text-white focus:border-primary focus:ring-2 focus:ring-primary/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] rounded-lg transition-all duration-300",
      formResendCodeLink: "text-primary hover:text-blue-400 font-medium",
      identityPreview: "bg-slate-900/50 border border-slate-700 rounded-lg",
      formFieldSuccessText: "text-emerald-400 font-semibold text-xs",
      formFieldErrorText: "text-red-400 font-semibold text-xs",
      alertText: "text-slate-300 text-sm",
      alert: "bg-slate-900/50 border border-slate-700 rounded-lg p-3",
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0F172A] text-white overflow-hidden relative font-display antialiased">
      {/* Background ambient glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px] translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/4 -translate-x-1/4"></div>
      </div>
      
      {/* Left Side - Technical Blueprint */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col border-r border-slate-700/30 overflow-hidden bg-slate-900/50">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none" style={{
          backgroundSize: '40px 40px',
          backgroundImage: 'linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)'
        }}></div>
        
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center opacity-40 mix-blend-luminosity" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80')"
          }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent"></div>
        </div>

        <div className="relative z-20 flex flex-col justify-between h-full p-12">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <Terminal className="text-primary text-3xl h-8 w-8" />
              <span className="text-2xl font-bold tracking-tight text-white">CVDebug</span>
            </div>
          </div>

          {/* Main content */}
          <div className="max-w-md">
            {/* Scanning status card */}
            <motion.div 
              className="relative mb-8 p-6 rounded-lg border border-primary/20 bg-slate-900/80 backdrop-blur-sm overflow-hidden"
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
                  <span className="text-emerald-400">OK</span>
                </div>
                <div className="flex justify-between">
                  <span>&gt; PARSING_KEYWORDS...</span>
                  <span className="text-emerald-400">OK</span>
                </div>
                <div className="flex justify-between">
                  <span>&gt; OPTIMIZING_ATS_SCORE...</span>
                  <span className="animate-pulse text-secondary">PROCESSING</span>
                </div>
              </div>
            </motion.div>

            <motion.h1 
              className="text-4xl font-bold text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Debug your career history with precision.
            </motion.h1>
            <motion.p 
              className="text-slate-400 font-body text-lg"
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
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Initialize Session</h2>
            <p className="text-slate-400 font-body text-sm">Enter your credentials to access the console</p>
          </div>

          {/* Glass card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 w-full shadow-2xl shadow-black/40">
            <div className="flex flex-col gap-6">
              {/* Toggle between Sign In / Sign Up */}
              <div className="bg-slate-900/50 p-1 rounded-lg flex mb-2 border border-slate-800">
                <button
                  onClick={() => setIsSignIn(true)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    isSignIn 
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsSignIn(false)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    !isSignIn 
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {isSignIn ? (
                <SignIn 
                  routing="hash"
                  forceRedirectUrl={redirectUrl}
                  signUpUrl="#"
                  appearance={clerkAppearance}
                />
              ) : (
                <SignUp 
                  routing="hash"
                  forceRedirectUrl={redirectUrl}
                  signInUrl="#"
                  appearance={clerkAppearance}
                />
              )}
            </div>
          </div>
          
          {/* Footer text */}
          <div className="text-center">
            <p className="text-sm text-slate-400">
              {isSignIn ? "No account found?" : "Already have an account?"}
              <a 
                onClick={() => setIsSignIn(!isSignIn)}
                className="font-medium text-primary hover:text-blue-400 transition-colors font-mono ml-1 cursor-pointer"
              >
                [{isSignIn ? "Deploy new profile" : "Sign in"}]
              </a>
            </p>
          </div>

          {/* System status */}
          <div className="mt-8 flex justify-center gap-6 opacity-40 hover:opacity-100 transition-opacity duration-300">
            <span className="text-xs font-mono text-slate-500">v2.4.0-stable</span>
            <div className="h-4 w-[1px] bg-slate-700"></div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-mono text-slate-500">System Operational</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}