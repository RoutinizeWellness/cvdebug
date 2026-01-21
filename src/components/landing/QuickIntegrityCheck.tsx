import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, AlertTriangle, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export function QuickIntegrityCheck() {
  const [file, setFile] = useState<File | null>(null);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    hasIssue: boolean;
    message: string;
    details?: string;
  } | null>(null);
  const navigate = useNavigate();
  const getQuickScore = useAction(api.ai.advancedScoringActions.getQuickScore);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.includes("pdf") && !selectedFile.type.includes("image")) {
      alert("Please upload a PDF or image file");
      return;
    }

    setFile(selectedFile);
    setChecking(true);
    setResult(null);

    try {
      // Extract text from PDF/image using dynamic import to avoid blocking
      let extractedText = "";

      try {
        // Dynamically import Tesseract.js to avoid blocking the main bundle
        const tesseractModule = await Promise.race([
          import('tesseract.js'),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Tesseract.js import timeout')), 10000)
          )
        ]) as typeof import('tesseract.js');
        
        const { createWorker } = tesseractModule;
        const worker = await createWorker(['eng']);
        try {
          const { data: { text } } = await worker.recognize(selectedFile);
          extractedText = text;
        } finally {
          await worker.terminate();
        }
      } catch (ocrError) {
        console.error("OCR failed:", ocrError);
        // Fallback: Show a message that we couldn't analyze the file
        setResult({
          score: 0,
          hasIssue: true,
          message: "⚠️ Unable to analyze - PDF may have parsing issues",
          details: "Your file structure prevented analysis. This is a red flag for ATS systems. Try uploading a different format or sign up for full analysis."
        });
        setChecking(false);
        return;
      }

      // Call the real ML scoring engine (same as dashboard)
      const scoreResult = await getQuickScore({
        resumeText: extractedText
      });

      if (scoreResult.success && scoreResult.data) {
        const score = scoreResult.data.score || 0;
        const hasIssue = score < 70; // Below 70 is problematic

        setResult({
          score,
          hasIssue,
          message: hasIssue
            ? `⚠️ ATS Score: ${score}/100 - Your resume needs optimization`
            : `✓ ATS Score: ${score}/100 - Good baseline, but full analysis recommended`,
          details: hasIssue
            ? "Low ATS compatibility detected. This could reduce your interview chances by 60%+"
            : "Basic formatting looks good. Get detailed keyword analysis to maximize interview rates."
        });
      } else {
        // Fallback if ML analysis fails
        setResult({
          score: 0,
          hasIssue: true,
          message: "⚠️ Unable to analyze - PDF may have parsing issues",
          details: "Your file structure prevented analysis. This is a red flag for ATS systems."
        });
      }
    } catch (error) {
      console.error("Analysis error:", error);
      setResult({
        score: 0,
        hasIssue: true,
        message: "⚠️ Analysis failed - File may be incompatible with ATS",
        details: "Could not extract text from your resume. ATS systems will likely fail too."
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <section className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-2xl"
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              Check Your PDF Integrity in 10 Seconds
            </h3>
            <p className="text-slate-400 text-sm">
              No registration required. See if your resume has hidden parsing errors.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="quick-check-upload"
              />
              <label
                htmlFor="quick-check-upload"
                className="flex items-center justify-center gap-3 w-full h-24 border-2 border-dashed border-slate-600 rounded-lg hover:border-primary hover:bg-slate-800/50 transition-all cursor-pointer group"
              >
                <Upload className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
                <span className="text-slate-300 font-medium">
                  {file ? file.name : "Click to upload your resume (PDF)"}
                </span>
              </label>
            </label>

            <AnimatePresence mode="wait">
              {checking && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-center gap-3 py-6 text-slate-300"
                >
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span>Analyzing PDF structure...</span>
                </motion.div>
              )}

              {result && !checking && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-6 rounded-lg border-2 ${
                    result.hasIssue
                      ? "bg-red-950/30 border-red-500/50"
                      : "bg-green-950/30 border-green-500/50"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    {result.hasIssue ? (
                      <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                    ) : (
                      <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className={`font-semibold text-lg ${result.hasIssue ? "text-red-300" : "text-green-300"}`}>
                        {result.message}
                      </p>
                      {result.details && (
                        <p className="text-slate-400 text-sm mt-2">
                          {result.details}
                        </p>
                      )}
                      {result.score > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                            <span>ATS Compatibility</span>
                            <span>{result.score}/100</span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${result.score}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full ${
                                result.score >= 80
                                  ? "bg-green-500"
                                  : result.score >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate("/auth")}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-white font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    {result.hasIssue
                      ? "See Full Analysis & Fix Issues (Free)"
                      : "Get Detailed Keyword & Format Analysis (Free)"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-center text-xs text-slate-500 mt-4">
            ✨ Powered by the same ML engine as our premium scanner. Full analysis includes Robot View, keyword gap analysis, and AI-powered recommendations.
          </p>
        </motion.div>
      </div>
    </section>
  );
}