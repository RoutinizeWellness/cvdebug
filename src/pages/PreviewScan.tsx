import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Eye, Sparkles, ArrowRight, Lock, Zap, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Logo } from "@/components/Logo";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import { createWorker } from "tesseract.js";

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PreviewScan() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [extractedText, setExtractedText] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [previewScore, setPreviewScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [previewStats, setPreviewStats] = useState({
    wordCount: 0,
    hasEmail: false,
    hasPhone: false,
    sections: [] as string[],
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setProgress(10);
    setCurrentStep("Reading file...");

    try {
      let text = "";

      // Extract text based on file type
      if (file.type === "application/pdf") {
        setCurrentStep("Parsing PDF...");
        setProgress(20);

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        setProgress(40);
        setCurrentStep(`Extracting text from ${pdf.numPages} pages...`);

        for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(" ");
          text += pageText + "\n";
          setProgress(40 + (i / pdf.numPages) * 30);
        }

        // If no text extracted, try OCR
        if (text.trim().length < 20) {
          setCurrentStep("Running OCR (image-based PDF detected)...");
          setProgress(60);

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          let ocrText = "";

          const worker = await createWorker(["eng", "spa", "fra"]);

          try {
            for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) {
              const page = await pdf.getPage(i);
              const viewport = page.getViewport({ scale: 2.0 });
              canvas.width = viewport.width;
              canvas.height = viewport.height;

              await page.render({ canvasContext: context!, viewport }).promise;

              const blob = await new Promise<Blob | null>((resolve) => {
                canvas.toBlob((b) => resolve(b), "image/png");
              });

              if (blob) {
                const imageUrl = URL.createObjectURL(blob);
                const result = await worker.recognize(imageUrl);
                ocrText += result.data.text + "\n";
                URL.revokeObjectURL(imageUrl);
              }

              setProgress(60 + (i / 3) * 20);
            }
          } finally {
            await worker.terminate();
          }

          text = ocrText;
        }
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setCurrentStep("Reading Word document...");
        setProgress(40);
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
        setProgress(70);
      } else {
        // Image file
        setCurrentStep("Running OCR on image...");
        setProgress(40);
        const worker = await createWorker(["eng", "spa", "fra"]);
        const imageUrl = URL.createObjectURL(file);
        try {
          const result = await worker.recognize(imageUrl);
          text = result.data.text;
        } finally {
          URL.revokeObjectURL(imageUrl);
          await worker.terminate();
        }
        setProgress(70);
      }

      // Clean text
      text = text
        .replace(/\0/g, "")
        .replace(/[\uFFFD\uFFFE\uFFFF]/g, "")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
        .replace(/ {2,}/g, " ")
        .split("\n")
        .map((line) => line.trim())
        .join("\n")
        .trim();

      if (text.length < 50) {
        throw new Error("Could not extract enough text from the file");
      }

      setExtractedText(text);
      setProgress(80);
      setCurrentStep("Analyzing content...");

      // Quick analysis for preview
      const wordCount = text.split(/\s+/).length;
      const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
      const hasPhone = /\+?[\d\s\-()]{10,}/.test(text);

      // Detect sections
      const sections = [];
      if (/experience|employment|work history/i.test(text)) sections.push("Experience");
      if (/education|degree|university|college/i.test(text)) sections.push("Education");
      if (/skills|technologies|proficiency/i.test(text)) sections.push("Skills");
      if (/projects|portfolio/i.test(text)) sections.push("Projects");
      if (/certifications|certificates/i.test(text)) sections.push("Certifications");

      // Calculate preview score (simplified)
      let score = 50; // Base score
      if (wordCount > 200) score += 10;
      if (wordCount > 400) score += 10;
      if (hasEmail) score += 5;
      if (hasPhone) score += 5;
      score += sections.length * 5;

      // Check for quantifiable achievements
      const hasNumbers = /\d+%|\d+\+|\$\d+|increased|improved|reduced|saved/gi.test(text);
      if (hasNumbers) score += 10;

      setPreviewScore(Math.min(score, 95)); // Cap at 95 to encourage signup
      setPreviewStats({ wordCount, hasEmail, hasPhone, sections });

      setProgress(100);
      setCurrentStep("Analysis complete!");

      setTimeout(() => {
        setShowResults(true);
      }, 500);

    } catch (error: any) {
      console.error("Preview scan error:", error);
      toast.error("Failed to process file", {
        description: error.message || "Please try again with a different file format",
      });
      setIsProcessing(false);
    }
  };

  const handleSignUp = () => {
    // Store preview data in sessionStorage for post-signup experience
    sessionStorage.setItem("previewData", JSON.stringify({
      text: extractedText,
      fileName,
      timestamp: Date.now(),
    }));
    navigate("/auth?from=preview");
  };

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <Button
            variant="ghost"
            onClick={() => navigate("/auth")}
            className="text-slate-300 hover:text-white"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              {/* Hero Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-12"
              >
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                  See What <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">ATS Robots</span> Actually See
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                  Upload your resume and get instant Robot View - no signup required
                </p>
              </motion.div>

              {/* Upload Area */}
              {!isProcessing ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="glass-panel p-12 rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary/60 cursor-pointer transition-all group"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Drop your resume here</h3>
                    <p className="text-slate-400 mb-6">or click to browse files</p>
                    <p className="text-sm text-slate-500">Supports PDF, Word, and Images • No account needed</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-panel p-8 rounded-2xl"
                >
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-8 w-8 text-primary" />
                      </motion.div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{currentStep}</h3>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden mb-4">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-sm text-slate-400">{progress}% complete</p>
                </motion.div>
              )}

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-400"
              >
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Instant Results</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>No Credit Card</span>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Score Card - Partially Revealed */}
              <div className="glass-panel p-8 rounded-2xl text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-4">Your Resume Score</h2>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4"
                  >
                    {previewScore}
                  </motion.div>
                  <p className="text-slate-400 mb-6">Out of 100</p>

                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="bg-[#1e293b]/50 rounded-lg p-4">
                      <p className="text-sm text-slate-400 mb-1">Word Count</p>
                      <p className="text-2xl font-bold text-white">{previewStats.wordCount}</p>
                    </div>
                    <div className="bg-[#1e293b]/50 rounded-lg p-4">
                      <p className="text-sm text-slate-400 mb-1">Sections Found</p>
                      <p className="text-2xl font-bold text-white">{previewStats.sections.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Robot View Preview */}
              <div className="glass-panel p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Robot View Preview</h3>
                    <p className="text-sm text-slate-400">This is what ATS systems actually see</p>
                  </div>
                </div>

                <div className="bg-[#0F172A] rounded-lg p-6 border border-slate-800 font-mono text-sm relative">
                  <div className="text-green-400 whitespace-pre-wrap max-h-60 overflow-hidden">
                    {extractedText.substring(0, 500)}
                    {extractedText.length > 500 && "..."}
                  </div>

                  {/* Blur overlay for bottom half */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0F172A] pointer-events-none" />

                  {/* Locked overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0F172A]/80 backdrop-blur-sm">
                    <div className="text-center">
                      <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
                      <p className="text-white font-bold text-lg mb-2">Create free account to see full Robot View</p>
                      <p className="text-slate-400 text-sm">Plus detailed keyword analysis and actionable fixes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What You're Missing */}
              <div className="glass-panel p-6 rounded-2xl border-2 border-primary/30">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Create Free Account to Unlock:</h3>
                    <p className="text-slate-400">Get the full power of CVDebug with instant signup</p>
                  </div>
                </div>

                <div className="grid gap-3 mb-6">
                  {[
                    { icon: Eye, text: "Complete Robot View with formatting analysis", locked: false },
                    { icon: TrendingUp, text: "Detailed keyword match analysis with priority ranking", locked: true },
                    { icon: AlertTriangle, text: "Critical ATS parsing errors and how to fix them", locked: true },
                    { icon: Sparkles, text: "AI-powered rewrite suggestions using Google XYZ formula", locked: true },
                    { icon: FileText, text: "Download optimized version + track improvements over time", locked: true },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        item.locked ? "bg-primary/5 border border-primary/20" : "bg-green-500/5 border border-green-500/20"
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${item.locked ? "text-primary" : "text-green-400"}`} />
                      <span className="text-white text-sm flex-1">{item.text}</span>
                      {item.locked && <Lock className="h-4 w-4 text-primary" />}
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={handleSignUp}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold text-lg py-6"
                >
                  Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <p className="text-center text-xs text-slate-500 mt-4">
                  No credit card required • Takes 30 seconds • Your data stays private
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
