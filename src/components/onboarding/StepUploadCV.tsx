import { useState } from "react";
import { FileText, Trash2, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { useResumeUpload } from "@/hooks/use-resume-upload";

interface StepUploadCVProps {
  onComplete: (resumeId: string) => void;
  jobDescription: string;
  setJobDescription: (val: string) => void;
}

export function StepUploadCV({ onComplete, jobDescription, setJobDescription }: StepUploadCVProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const {
    isUploading,
    isDragging,
    processingResumeId,
    fileInputRef,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop
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
                {isUploading ? "Processing..." : `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded`}
              </p>
            </div>
            {!isUploading && (
              <button
                onClick={() => {
                  setUploadedFile(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <Trash2 className="h-5 w-5" />
              </button>
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
            <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors bg-slate-900/30 ${
              isDragging ? "border-[#3B82F6] bg-slate-900/50" : "border-slate-700 hover:border-[#3B82F6] group-hover:bg-slate-900/50"
            }`}>
              <Upload className="h-12 w-12 text-slate-500 mx-auto mb-4 group-hover:text-[#3B82F6] transition-colors" />
              <p className="text-white font-medium mb-1">Drop your resume here</p>
              <p className="text-slate-500 text-sm">or click to browse</p>
              <p className="text-slate-600 text-xs mt-2">PDF, DOCX, or Image up to 10MB</p>
            </div>
          </label>
        )}
      </div>
    </motion.div>
  );
}