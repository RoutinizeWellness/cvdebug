import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CloudUpload, FileUp } from "lucide-react";
import { useState, useRef } from "react";
import { useI18n } from "@/contexts/I18nContext";

interface CVUploadProps {
  isActive: boolean;
  uploadedFile: File | null;
  onFileUpload: (file: File) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function CVUpload({
  isActive,
  uploadedFile,
  onFileUpload,
  onBack,
  onNext,
}: CVUploadProps) {
  const { t } = useI18n();
  const [isDragging, setIsDragging] = useState(false);
  const [logs, setLogs] = useState([
    { text: t.onboarding.cvUpload.log1, type: "info" },
    { text: t.onboarding.cvUpload.log2, type: "default" },
    { text: t.onboarding.cvUpload.log3, type: "secondary" },
    { text: t.onboarding.cvUpload.log4, type: "pulse" },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.type.includes("word"))) {
      onFileUpload(file);
      updateLogs(file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      updateLogs(file.name);
    }
  };

  const updateLogs = (fileName: string) => {
    setLogs([
      { text: t.onboarding.cvUpload.log1, type: "info" },
      { text: t.onboarding.cvUpload.log2, type: "default" },
      { text: t.onboarding.cvUpload.log3, type: "secondary" },
      { text: `${t.onboarding.cvUpload.log5}${fileName}`, type: "success" },
      { text: t.onboarding.cvUpload.log6, type: "pulse" },
    ]);
  };

  if (!isActive) return null;

  return (
    <motion.div
      className="bg-white rounded-xl p-8 md:p-12 relative overflow-hidden border-t-2 border-t-[#1E293B] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-[#E2E8F0]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background Icon */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <FileUp className="h-36 w-36 text-[#1E293B]" />
      </div>

      <div className="relative z-10 flex flex-col gap-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {t.onboarding.cvUpload.heading}
          </motion.h1>
          <motion.p
            className="text-[#64748B]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t.onboarding.cvUpload.description}
          </motion.p>
        </div>

        {/* Drag & Drop Zone */}
        <div className="w-full max-w-2xl mx-auto">
          <label
            className={`group relative flex flex-col items-center justify-center w-full h-64 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
              isDragging
                ? "border-[#1E293B] bg-[#F3E8FF]"
                : uploadedFile
                ? "border-[#64748B] bg-[#EFF6FF]"
                : "border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#F3E8FF] hover:border-[#1E293B]"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Hover Gradient Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-[#1E293B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              animate={
                uploadedFile
                  ? {}
                  : {
                      scale: [1, 1.05, 1],
                    }
              }
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
              <motion.div
                className={`mb-4 p-4 rounded-full transition-colors ${
                  uploadedFile
                    ? "bg-[#64748B]/20"
                    : "bg-[#F3E8FF] group-hover:bg-[#1E293B]/20"
                }`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <CloudUpload
                  className={`h-10 w-10 transition-colors ${
                    uploadedFile
                      ? "text-[#64748B]"
                      : "text-[#64748B] group-hover:text-[#1E293B]"
                  }`}
                />
              </motion.div>

              {uploadedFile ? (
                <div className="text-center">
                  <p className="mb-2 text-sm text-[#0F172A] font-semibold">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-[#64748B]">
                    {(uploadedFile.size / 1024).toFixed(2)} KB • {t.onboarding.cvUpload.clickToUpload.toLowerCase()}
                  </p>
                </div>
              ) : (
                <>
                  <p className="mb-2 text-sm text-[#475569]">
                    <span className="font-semibold text-[#1E293B]">{t.onboarding.cvUpload.clickToUpload}</span>{" "}
                    {t.onboarding.cvUpload.dragDrop}
                  </p>
                  <p className="text-xs text-[#64748B]">{t.onboarding.cvUpload.maxSize}</p>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              className="hidden"
              id="dropzone-file"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Terminal Log */}
        <div className="w-full max-w-2xl mx-auto bg-[#0d1117] rounded-lg border border-[#1e293b] p-4 font-mono text-xs md:text-sm shadow-inner relative overflow-hidden">
          {/* Accent line */}
          <div className="absolute top-0 left-0 w-1 h-full bg-[#1E293B] opacity-50" />

          {/* Terminal Header */}
          <div className="flex items-center gap-2 mb-3 border-b border-[#1e293b] pb-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            </div>
            <span className="text-slate-500 text-[10px] uppercase tracking-widest ml-2">
              {t.onboarding.cvUpload.systemLogs}
            </span>
          </div>

          {/* Logs */}
          <div className="space-y-1 text-slate-300">
            {logs.map((log, index) => (
              <motion.p
                key={index}
                className={`before:content-['>_'] before:text-[#1E293B] ${
                  log.type === "info"
                    ? "text-slate-500"
                    : log.type === "secondary"
                    ? "text-[#1E293B]"
                    : log.type === "success"
                    ? "text-[#22C55E]"
                    : log.type === "pulse"
                    ? "animate-pulse"
                    : ""
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {log.text}
              </motion.p>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-all font-medium flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.onboarding.cvUpload.backButton}
          </button>

          <button
            onClick={(e) => {
              console.log('[CVUpload] Scan button clicked', { uploadedFile, disabled: !uploadedFile });
              e.preventDefault();
              e.stopPropagation();
              if (uploadedFile) {
                onNext();
              }
            }}
            disabled={!uploadedFile}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#1E293B] to-[#334155] text-white font-bold shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {t.onboarding.cvUpload.scanButton}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
