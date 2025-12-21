import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Building2, 
  FileText, 
  Radar, 
  ArrowRight, 
  ArrowLeft,
  HelpCircle,
  Trash2,
  Upload
} from "lucide-react";
import { useNavigate } from "react-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const apiAny = api as any;

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [targetCompany, setTargetCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const createProject = useMutation(apiAny.projects.createProject);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast.success("Resume uploaded successfully");
      setTimeout(() => setCurrentStep(2), 800);
    }
  };

  const handleInitializeScan = async () => {
    if (!targetCompany || !jobDescription) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsScanning(true);
    setCurrentStep(3);

    // Simulate scanning process
    setTimeout(async () => {
      try {
        await createProject({
          name: `${targetCompany} Application`,
          targetRole: targetCompany,
          description: jobDescription.substring(0, 200),
        });
        toast.success("Analysis complete! Redirecting to dashboard...");
        setTimeout(() => navigate("/dashboard"), 2000);
      } catch (error) {
        toast.error("Failed to initialize scan");
        setIsScanning(false);
      }
    }, 5000);
  };

  const scanLogs = [
    { time: "10:42:01", type: "success", message: "Connection established to Core Engine" },
    { time: "10:42:02", type: "success", message: "PDF Parsing completed (2 pages found)" },
    { time: "10:42:03", type: "info", message: 'Extracting keywords: "React", "TypeScript", "Node.js"' },
    { time: "10:42:04", type: "warning", message: 'Gap detected: "Cloud Architecture" missing in experience' },
    { time: "10:42:05", type: "info", message: "Calculating ATS match score..." },
    { time: "10:42:06", type: "active", message: "Generating optimization suggestions..." },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-secondary/30">
      {/* Header */}
      <header className="w-full z-50 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo showText={true} />
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-medium text-slate-300">System Online</span>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-start py-12 px-4 md:px-6 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Main Content Container */}
        <div className="w-full max-w-5xl flex flex-col gap-12 relative z-10">
          <div className="text-center space-y-2 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              First Mission Onboarding
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              Configure your profile to initiate your first AI-driven career debug session.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Sidebar: Progress Timeline */}
            <div className="hidden lg:flex flex-col gap-8 sticky top-24">
              <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-[#3B82F6]">
                <div className="flex flex-col gap-6 relative">
                  {/* Vertical line */}
                  <div className="absolute left-[15px] top-8 bottom-2 w-0.5 bg-slate-800 -z-10"></div>

                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className={`relative z-10 flex items-center justify-center size-8 rounded-full ${
                      currentStep > 1 
                        ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-500/25" 
                        : currentStep === 1
                        ? "bg-white text-[#0F172A] shadow-lg shadow-white/10"
                        : "bg-slate-800 text-slate-500 border border-slate-700"
                    } ring-4 ring-[#0F172A]`}>
                      {currentStep > 1 ? <Check className="h-4 w-4" /> : <span className="font-bold text-sm">1</span>}
                    </div>
                    <div className="flex flex-col pt-1">
                      <span className={`text-sm font-bold ${currentStep >= 1 ? "text-white" : "text-slate-500"}`}>
                        Upload Master CV
                      </span>
                      <span className={`text-xs ${currentStep > 1 ? "text-slate-400" : currentStep === 1 ? "text-[#3B82F6]" : "text-slate-600"}`}>
                        {currentStep > 1 ? "Completed" : currentStep === 1 ? "In Progress" : "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className={`relative z-10 flex items-center justify-center size-8 rounded-full ${
                      currentStep > 2 
                        ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-500/25" 
                        : currentStep === 2
                        ? "bg-white text-[#0F172A] shadow-lg shadow-white/10"
                        : "bg-slate-800 text-slate-500 border border-slate-700"
                    } ring-4 ring-[#0F172A]`}>
                      {currentStep > 2 ? <Check className="h-4 w-4" /> : <span className="font-bold text-sm">2</span>}
                    </div>
                    <div className="flex flex-col pt-1">
                      <span className={`text-sm font-bold ${currentStep >= 2 ? "text-white" : "text-slate-500"}`}>
                        Target Definition
                      </span>
                      <span className={`text-xs ${currentStep > 2 ? "text-slate-400" : currentStep === 2 ? "text-[#3B82F6]" : "text-slate-600"}`}>
                        {currentStep > 2 ? "Completed" : currentStep === 2 ? "In Progress" : "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div className={`relative z-10 flex items-center justify-center size-8 rounded-full ${
                      currentStep === 3
                        ? "bg-white text-[#0F172A] shadow-lg shadow-white/10"
                        : "bg-slate-800 text-slate-500 border border-slate-700"
                    } ring-4 ring-[#0F172A]`}>
                      <span className="font-bold text-sm">3</span>
                    </div>
                    <div className="flex flex-col pt-1">
                      <span className={`text-sm font-bold ${currentStep === 3 ? "text-white" : "text-slate-500"}`}>
                        System Analysis
                      </span>
                      <span className={`text-xs ${currentStep === 3 ? "text-[#3B82F6]" : "text-slate-600"}`}>
                        {currentStep === 3 ? "In Progress" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50">
                <h4 className="text-white font-bold mb-2">Why CVDebug?</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Our AI engine parses 50+ ATS data points to find invisible blockers in your resume before the recruiter does.
                </p>
              </div>
            </div>

            {/* Right Side: Step Cards */}
            <div className="lg:col-span-2 flex flex-col gap-10">
              <AnimatePresence mode="wait">
                {/* Step 1: Upload CV */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass-panel rounded-2xl overflow-hidden flex flex-col ring-1 ring-[#3B82F6]/50 shadow-2xl shadow-[#3B82F6]/10"
                  >
                    <div className="h-1 w-full bg-slate-800">
                      <div className="h-full bg-[#3B82F6] w-1/3 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    </div>
                    <div className="p-8 flex flex-col gap-8">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3B82F6]/20 text-[#3B82F6] text-xs font-bold">
                            1
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6]">
                            Current Step
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Upload your Master CV</h3>
                        <p className="text-slate-400 text-sm">
                          We'll use this as the baseline for all future optimizations.
                        </p>
                      </div>

                      {uploadedFile ? (
                        <div className="bg-slate-900/50 rounded-xl p-4 flex items-center gap-4 border border-slate-700/50">
                          <div className="size-10 rounded bg-red-500/10 flex items-center justify-center text-red-400">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{uploadedFile.name}</p>
                            <p className="text-slate-500 text-xs">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded just now
                            </p>
                          </div>
                          <button
                            onClick={() => setUploadedFile(null)}
                            className="text-slate-400 hover:text-white"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <label className="relative cursor-pointer group">
                          <input
                            type="file"
                            accept=".pdf,.docx,.doc"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <div className="border-2 border-dashed border-slate-700 rounded-xl p-12 text-center hover:border-[#3B82F6] transition-colors bg-slate-900/30 group-hover:bg-slate-900/50">
                            <Upload className="h-12 w-12 text-slate-500 mx-auto mb-4 group-hover:text-[#3B82F6] transition-colors" />
                            <p className="text-white font-medium mb-1">Drop your resume here</p>
                            <p className="text-slate-500 text-sm">or click to browse</p>
                            <p className="text-slate-600 text-xs mt-2">PDF, DOCX up to 10MB</p>
                          </div>
                        </label>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Target Definition */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass-panel rounded-2xl overflow-hidden flex flex-col ring-1 ring-[#3B82F6]/50 shadow-2xl shadow-[#3B82F6]/10"
                  >
                    <div className="h-1 w-full bg-slate-800">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-[#3B82F6] w-2/3 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    </div>
                    <div className="p-8 flex flex-col gap-8">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3B82F6]/20 text-[#3B82F6] text-xs font-bold">
                            2
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6]">
                            Current Step
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Tell us your dream job</h3>
                        <p className="text-slate-400 text-sm">
                          Paste the job description you want to target. Our engine will bridge the gap.
                        </p>
                      </div>

                      <div className="flex flex-col gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-300 ml-1">Target Company</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#3B82F6] transition-colors">
                              <Building2 className="h-5 w-5" />
                            </div>
                            <Input
                              value={targetCompany}
                              onChange={(e) => setTargetCompany(e.target.value)}
                              className="w-full bg-slate-900/50 border-slate-700 text-white pl-10 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
                              placeholder="e.g. Acme Corp, Google, Stripe"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-300 ml-1">Job Description</label>
                          <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none text-slate-500">
                              <FileText className="h-5 w-5" />
                            </div>
                            <Textarea
                              value={jobDescription}
                              onChange={(e) => setJobDescription(e.target.value)}
                              className="w-full bg-slate-900/50 border-slate-700 text-white pl-10 focus:ring-[#3B82F6] focus:border-[#3B82F6] resize-none font-mono leading-relaxed min-h-[150px]"
                              placeholder="Paste the full job description here..."
                              rows={6}
                            />
                            <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 bg-slate-800/80 px-2 py-1 rounded">
                              {jobDescription.length}/5000
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <Button
                          variant="ghost"
                          onClick={() => setCurrentStep(1)}
                          className="text-slate-400 hover:text-white"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back
                        </Button>
                        <Button
                          onClick={handleInitializeScan}
                          className="group relative px-8 py-2.5 bg-gradient-to-r from-indigo-500 to-[#3B82F6] hover:from-indigo-600 hover:to-[#3B82F6]/90 text-white font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
                        >
                          Initialize Scan
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Scanning */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel rounded-2xl overflow-hidden flex flex-col relative"
                  >
                    <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="p-8 flex flex-col gap-6 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="relative flex items-center justify-center size-12">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0"
                          >
                            <Radar className="h-12 w-12 text-cyan-500" />
                          </motion.div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Scanning your future...</h3>
                          <p className="text-cyan-400 text-sm font-mono animate-pulse">
                            &gt;&gt; Analysis in progress: 67%
                          </p>
                        </div>
                      </div>

                      {/* Terminal Log Window */}
                      <div className="bg-[#0c121e] rounded-lg border border-slate-800 p-4 font-mono text-xs h-40 overflow-hidden relative shadow-inner">
                        {/* Scan Line Animation */}
                        <motion.div
                          className="absolute w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee] left-0"
                          animate={{ top: ["0%", "100%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="flex flex-col gap-1 h-full overflow-y-auto text-slate-300">
                          {scanLogs.map((log, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.3 }}
                              className="flex gap-2"
                            >
                              <span className="text-slate-600">{log.time}</span>
                              <span className={
                                log.type === "success" ? "text-green-500" :
                                log.type === "warning" ? "text-yellow-400" :
                                log.type === "active" ? "text-cyan-400" :
                                "text-blue-400"
                              }>
                                {log.type === "success" ? "✓" : log.type === "warning" ? "⚠" : log.type === "active" ? ">" : "ℹ"}
                              </span>
                              <span className={log.type === "active" ? "text-white animate-pulse" : ""}>
                                {log.message}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
