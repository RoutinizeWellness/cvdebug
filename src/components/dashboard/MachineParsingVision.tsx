import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MachineParsingVisionProps {
  resumeText: string;
  imageTrapDetected?: boolean;
  extractedFields?: {
    name?: string;
    email?: string;
    phone?: string;
    skills?: string[];
  };
}

export function MachineParsingVision({ resumeText, imageTrapDetected, extractedFields }: MachineParsingVisionProps) {
  const [showMachineView, setShowMachineView] = useState(false);

  const formatMachineText = () => {
    const lines = resumeText.split('\n');
    return lines.map((line, index) => {
      // Simulate scrambled text for image traps
      if (imageTrapDetected && Math.random() > 0.7) {
        return {
          text: line.split('').sort(() => Math.random() - 0.5).join(''),
          isScrambled: true,
          lineNumber: index + 1
        };
      }
      return {
        text: line,
        isScrambled: false,
        lineNumber: index + 1
      };
    });
  };

  const machineLines = formatMachineText();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-white">Resume Preview</h3>
          {imageTrapDetected && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/30">
              <AlertTriangle className="h-3 w-3 text-red-400" />
              <span className="text-xs font-bold text-red-400">Image Trap Detected</span>
            </div>
          )}
        </div>
        <Button
          variant={showMachineView ? "default" : "outline"}
          size="sm"
          onClick={() => setShowMachineView(!showMachineView)}
          className={showMachineView ? "bg-emerald-500 hover:bg-emerald-600 text-black" : ""}
        >
          {showMachineView ? (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Human View
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Machine View
            </>
          )}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {showMachineView ? (
          <motion.div
            key="machine"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative bg-black border border-emerald-500/30 rounded-lg p-6 overflow-auto max-h-[600px] font-mono text-sm"
            style={{ fontFamily: "'JetBrains Mono', 'Roboto Mono', monospace" }}
          >
            {/* CRT Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,255,65,0.03)_0px,transparent_1px,transparent_2px,rgba(0,255,65,0.03)_3px)] opacity-30" />
            
            <div className="relative space-y-1">
              {/* Extracted Fields Header */}
              {extractedFields && (
                <div className="mb-4 pb-4 border-b border-emerald-500/20">
                  <div className="text-emerald-400 text-xs mb-2">// EXTRACTED FIELDS</div>
                  {extractedFields.name && (
                    <div className="text-emerald-400">
                      <span className="text-slate-500">[NAME]</span> {extractedFields.name}
                    </div>
                  )}
                  {extractedFields.email && (
                    <div className="text-emerald-400">
                      <span className="text-slate-500">[EMAIL]</span> {extractedFields.email}
                    </div>
                  )}
                  {extractedFields.phone && (
                    <div className="text-emerald-400">
                      <span className="text-slate-500">[PHONE]</span> {extractedFields.phone}
                    </div>
                  )}
                  {extractedFields.skills && extractedFields.skills.length > 0 && (
                    <div className="text-emerald-400">
                      <span className="text-slate-500">[SKILLS]</span> {extractedFields.skills.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {/* Raw Text Content */}
              <div className="text-emerald-400 text-xs mb-2">// RAW TEXT CONTENT</div>
              {machineLines.map((line, index) => (
                <div key={index} className="flex gap-3">
                  <span className="text-slate-600 select-none w-8 text-right">{line.lineNumber}</span>
                  {line.isScrambled ? (
                    <span className="text-red-400 line-through opacity-70">
                      {line.text} <span className="text-xs">[IMAGE_TRAP]</span>
                    </span>
                  ) : (
                    <span className="text-emerald-400">{line.text || '\u00A0'}</span>
                  )}
                </div>
              ))}
            </div>

            {imageTrapDetected && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-red-400">PARSING ERROR DETECTED</p>
                    <p className="text-xs text-slate-400">
                      ATS systems cannot read text embedded in images. The scrambled sections above show how your resume appears to recruiting bots.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="human"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-slate-300 rounded-lg p-8 overflow-auto max-h-[600px]"
          >
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-slate-900 font-sans">{resumeText}</pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
