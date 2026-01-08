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
              className="glass-panel w-full max-w-lg rounded-xl shadow-2xl flex flex-col overflow-hidden relative border-t border-slate-600/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative top line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-80"></div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Header */}
              <div className="p-6 pb-0 flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-500">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <p className="text-slate-300 text-base leading-relaxed">
                  {description}
                  {itemName && (
                    <>
                      {" "}
                      <span className="bg-slate-800 border border-slate-700 text-white px-1.5 py-0.5 rounded text-sm font-mono mx-0.5">
                        {itemName}
                      </span>
                      ?
                    </>
                  )}
                </p>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                  This action cannot be undone. All logs, analytics data, and associated
                  debugging sessions will be permanently removed from our servers.
                </p>

                {/* Confirmation Input */}
                {requiresTyping && (
                  <div className="mt-6">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Type{" "}
                      <span className="text-white select-all">{confirmationWord}</span> to
                      confirm
                    </label>
                    <input
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all outline-none font-mono text-sm shadow-inner"
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
              <div className="p-6 pt-2 flex flex-col sm:flex-row gap-3 sm:justify-end bg-slate-900/30 border-t border-slate-700/50">
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-transparent border border-slate-600 hover:bg-slate-800 transition-all focus:ring-2 focus:ring-slate-500/50 outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!isConfirmEnabled}
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-red-500/50 outline-none shadow-md ${
                    isConfirmEnabled
                      ? "bg-gradient-to-r from-red-600 to-red-700 hover:shadow-lg hover:shadow-red-900/40"
                      : "bg-slate-700 cursor-not-allowed opacity-50"
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
