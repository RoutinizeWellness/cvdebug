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
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">smart_toy</span>
            ATS Robot Vision
          </h3>
          {imageTrapDetected && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#EF4444]/10 border border-red-500/30">
              <AlertTriangle className="h-3 w-3 text-red-400" />
              <span className="text-xs font-bold text-red-400">Image Trap Detected</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Vision Toggle */}
          <div className="flex items-center gap-3 bg-zinc-900/50 rounded-full p-1 pl-4 border border-zinc-800">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              {showMachineView ? "Robot Vision" : "Human View"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={showMachineView}
                onChange={() => setShowMachineView(!showMachineView)}
              />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[#FFFFFF] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-teal-600"></div>
            </label>
          </div>

          {/* Zoom Controls */}
          {showMachineView && (
            <div className="flex items-center gap-1 bg-zinc-900/50 rounded-lg p-1 border border-zinc-800">
              <button 
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-2 hover:bg-zinc-800 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4 text-zinc-400" />
              </button>
              <span className="text-xs font-mono text-zinc-400 px-2">{zoom}%</span>
              <button 
                onClick={() => setZoom(Math.min(150, zoom + 10))}
                className="p-2 hover:bg-zinc-800 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4 text-zinc-400" />
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
              className="absolute inset-0 bg-[#020617] flex justify-center overflow-auto p-8"
              style={{
                background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.03) 0%, rgba(2, 6, 23, 0.8) 100%), repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(59, 130, 246, 0.05) 2px, rgba(59, 130, 246, 0.05) 3px)',
                backgroundSize: '100% 100%, 100% 4px'
              }}
            >
              {/* Scanning Line Effect */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <motion.div 
                  className="w-full h-0.5 bg-primary shadow-[0_0_15px_#3B82F6]"
                  animate={{ top: ['0%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ position: 'absolute' }}
                />
              </div>

              {/* Robot Vision Status Overlay */}
              <div className="absolute top-6 left-6 z-20 font-mono text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-primary flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    VISION_LAYER_ACTIVE
                  </span>
                  <span className="text-zinc-500">CONFIDENCE: <span className="text-emerald-400">87.4%</span></span>
                  <span className="text-zinc-500">LATENCY: <span className="text-zinc-300">24ms</span></span>
                </div>
              </div>

              {/* Resume Container with Bounding Boxes */}
              <div 
                className="relative bg-[#FFFFFF] shadow-2xl rounded-sm overflow-hidden transition-all duration-300"
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
                
                {/* Dark Mode Filter */}
                <div className="absolute inset-0 bg-[#020617]/80 mix-blend-hard-light pointer-events-none"></div>

                {/* Bounding Boxes Layer */}
                <div className="absolute inset-0 z-10 p-12 font-mono text-[10px] pointer-events-none">
                  {/* Header / Contact Info Area */}
                  {extractedFields?.name && (
                    <div className="absolute top-[40px] left-[40px] right-[40px] h-[120px] border border-primary/60 bg-primary/5 rounded flex flex-col justify-between p-1 group hover:border-primary hover:bg-primary/10 transition-colors">
                      <span className="bg-primary/20 text-primary px-1 w-fit">SECTION: HEADER</span>
                      <div className="absolute top-2 right-2 flex flex-col items-end text-primary/80">
                        <span>{extractedFields.name}</span>
                        {extractedFields.email && <span>{extractedFields.email}</span>}
                        {extractedFields.phone && <span>{extractedFields.phone}</span>}
                      </div>
                    </div>
                  )}

                  {/* Experience Block */}
                  {extractedFields?.experience && extractedFields.experience.length > 0 && (
                    <div className="absolute top-[300px] left-[40px] right-[40px] h-[180px] border border-blue-400/50 bg-blue-400/5 rounded p-1">
                      <div className="flex justify-between">
                        <span className="bg-blue-400/20 text-blue-300 px-1 w-fit">SECTION: EXPERIENCE_01</span>
                        <span className="text-blue-300/50">PARSED: 98%</span>
                      </div>
                      <div className="mt-8 ml-4 border-l border-dashed border-blue-400/30 pl-4 py-2">
                        <div className="text-blue-200/80">ROLE: {extractedFields.experience[0].role || 'N/A'}</div>
                        <div className="text-blue-200/60">COMPANY: {extractedFields.experience[0].company || 'N/A'}</div>
                      </div>
                    </div>
                  )}

                  {/* Image Trap Error */}
                  {imageTrapDetected && (
                    <div className="absolute top-[500px] left-[40px] w-[300px] h-[150px] border-2 border-red-500 bg-[#EF4444]/10 rounded flex items-center justify-center animate-pulse">
                      <div className="absolute -top-3 left-2 bg-[#EF4444] text-[#0F172A] px-2 py-0.5 rounded text-[9px] font-bold tracking-widest flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        DECODING_ERROR
                      </div>
                      <div className="text-center">
                        <p className="text-red-400 font-bold text-xs mb-1">[IMAGE TRAP DETECTED]</p>
                        <p className="text-red-300/70 text-[9px]">
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
                    <div className="absolute top-[500px] right-[40px] w-[380px] h-[150px] border border-teal-500/50 bg-teal-500/5 rounded p-1">
                      <span className="bg-teal-500/20 text-teal-300 px-1 w-fit">SECTION: SKILLS_TABLE</span>
                      <div className="grid grid-cols-2 gap-2 mt-4 px-2">
                        {extractedFields.skills.slice(0, 4).map((skill, i) => (
                          <div key={i} className="h-4 bg-teal-400/20 rounded flex items-center px-2 text-teal-300 text-[9px]">
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Toolbar */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-panel rounded-full px-2 py-2 flex items-center gap-2 shadow-2xl z-30 backdrop-blur-xl bg-zinc-900/40 border border-primary/20">
                <button 
                  className="p-3 text-zinc-300 hover:text-[#0F172A] hover:bg-[#FFFFFF]/10 rounded-full transition-all" 
                  title="Refresh Scan"
                  onClick={() => setShowMachineView(false)}
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button 
                  className="p-3 text-zinc-300 hover:text-[#0F172A] hover:bg-[#FFFFFF]/10 rounded-full transition-all" 
                  title="Zoom In"
                  onClick={() => setZoom(Math.min(150, zoom + 10))}
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button 
                  className="p-3 text-zinc-300 hover:text-[#0F172A] hover:bg-[#FFFFFF]/10 rounded-full transition-all" 
                  title="Zoom Out"
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-zinc-600 mx-1"></div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-teal-600 hover:from-primary/90 hover:to-teal-600/90 text-[#0F172A] rounded-full font-medium text-sm shadow-lg shadow-primary/25 transition-all">
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
        <div className="absolute right-0 top-0 bottom-0 w-[380px] bg-zinc-900 border-l border-zinc-800 flex flex-col shadow-xl z-30">
          <div className="px-5 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/95 backdrop-blur">
            <h2 className="font-bold text-zinc-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-400">data_object</span>
              Parsed Output
            </h2>
            <button className="text-xs text-primary hover:text-primary/80 font-mono underline decoration-dotted underline-offset-4">
              Export JSON
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-0">
            {/* Console Log Header */}
            <div className="p-4 bg-zinc-950 font-mono text-[10px] text-zinc-500 border-b border-zinc-800">
              <div className="flex justify-between mb-1">
                <span>SESSION_ID: 0x8F2A9C</span>
                <span>TS: {new Date().toLocaleTimeString()}</span>
              </div>
              <div className="text-[#22C55E]/80">&gt; Initializing OCR engine... OK</div>
              <div className="text-[#22C55E]/80">&gt; Loading language models... OK</div>
              {imageTrapDetected && (
                <div className="text-[#F59E0B]/80">&gt; WARN: Low contrast detected at [500, 40]</div>
              )}
            </div>

            {/* Data Blocks */}
            <div className="p-5 flex flex-col gap-4">
              {/* Contact Card */}
              {extractedFields?.name && (
                <div className="border border-zinc-700 bg-zinc-800/30 rounded-lg p-3 group hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-zinc-400 uppercase">Contact Info</span>
                    <span className="size-2 rounded-full bg-[#22C55E]"></span>
                  </div>
                  <div className="font-mono text-xs text-zinc-300 space-y-1">
                    <div className="flex gap-2">
                      <span className="text-primary opacity-60">"name":</span> "{extractedFields.name}"
                    </div>
                    {extractedFields.email && (
                      <div className="flex gap-2">
                        <span className="text-primary opacity-60">"email":</span> "{extractedFields.email}"
                      </div>
                    )}
                    {extractedFields.phone && (
                      <div className="flex gap-2">
                        <span className="text-primary opacity-60">"phone":</span> "{extractedFields.phone}"
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Experience Card */}
              {extractedFields?.experience && extractedFields.experience.length > 0 && (
                <div className="border border-zinc-700 bg-zinc-800/30 rounded-lg p-3 group hover:border-[#3B82F6]/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-zinc-400 uppercase">Work Experience [1]</span>
                    <span className="size-2 rounded-full bg-[#22C55E]"></span>
                  </div>
                  <div className="font-mono text-xs text-zinc-300 space-y-1 overflow-hidden">
                    {extractedFields.experience[0].company && (
                      <div className="flex gap-2">
                        <span className="text-blue-400 opacity-60">"company":</span> "{extractedFields.experience[0].company}"
                      </div>
                    )}
                    {extractedFields.experience[0].role && (
                      <div className="flex gap-2">
                        <span className="text-blue-400 opacity-60">"role":</span> "{extractedFields.experience[0].role}"
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error Card */}
              {imageTrapDetected && (
                <div className="border border-red-900/50 bg-red-950/10 rounded-lg p-3 relative overflow-hidden">
                  <div className="absolute right-0 top-0 p-2 opacity-10">
                    <AlertTriangle className="h-16 w-16 text-[#EF4444]" />
                  </div>
                  <div className="flex items-center justify-between mb-2 relative z-10">
                    <span className="text-xs font-mono text-red-400 uppercase flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Parse Failure
                    </span>
                    <span className="size-2 rounded-full bg-[#EF4444] animate-pulse"></span>
                  </div>
                  <div className="font-mono text-xs text-red-200/80 space-y-2 relative z-10">
                    <div className="p-2 bg-red-950/40 rounded border border-red-900/50">
                      <span className="text-red-400 font-bold block mb-1">ERROR_CODE: IMG_TRAP</span>
                      The parser encountered text embedded within a rasterized image layer.
                    </div>
                    <div className="flex justify-end">
                      <button className="text-[10px] bg-red-900/30 hover:bg-red-900/50 text-red-300 px-2 py-1 rounded border border-red-800 transition-colors">
                        Isolate Region
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Raw JSON Fragment */}
              <div className="mt-4">
                <span className="text-xs font-mono text-zinc-500 uppercase mb-2 block">Raw Fragment</span>
                <pre className="bg-[#0b101a] p-3 rounded-lg border border-zinc-800 text-[10px] text-zinc-400 font-mono overflow-x-auto">
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
          <div className="p-4 border-t border-zinc-800 bg-zinc-900">
            <button className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors">
              <AlertTriangle className="h-4 w-4" />
              Debug Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}