import { useState } from "react";
import { FileText, Trash2, Upload, X } from "lucide-react";
import { motion } from "framer-motion";
import { useResumeUpload } from "@/hooks/use-resume-upload";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";

interface StepUploadCVProps {
  onComplete: (resumeId: string) => void;
  jobDescription: string;
  setJobDescription: (val: string) => void;
}

export function StepUploadCV({ onComplete, jobDescription, setJobDescription }: StepUploadCVProps) {
  const { t } = useI18n();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const {
    isUploading,
    isDragging,
    processingResumeId,
    fileInputRef,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    cancelUpload,
    processingStatus
  } = useResumeUpload(jobDescription, setJobDescription);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      await handleFileUpload(e);
    }
  };

  // When processing completes, notify parent
  if (processingResumeId && !isUploading) {
    onComplete(processingResumeId);
  }

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl overflow-hidden flex flex-col ring-1 ring-[#64748B]/50 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-[#E2E8F0]"
    >
      <div className="h-1 w-full bg-[#E2E8F0]">
        <div className="h-full bg-[#64748B] w-1/3 shadow-[0_0_10px_rgba(100,116,139,0.5)]"></div>
      </div>
      <div className="p-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#64748B]/20 text-[#64748B] text-xs font-bold">
              1
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Current Step
            </span>
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A]">{t.dashboard.uploadMasterCv}</h3>
          <p className="text-[#64748B] text-sm">
            We'll use this as the baseline for all future optimizations.
          </p>
        </div>

        {uploadedFile ? (
          <div className="bg-[#F8FAFC] rounded-xl p-4 flex items-center gap-4 border border-[#E2E8F0]">
            <div className="size-10 rounded bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444]">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#0F172A] text-sm font-medium truncate">{uploadedFile.name}</p>
              <div className="flex items-center gap-2">
                {isUploading && <div className="h-2 w-2 rounded-full bg-[#64748B] animate-pulse" />}
                <p className="text-[#64748B] text-xs">
                  {isUploading ? (processingStatus || "Processing...") : `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded`}
                </p>
              </div>
            </div>
            {!isUploading ? (
              <button
                onClick={() => {
                  setUploadedFile(null);
                }}
                className="text-[#64748B] hover:text-[#0F172A]"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  cancelUpload();
                  setUploadedFile(null);
                }}
                className="text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        ) : (
          <label
            className="relative cursor-pointer group"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
            <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors bg-[#F8FAFC] ${
              isDragging ? "border-[#64748B] bg-[#EFF6FF]" : "border-[#E2E8F0] hover:border-[#64748B] group-hover:bg-[#EFF6FF]"
            }`}>
              <Upload className="h-12 w-12 text-[#64748B] mx-auto mb-4 group-hover:text-[#64748B] transition-colors" />
              <p className="text-[#0F172A] font-medium mb-1">Drop your resume here</p>
              <p className="text-[#64748B] text-sm">or click to browse</p>
              <p className="text-[#94A3B8] text-xs mt-2">PDF, DOCX, or Image up to 10MB</p>
            </div>
          </label>
        )}
      </div>
    </motion.div>
  );
}
