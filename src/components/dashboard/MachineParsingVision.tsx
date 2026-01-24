import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, AlertTriangle, RefreshCw, ZoomIn, ZoomOut, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MachineParsingVisionProps {
  resumeText: string;
  resumeUrl?: string;
  imageTrapDetected?: boolean;
  extractedFields?: {
    name?: string;
    email?: string;
    phone?: string;
    skills?: string[];
    experience?: Array<{
      company?: string;
      role?: string;
      description?: string;
    }>;
  };
}

export function MachineParsingVision({
  resumeText,
  resumeUrl,
  imageTrapDetected,
  extractedFields
}: MachineParsingVisionProps) {
  const [showMachineView, setShowMachineView] = useState(false);
  const [zoom, setZoom] = useState(100);

  // Generate dynamic session ID
  const sessionId = `0x${Date.now().toString(16).toUpperCase().slice(-6)}`;

  const formatMachineText = () => {
    const lines = resumeText.split('\n');
    return lines.map((line, index) => {
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
    <div className="h-full flex flex-col">
      {/* Header Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#FFFFFF]">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#64748B]">smart_toy</span>
            ATS Robot Vision
          </h3>
          {imageTrapDetected && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/30">
              <AlertTriangle className="h-3 w-3 text-[#EF4444]" />
              <span className="text-xs font-bold text-[#EF4444]">Image Trap Detected</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Vision Toggle */}
          <div className="flex items-center gap-3 bg-[#F8FAFC] rounded-full p-1 pl-4 border border-[#E2E8F0]">
            <span className="text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
              {showMachineView ? "Robot Vision" : "Human View"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showMachineView}
                onChange={() => setShowMachineView(!showMachineView)}
              />
              <div className="w-11 h-6 bg-[#E2E8F0] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#64748B]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[#FFFFFF] after:border-[#E2E8F0] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#64748B] peer-checked:to-[#1E293B]"></div>
            </label>
          </div>

          {/* Zoom Controls */}
          {showMachineView && (
            <div className="flex items-center gap-1 bg-[#F8FAFC] rounded-lg p-1 border border-[#E2E8F0]">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-2 hover:bg-[#E2E8F0] rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4 text-[#64748B]" />
              </button>
              <span className="text-xs font-mono text-[#64748B] px-2">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(150, zoom + 10))}
                className="p-2 hover:bg-[#E2E8F0] rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4 text-[#64748B]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Vision Area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {showMachineView ? (
            <motion.div
              key="machine"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#F8FAFC] flex justify-center overflow-auto p-8"
              style={{
                background: 'radial-gradient(circle at center, rgba(100, 116, 139, 0.03) 0%, rgba(248, 250, 252, 1) 100%), repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(100, 116, 139, 0.03) 2px, rgba(100, 116, 139, 0.03) 3px)',
                backgroundSize: '100% 100%, 100% 4px'
              }}
            >
              {/* Scanning Line Effect */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <motion.div
                  className="w-full h-0.5 bg-[#64748B] shadow-[0_0_15px_rgba(100,116,139,0.5)]"
                  animate={{ top: ['0%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ position: 'absolute' }}
                />
              </div>

              {/* Robot Vision Status Overlay */}
              <div className="absolute top-6 left-6 z-20 font-mono text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-[#64748B] flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#64748B] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#64748B]"></span>
                    </span>
                    VISION_LAYER_ACTIVE
                  </span>
                  <span className="text-[#64748B]">CONFIDENCE: <span className="text-[#22C55E]">87.4%</span></span>
                  <span className="text-[#64748B]">LATENCY: <span className="text-[#475569]">24ms</span></span>
                </div>
              </div>

              {/* Resume Container with Bounding Boxes */}
              <div
                className="relative bg-[#FFFFFF] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-sm overflow-hidden transition-all duration-300"
                style={{
                  width: `${800 * (zoom / 100)}px`,
                  minHeight: `${1100 * (zoom / 100)}px`,
                  opacity: 0.9
                }}
              >
                {/* Resume Image/Preview */}
                {resumeUrl && (
                  <img
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-20 filter grayscale contrast-125 mix-blend-multiply pointer-events-none"
                    src={resumeUrl}
                    alt="Resume preview"
                  />
                )}

                {/* Light Mode Filter */}
                <div className="absolute inset-0 bg-[#F8FAFC]/50 mix-blend-overlay pointer-events-none"></div>

                {/* Bounding Boxes Layer */}
                <div className="absolute inset-0 z-10 p-12 font-mono text-[10px] pointer-events-none">
                  {/* Header / Contact Info Area */}
                  {extractedFields?.name && (
                    <div className="absolute top-[40px] left-[40px] right-[40px] h-[120px] border border-[#64748B]/60 bg-[#64748B]/5 rounded flex flex-col justify-between p-1 group hover:border-[#64748B] hover:bg-[#64748B]/10 transition-colors">
                      <span className="bg-[#64748B]/20 text-[#64748B] px-1 w-fit">SECTION: HEADER</span>
                      <div className="absolute top-2 right-2 flex flex-col items-end text-[#64748B]">
                        <span>{extractedFields.name}</span>
                        {extractedFields.email && <span>{extractedFields.email}</span>}
                        {extractedFields.phone && <span>{extractedFields.phone}</span>}
                      </div>
                    </div>
                  )}

                  {/* Experience Block */}
                  {extractedFields?.experience && extractedFields.experience.length > 0 && (
                    <div className="absolute top-[300px] left-[40px] right-[40px] h-[180px] border border-[#64748B]/50 bg-[#64748B]/5 rounded p-1">
                      <div className="flex justify-between">
                        <span className="bg-[#64748B]/20 text-[#64748B] px-1 w-fit">SECTION: EXPERIENCE_01</span>
                        <span className="text-[#64748B]/50">PARSED: 98%</span>
                      </div>
                      <div className="mt-8 ml-4 border-l border-dashed border-[#64748B]/30 pl-4 py-2">
                        <div className="text-[#64748B]">ROLE: {extractedFields.experience?.[0]?.role || 'N/A'}</div>
                        <div className="text-[#64748B]/60">COMPANY: {extractedFields.experience?.[0]?.company || 'N/A'}</div>
                      </div>
                    </div>
                  )}

                  {/* Image Trap Error */}
                  {imageTrapDetected && (
                    <div className="absolute top-[500px] left-[40px] w-[300px] h-[150px] border-2 border-[#EF4444] bg-[#EF4444]/10 rounded flex items-center justify-center animate-pulse">
                      <div className="absolute -top-3 left-2 bg-[#EF4444] text-white px-2 py-0.5 rounded text-[9px] font-bold tracking-widest flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        DECODING_ERROR
                      </div>
                      <div className="text-center">
                        <p className="text-[#EF4444] font-bold text-xs mb-1">[IMAGE TRAP DETECTED]</p>
                        <p className="text-[#EF4444]/70 text-[9px]">
                          Text embedded in graphic layer.<br/>
                          OCR confidence &lt; 15%
                        </p>
                      </div>
                      {/* Glitch Lines */}
                      <div className="absolute inset-0 overflow-hidden opacity-30">
                        <div className="w-full h-1 bg-[#EF4444] absolute top-1/4 animate-ping"></div>
                        <div className="w-full h-1 bg-[#EF4444] absolute top-2/4 animate-ping" style={{ animationDelay: '75ms' }}></div>
                        <div className="w-full h-1 bg-[#EF4444] absolute top-3/4 animate-ping" style={{ animationDelay: '150ms' }}></div>
                      </div>
                    </div>
                  )}

                  {/* Skills Block */}
                  {extractedFields?.skills && extractedFields.skills.length > 0 && (
                    <div className="absolute top-[500px] right-[40px] w-[380px] h-[150px] border border-[#1E293B]/50 bg-[#1E293B]/5 rounded p-1">
                      <span className="bg-[#1E293B]/20 text-[#1E293B] px-1 w-fit">SECTION: SKILLS_TABLE</span>
                      <div className="grid grid-cols-2 gap-2 mt-4 px-2">
                        {extractedFields.skills.slice(0, 4).map((skill, i) => (
                          <div key={i} className="h-4 bg-[#1E293B]/20 rounded flex items-center px-2 text-[#1E293B] text-[9px]">
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Toolbar */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full px-2 py-2 flex items-center gap-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] z-30 backdrop-blur-xl bg-[#FFFFFF]/90 border border-[#E2E8F0]">
                <button
                  className="p-3 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-full transition-all"
                  title="Refresh Scan"
                  onClick={() => setShowMachineView(false)}
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  className="p-3 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-full transition-all"
                  title="Zoom In"
                  onClick={() => setZoom(Math.min(150, zoom + 10))}
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  className="p-3 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-full transition-all"
                  title="Zoom Out"
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-[#E2E8F0] mx-1"></div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#64748B] to-[#1E293B] hover:opacity-90 text-white rounded-full font-medium text-sm shadow-lg shadow-[#64748B]/25 transition-all">
                  <Wand2 className="h-4 w-4" />
                  <span>Fix Formatting</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="human"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#FFFFFF] flex justify-center overflow-auto p-8"
            >
              <div className="w-full max-w-4xl">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-[#0F172A] font-sans leading-relaxed">{resumeText}</pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Inspector Sidebar (Right Panel) */}
      {showMachineView && (
        <div className="absolute right-0 top-0 bottom-0 w-[380px] bg-[#FFFFFF] border-l border-[#E2E8F0] flex flex-col shadow-xl z-30">
          <div className="px-5 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#FFFFFF]/95 backdrop-blur">
            <h2 className="font-bold text-[#0F172A] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1E293B]">data_object</span>
              Parsed Output
            </h2>
            <button className="text-xs text-[#64748B] hover:text-[#64748B]/80 font-mono underline decoration-dotted underline-offset-4">
              Export JSON
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-0">
            {/* Console Log Header */}
            <div className="p-4 bg-[#F8FAFC] font-mono text-[10px] text-[#64748B] border-b border-[#E2E8F0]">
              <div className="flex justify-between mb-1">
                <span>SESSION_ID: {sessionId}</span>
                <span>TS: {new Date().toLocaleTimeString()}</span>
              </div>
              <div className="text-[#22C55E]">&gt; Initializing OCR engine... OK</div>
              <div className="text-[#22C55E]">&gt; Loading language models... OK</div>
              {imageTrapDetected && (
                <div className="text-[#F59E0B]">&gt; WARN: Low contrast detected at [500, 40]</div>
              )}
            </div>

            {/* Data Blocks */}
            <div className="p-5 flex flex-col gap-4">
              {/* Contact Card */}
              {extractedFields?.name && (
                <div className="border border-[#E2E8F0] bg-[#F8FAFC] rounded-lg p-3 group hover:border-[#64748B]/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-[#64748B] uppercase">Contact Info</span>
                    <span className="size-2 rounded-full bg-[#22C55E]"></span>
                  </div>
                  <div className="font-mono text-xs text-[#475569] space-y-1">
                    <div className="flex gap-2">
                      <span className="text-[#64748B] opacity-60">"name":</span> "{extractedFields.name}"
                    </div>
                    {extractedFields.email && (
                      <div className="flex gap-2">
                        <span className="text-[#64748B] opacity-60">"email":</span> "{extractedFields.email}"
                      </div>
                    )}
                    {extractedFields.phone && (
                      <div className="flex gap-2">
                        <span className="text-[#64748B] opacity-60">"phone":</span> "{extractedFields.phone}"
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Experience Card */}
              {extractedFields?.experience && extractedFields.experience.length > 0 && (
                <div className="border border-[#E2E8F0] bg-[#F8FAFC] rounded-lg p-3 group hover:border-[#64748B]/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-[#64748B] uppercase">Work Experience [1]</span>
                    <span className="size-2 rounded-full bg-[#22C55E]"></span>
                  </div>
                  <div className="font-mono text-xs text-[#475569] space-y-1 overflow-hidden">
                    {extractedFields.experience?.[0]?.company && (
                      <div className="flex gap-2">
                        <span className="text-[#64748B] opacity-60">"company":</span> "{extractedFields.experience[0].company}"
                      </div>
                    )}
                    {extractedFields.experience?.[0]?.role && (
                      <div className="flex gap-2">
                        <span className="text-[#64748B] opacity-60">"role":</span> "{extractedFields.experience[0].role}"
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error Card */}
              {imageTrapDetected && (
                <div className="border border-[#EF4444]/50 bg-[#EF4444]/5 rounded-lg p-3 relative overflow-hidden">
                  <div className="absolute right-0 top-0 p-2 opacity-10">
                    <AlertTriangle className="h-16 w-16 text-[#EF4444]" />
                  </div>
                  <div className="flex items-center justify-between mb-2 relative z-10">
                    <span className="text-xs font-mono text-[#EF4444] uppercase flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Parse Failure
                    </span>
                    <span className="size-2 rounded-full bg-[#EF4444] animate-pulse"></span>
                  </div>
                  <div className="font-mono text-xs text-[#EF4444] space-y-2 relative z-10">
                    <div className="p-2 bg-[#EF4444]/10 rounded border border-[#EF4444]/30">
                      <span className="text-[#EF4444] font-bold block mb-1">ERROR_CODE: IMG_TRAP</span>
                      The parser encountered text embedded within a rasterized image layer.
                    </div>
                    <div className="flex justify-end">
                      <button className="text-[10px] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] px-2 py-1 rounded border border-[#EF4444]/30 transition-colors">
                        Isolate Region
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Raw JSON Fragment */}
              <div className="mt-4">
                <span className="text-xs font-mono text-[#64748B] uppercase mb-2 block">Raw Fragment</span>
                <pre className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] text-[10px] text-[#22C55E] font-mono overflow-x-auto">
{JSON.stringify({
  skills: extractedFields?.skills || [],
  name: extractedFields?.name,
  email: extractedFields?.email
}, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-[#E2E8F0] bg-[#FFFFFF]">
            <button className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#475569] text-sm font-medium transition-colors">
              <AlertTriangle className="h-4 w-4" />
              Debug Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
