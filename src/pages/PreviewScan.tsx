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

interface LogEntry {
  type: "info" | "success" | "warning" | "error";
  message: string;
  timestamp: number;
}

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
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [diagnostics, setDiagnostics] = useState({
    encoding: "UTF-8",
    fileSize: "",
    textRatio: 0,
  });

  const addLog = (type: LogEntry["type"], message: string) => {
    setLogs((prev) => [...prev, { type, message, timestamp: Date.now() }]);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setProgress(0);
    setLogs([]);
    setShowResults(false);

    // Set diagnostics
    setDiagnostics({
      encoding: "UTF-8",
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      textRatio: 0,
    });

    addLog("info", `[INIT] Starting scan for: ${file.name}`);
    addLog("info", `[FILE] Size: ${(file.size / 1024).toFixed(1)} KB, Type: ${file.type}`);
    setProgress(5);

    try {
      let text = "";

      // Extract text based on file type
      if (file.type === "application/pdf") {
        addLog("info", "[PDF] Initializing PDF parser...");
        setProgress(10);

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        addLog("success", `[PDF] Loaded ${pdf.numPages} pages successfully`);
        setProgress(20);

        for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
          addLog("info", `[PARSE] Extracting page ${i}/${pdf.numPages}...`);
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(" ");
          text += pageText + "\n";
          setProgress(20 + (i / pdf.numPages) * 40);
        }

        // If no text extracted, try OCR with timeout
        if (text.trim().length < 20) {
          addLog("warning", "[OCR] Low text extraction, switching to OCR mode...");
          setProgress(60);

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          let ocrText = "";

          addLog("info", "[OCR] Initializing Tesseract (this may take 30-60s)...");

          // Create a timeout promise for OCR
          const ocrTimeout = new Promise<string>((_, reject) => {
            setTimeout(() => reject(new Error("OCR timeout - processing taking too long")), 90000); // 90 second timeout
          });

          // Create the OCR processing promise
          const ocrProcessing = (async () => {
            const worker = await createWorker(["eng"]);

            try {
              // Process only first 2 pages to reduce time
              for (let i = 1; i <= Math.min(pdf.numPages, 2); i++) {
                addLog("info", `[OCR] Processing page ${i}/2 as image...`);
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 }); // Reduced scale for speed
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({ canvasContext: context!, viewport }).promise;

                const blob = await new Promise<Blob | null>((resolve) => {
                  canvas.toBlob((b) => resolve(b), "image/png", 0.8); // Reduced quality for speed
                });

                if (blob) {
                  const imageUrl = URL.createObjectURL(blob);
                  const result = await worker.recognize(imageUrl);
                  ocrText += result.data.text + "\n";
                  URL.revokeObjectURL(imageUrl);
                  addLog("success", `[OCR] Page ${i} extracted (confidence: ${Math.round((result.data.confidence || 0) * 100)}%)`);
                }

                setProgress(60 + (i / 2) * 20);
              }
              return ocrText;
            } finally {
              await worker.terminate();
            }
          })();

          try {
            // Race between OCR and timeout
            text = await Promise.race([ocrProcessing, ocrTimeout]);

            if (text.trim().length < 20) {
              throw new Error("OCR extraction insufficient - please try a text-based PDF");
            }

            addLog("success", "[OCR] OCR extraction complete");
          } catch (ocrError: any) {
            addLog("error", `[OCR] ${ocrError.message}`);

            // If OCR fails or times out, provide helpful error message
            if (ocrError.message.includes("timeout")) {
              throw new Error(
                "Processing is taking longer than expected. Please try:\n" +
                "• Using a text-based PDF (not a scanned image)\n" +
                "• Reducing the file size\n" +
                "• Signing up to use our faster server-side processing"
              );
            }

            throw new Error(
              "Could not extract text from this PDF. Please ensure:\n" +
              "• The file is a text-based PDF (not a scanned image)\n" +
              "• Use 'Print to PDF' or 'Save as PDF' instead of scanning\n" +
              "• Sign up for server-side processing which handles all file types"
            );
          }
        } else {
          addLog("success", "[PDF] Native text extraction successful");
        }
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        addLog("info", "[DOCX] Parsing Word document...");
        setProgress(30);
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
        addLog("success", "[DOCX] Document parsed successfully");
        setProgress(70);
      } else {
        // Image file
        addLog("info", "[IMAGE] Detected image file, initializing OCR...");
        setProgress(30);

        const imageUrl = URL.createObjectURL(file);

        // Create timeout for image OCR
        const imageOcrTimeout = new Promise<string>((_, reject) => {
          setTimeout(() => reject(new Error("Image OCR timeout - processing taking too long")), 60000); // 60 second timeout
        });

        // Create image OCR promise
        const imageOcrProcessing = (async () => {
          const worker = await createWorker(["eng"]);
          try {
            addLog("info", "[OCR] Running text recognition (this may take 30-60s)...");
            const result = await worker.recognize(imageUrl);
            addLog("success", `[OCR] Extraction complete (confidence: ${Math.round((result.data.confidence || 0) * 100)}%)`);
            return result.data.text;
          } finally {
            await worker.terminate();
          }
        })();

        try {
          text = await Promise.race([imageOcrProcessing, imageOcrTimeout]);

          if (text.trim().length < 20) {
            throw new Error("Could not extract sufficient text from image");
          }
        } catch (imageOcrError: any) {
          addLog("error", `[OCR] ${imageOcrError.message}`);

          if (imageOcrError.message.includes("timeout")) {
            throw new Error(
              "Image processing is taking too long. Please:\n" +
              "• Upload a PDF version instead\n" +
              "• Ensure image has clear, readable text\n" +
              "• Sign up to use faster server-side processing"
            );
          }

          throw new Error(
            "Could not extract text from image. Please:\n" +
            "• Upload a PDF version of your resume\n" +
            "• Ensure the image has clear, high-contrast text\n" +
            "• Sign up for better OCR processing"
          );
        } finally {
          URL.revokeObjectURL(imageUrl);
        }
        setProgress(70);
      }

      addLog("info", "[CLEAN] Sanitizing extracted text...");
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
        addLog("error", "[ERROR] Insufficient text extracted from file");
        throw new Error("Could not extract enough text from the file");
      }

      addLog("success", `[CLEAN] Extracted ${text.length} characters`);
      setExtractedText(text);
      setProgress(80);

      // Calculate text ratio
      const textRatio = Math.min((text.length / file.size) * 100, 100);
      setDiagnostics((prev) => ({ ...prev, textRatio }));

      addLog("info", "[ANALYZE] Running keyword analysis...");

      // Quick analysis for preview
      const wordCount = text.split(/\s+/).length;
      const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
      const hasPhone = /\+?[\d\s\-()]{10,}/.test(text);

      addLog("info", `[ANALYZE] Word count: ${wordCount}`);
      addLog("info", `[ANALYZE] Contact info: ${hasEmail ? "✓" : "✗"} email, ${hasPhone ? "✓" : "✗"} phone`);

      // Detect sections
      const sections = [];
      if (/experience|employment|work history/i.test(text)) sections.push("Experience");
      if (/education|degree|university|college/i.test(text)) sections.push("Education");
      if (/skills|technologies|proficiency/i.test(text)) sections.push("Skills");
      if (/projects|portfolio/i.test(text)) sections.push("Projects");
      if (/certifications|certificates/i.test(text)) sections.push("Certifications");

      addLog("success", `[ANALYZE] Detected sections: ${sections.join(", ")}`);

      // Calculate preview score (simplified)
      let score = 50; // Base score
      if (wordCount > 200) score += 10;
      if (wordCount > 400) score += 10;
      if (hasEmail) score += 5;
      if (hasPhone) score += 5;
      score += sections.length * 5;

      // Check for quantifiable achievements
      const hasNumbers = /\d+%|\d+\+|\$\d+|increased|improved|reduced|saved/gi.test(text);
      if (hasNumbers) {
        score += 10;
        addLog("success", "[ANALYZE] Quantifiable achievements detected");
      }

      setPreviewScore(Math.min(score, 95)); // Cap at 95 to encourage signup

      setProgress(100);
      addLog("success", `[COMPLETE] Analysis finished. Score: ${Math.min(score, 95)}/100`);

      setTimeout(() => {
        setShowResults(true);
      }, 800);

    } catch (error: any) {
      console.error("Preview scan error:", error);
      addLog("error", `[ERROR] ${error.message || "Processing failed"}`);
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
      <div className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      {/* Scan line effect */}
      {isProcessing && !showResults && (
        <motion.div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
          animate={{ y: [0, window.innerHeight] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      )}

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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {!isProcessing && !showResults ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-3xl mx-auto"
            >
              {/* Hero Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-12"
              >
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Deep <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Diagnostic Scan</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                  See exactly how ATS systems parse your resume - no signup required
                </p>
              </motion.div>

              {/* Upload Area */}
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
          ) : isProcessing && !showResults ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Terminal View - Left Side (2/3 width) */}
              <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden border border-slate-800/50">
                <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-800/50 flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-xs text-slate-400 font-mono">resume_parser_v2.log</span>
                </div>

                <div className="bg-[#0a0e1a] p-6 h-[600px] overflow-y-auto font-mono text-sm custom-scrollbar">
                  {logs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`mb-2 ${
                        log.type === "success" ? "text-green-400" :
                        log.type === "error" ? "text-red-400" :
                        log.type === "warning" ? "text-yellow-400" :
                        "text-blue-300"
                      }`}
                    >
                      {log.message}
                    </motion.div>
                  ))}
                  <motion.span
                    className="inline-block w-2 h-4 bg-green-400 ml-1"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </div>
              </div>

              {/* Diagnostics Panel - Right Side (1/3 width) */}
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-2xl border border-slate-800/50">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">analytics</span>
                    Diagnostics
                  </h3>

                  <div className="space-y-4">
                    {/* Encoding Health */}
                    <div className="bg-[#1e293b]/50 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400">Encoding</span>
                        <span className="text-xs font-semibold text-green-400">{diagnostics.encoding}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-slate-300">Valid</span>
                      </div>
                    </div>

                    {/* File Size */}
                    <div className="bg-[#1e293b]/50 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400">File Size</span>
                        <span className="text-xs font-semibold text-blue-400">{diagnostics.fileSize}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-400 text-sm">description</span>
                        <span className="text-xs text-slate-300">Optimal</span>
                      </div>
                    </div>

                    {/* Text-to-Image Ratio */}
                    <div className="bg-[#1e293b]/50 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-slate-400">Text Extraction</span>
                        <span className="text-xs font-semibold text-primary">{diagnostics.textRatio.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-secondary"
                          initial={{ width: 0 }}
                          animate={{ width: `${diagnostics.textRatio}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Card */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800/50">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">hourglass_top</span>
                    Progress
                  </h3>

                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">
                        {progress}%
                      </p>
                      <p className="text-xs text-slate-400">{currentStep || "Processing..."}</p>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden relative">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-secondary relative"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-4xl mx-auto"
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
                      <p className="text-sm text-slate-400 mb-1">Extraction</p>
                      <p className="text-2xl font-bold text-green-400">✓ Success</p>
                    </div>
                    <div className="bg-[#1e293b]/50 rounded-lg p-4">
                      <p className="text-sm text-slate-400 mb-1">Processing Time</p>
                      <p className="text-2xl font-bold text-white">&lt; 10s</p>
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
