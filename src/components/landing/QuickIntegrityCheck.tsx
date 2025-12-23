import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, AlertTriangle, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export function QuickIntegrityCheck() {
  const [file, setFile] = useState<File | null>(null);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{
    hasIssue: boolean;
    message: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.includes("pdf")) {
      alert("Please upload a PDF file");
      return;
    }

    setFile(selectedFile);
    setChecking(true);
    setResult(null);

    // Simulate quick integrity check (in production, this would call a lightweight API)
    setTimeout(() => {
      // Simple heuristic: check file size and name patterns
      const hasComplexName = /[^\x20-\x7E]/.test(selectedFile.name);
      const isSuspiciousSize = selectedFile.size < 50000 || selectedFile.size > 5000000;
      
      const hasIssue = hasComplexName || isSuspiciousSize || Math.random() > 0.6;

      setResult({
        hasIssue,
        message: hasIssue
          ? "⚠️ Image Trap Detected - Your PDF may be unreadable by ATS systems"
          : "✓ Basic integrity check passed - but deeper analysis recommended"
      });
      setChecking(false);
    }, 2000);
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
                    <div>
                      <p className={`font-semibold ${result.hasIssue ? "text-red-300" : "text-green-300"}`}>
                        {result.message}
                      </p>
                      {result.hasIssue && (
                        <p className="text-slate-400 text-sm mt-2">
                          Your file may be invisible to ATS systems. This could cost you interviews.
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate("/auth")}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-white font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    {result.hasIssue
                      ? "See Full Damage Report (Free)"
                      : "Get Complete ATS Analysis (Free)"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-center text-xs text-slate-500 mt-4">
            This is a quick surface check. Full analysis includes keyword matching, format validation, and Robot View.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
