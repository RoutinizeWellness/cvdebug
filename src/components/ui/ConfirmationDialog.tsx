import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Trash2 } from "lucide-react";
import { useState } from "react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  itemName?: string;
  requiresTyping?: boolean;
  confirmationWord?: string;
  isDangerous?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  itemName,
  requiresTyping = false,
  confirmationWord = "DELETE",
  isDangerous = false,
}: ConfirmationDialogProps) {
  const [typedText, setTypedText] = useState("");
  const isConfirmEnabled = !requiresTyping || typedText === confirmationWord;

  const handleConfirm = () => {
    if (isConfirmEnabled) {
      onConfirm();
      setTypedText("");
    }
  };

  const handleClose = () => {
    setTypedText("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modal Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-[6px]"
            onClick={handleClose}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#FFFFFF] w-full max-w-lg rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden relative border border-[#E2E8F0]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative top line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-80"></div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-[#64748B] hover:text-[#0F172A] transition-colors p-1 rounded-md hover:bg-[#F8FAFC]"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Header */}
              <div className="p-6 pb-0 flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-4 text-red-500">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">{title}</h2>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <p className="text-[#475569] text-base leading-relaxed">
                  {description}
                  {itemName && (
                    <>
                      {" "}
                      <span className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] px-1.5 py-0.5 rounded text-sm font-mono mx-0.5">
                        {itemName}
                      </span>
                      ?
                    </>
                  )}
                </p>
                <p className="text-[#64748B] text-sm mt-3 leading-relaxed">
                  This action cannot be undone. All logs, analytics data, and associated
                  debugging sessions will be permanently removed from our servers.
                </p>

                {/* Confirmation Input */}
                {requiresTyping && (
                  <div className="mt-6">
                    <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
                      Type{" "}
                      <span className="text-[#0F172A] select-all">{confirmationWord}</span> to
                      confirm
                    </label>
                    <input
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[#0F172A] placeholder-[#64748B] focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all outline-none font-mono text-sm"
                      placeholder={confirmationWord}
                      type="text"
                      value={typedText}
                      onChange={(e) => setTypedText(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 pt-2 flex flex-col sm:flex-row gap-3 sm:justify-end bg-[#F8FAFC] border-t border-[#E2E8F0]">
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#475569] hover:text-[#0F172A] bg-transparent border border-[#E2E8F0] hover:bg-[#FFFFFF] transition-all focus:ring-2 focus:ring-[#3B82F6]/50 outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!isConfirmEnabled}
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-red-500/50 outline-none shadow-md ${
                    isConfirmEnabled
                      ? "bg-gradient-to-r from-red-600 to-red-700 hover:shadow-lg hover:shadow-red-900/20"
                      : "bg-[#E2E8F0] cursor-not-allowed opacity-50"
                  }`}
                >
                  <Trash2 className="h-4 w-4" />
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
