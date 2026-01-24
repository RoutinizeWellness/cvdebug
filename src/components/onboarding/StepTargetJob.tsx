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
      className="bg-white rounded-2xl overflow-hidden flex flex-col ring-1 ring-[#64748B]/50 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-[#E2E8F0]"
    >
      <div className="h-1 w-full bg-[#E2E8F0]">
        <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#64748B] w-2/3 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
      </div>
      <div className="p-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#64748B]/20 text-[#64748B] text-xs font-bold">
              2
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Current Step
            </span>
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A]">Tell us your dream job</h3>
          <p className="text-[#64748B] text-sm">
            Paste the job description you want to target. Our engine will bridge the gap.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#475569] ml-1">Target Company</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#64748B] transition-colors">
                <Building2 className="h-5 w-5" />
              </div>
              <Input
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className="w-full bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] pl-10 focus:ring-[#64748B] focus:border-[#64748B]"
                placeholder="e.g. Acme Corp, Google, Stripe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#475569] ml-1">Job Description</label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none text-[#64748B]">
                <FileText className="h-5 w-5" />
              </div>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] pl-10 focus:ring-[#64748B] focus:border-[#64748B] resize-none font-mono leading-relaxed min-h-[150px]"
                placeholder="Paste the full job description here..."
                rows={6}
              />
              <div className="absolute bottom-3 right-3 text-[10px] text-[#64748B] bg-white/80 px-2 py-1 rounded border border-[#E2E8F0]">
                {jobDescription.length}/5000
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onNext}
            className="group relative px-8 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#64748B] hover:from-[#8B5CF6]/90 hover:to-[#64748B]/90 text-white font-bold shadow-lg shadow-[#8B5CF6]/25 hover:shadow-[#8B5CF6]/40 transition-all"
          >
            Initialize Scan
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
