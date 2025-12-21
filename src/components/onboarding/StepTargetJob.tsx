import { Building2, FileText, ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface StepTargetJobProps {
  targetCompany: string;
  setTargetCompany: (value: string) => void;
  jobDescription: string;
  setJobDescription: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepTargetJob({
  targetCompany,
  setTargetCompany,
  jobDescription,
  setJobDescription,
  onBack,
  onNext
}: StepTargetJobProps) {
  return (
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
            onClick={onBack}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onNext}
            className="group relative px-8 py-2.5 bg-gradient-to-r from-indigo-500 to-[#3B82F6] hover:from-indigo-600 hover:to-[#3B82F6]/90 text-white font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
          >
            Initialize Scan
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
