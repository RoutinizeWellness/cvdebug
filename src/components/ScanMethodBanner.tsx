import { Info, Zap, Cloud } from "lucide-react";
import { motion } from "framer-motion";

interface ScanMethodBannerProps {
  method: "preview" | "dashboard";
}

export function ScanMethodBanner({ method }: ScanMethodBannerProps) {
  if (method === "preview") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-[#EEF2FF] to-[#F5F3FF] border border-[#C4B5FD]/30 rounded-xl p-4 mb-6"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Zap className="h-4 w-4 text-[#8B5CF6]" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-[#1E293B] mb-1 flex items-center gap-2">
              Análisis Rápido (Cliente)
            </h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Este es un <span className="font-semibold text-[#1E293B]">escaneo instantáneo</span> que se ejecuta en tu navegador sin necesidad de iniciar sesión.
              Para obtener el <span className="font-semibold text-[#1E293B]">análisis completo y más preciso</span> con procesamiento avanzado de IA,
              OCR de servidor y análisis ML profundo, crea una cuenta gratuita.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Dashboard method
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-r from-[#DBEAFE] to-[#E0E7FF] border border-[#93C5FD]/30 rounded-xl p-4 mb-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#64748B]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Cloud className="h-4 w-4 text-[#64748B]" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-[#1E293B] mb-1 flex items-center gap-2">
            Análisis Completo (Servidor)
          </h4>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Este es un <span className="font-semibold text-[#1E293B]">análisis completo del servidor</span> con procesamiento avanzado de IA,
            OCR optimizado, detección ML profunda y algoritmos de análisis sofisticados.
            Los resultados son <span className="font-semibold text-[#1E293B]">más precisos y detallados</span> que el escaneo rápido de la página principal.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
