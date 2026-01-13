import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, FileText, AlertTriangle } from "lucide-react";

// Cast to any to avoid deep type instantiation errors
const apiAny = api as any;

export function ATSRobotVision() {
  const [robotVisionEnabled, setRobotVisionEnabled] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  
  const resumes = useQuery(apiAny.resumes.getResumes);
  const latestResume = resumes && resumes.length > 0 ? resumes[0] : null;
  const user = useQuery(apiAny.users.getUser);

  if (resumes === undefined) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F8FAFC] text-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!latestResume) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#F8FAFC] text-slate-900 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-slate-500" />
        </div>
        <h2 className="text-xl font-bold mb-2">No Resume Found</h2>
        <p className="text-slate-500 max-w-md">
          Upload a resume to see how ATS robots interpret your document.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* Glassmorphic Header */}
      <header className="glass-panel border-b border-slate-200/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6]">
              <span className="material-symbols-outlined text-[24px]">visibility</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">ATS Robot Vision</h1>
              <p className="text-xs text-slate-500">{latestResume.title || "Untitled Resume"}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Robot Vision Toggle */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-50/50 border border-slate-200/50">
            <span className="material-symbols-outlined text-[20px] text-[#3B82F6]">
              smart_toy
            </span>
            <span className="text-sm font-medium">Robot Vision</span>
            <Switch
              checked={robotVisionEnabled}
              onCheckedChange={setRobotVisionEnabled}
              className="data-[state=checked]:bg-[#3B82F6]"
            />
          </div>

          {/* Action Buttons */}
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200 hover:bg-slate-50/50 text-slate-900"
          >
            <span className="material-symbols-outlined text-[18px] mr-2">download</span>
            Export Report
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90 text-slate-900"
          >
            <span className="material-symbols-outlined text-[18px] mr-2">auto_fix_high</span>
            Fix All Issues
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Document Canvas */}
        <div className="flex-1 relative bg-white/50 p-8 overflow-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto relative">
            {/* Resume Document with Scan Line */}
            <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden min-h-[800px]">
              {/* Scan Line Animation */}
              {robotVisionEnabled && (
                <div className="scan-line absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-70 z-10" />
              )}

              {/* Resume Content */}
              <div className="relative p-12 bg-white text-black">
                {/* Header Section Bounding Box */}
                <div className="relative border-2 border-green-500 rounded p-4 mb-6">
                  <div className="absolute -top-3 left-2 bg-green-500 text-slate-900 text-xs font-bold px-2 py-1 rounded">
                    HEADER ✓
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{user?.name || "Candidate Name"}</h1>
                  <p className="text-sm text-gray-600">{user?.email || "email@example.com"}</p>
                </div>

                {/* OCR Text Content */}
                <div className="relative border-2 border-blue-500/50 rounded p-4 mb-6">
                  <div className="absolute -top-3 left-2 bg-blue-500 text-slate-900 text-xs font-bold px-2 py-1 rounded">
                    PARSED CONTENT
                  </div>
                  <div className="whitespace-pre-wrap font-mono text-xs text-gray-700 leading-relaxed">
                    {latestResume.ocrText || "No text content parsed yet..."}
                  </div>
                </div>

                {/* Image Trap Warning if detected */}
                {latestResume.hasImageTrap && (
                  <div className="relative border-2 border-red-500 rounded p-4 pulse-error mt-6">
                    <div className="absolute -top-3 left-2 bg-red-500 text-slate-900 text-xs font-bold px-2 py-1 rounded animate-pulse">
                      IMAGE TRAP ⚠
                    </div>
                    <div className="bg-gray-100 p-4 rounded relative">
                      <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 backdrop-blur-sm">
                        <div className="text-center">
                          <span className="material-symbols-outlined text-[48px] text-red-500 mb-2">
                            error
                          </span>
                          <p className="text-red-600 font-bold text-sm">UNREADABLE CONTENT</p>
                          <p className="text-xs text-red-500 mt-1">Content embedded as image</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 blur-sm">
                        [Complex layout or image-based text detected]
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Robot Vision Status Overlay */}
              {robotVisionEnabled && (
                <div className="absolute top-4 right-4 glass-panel px-4 py-2 rounded-lg border border-[#3B82F6]/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
                    <span className="text-xs font-mono text-[#3B82F6]">SCANNING...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Toolbar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 rounded-full border border-slate-200/50 flex items-center gap-4 shadow-2xl">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-900 hover:bg-slate-700/50"
                onClick={() => {}}
              >
                <span className="material-symbols-outlined text-[20px]">refresh</span>
              </Button>
              <div className="h-6 w-px bg-slate-700" />
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-900 hover:bg-slate-700/50"
                  onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                >
                  <span className="material-symbols-outlined text-[20px]">zoom_out</span>
                </Button>
                <span className="text-sm font-mono text-slate-500 min-w-[60px] text-center">
                  {zoomLevel}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-900 hover:bg-slate-700/50"
                  onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                >
                  <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                </Button>
              </div>
              <div className="h-6 w-px bg-slate-700" />
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90 text-slate-900"
              >
                <span className="material-symbols-outlined text-[18px] mr-2">build</span>
                Fix Formatting
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Inspector Sidebar */}
        <div className="w-96 glass-panel border-l border-slate-200/50 flex flex-col">
          {/* Inspector Header */}
          <div className="px-6 py-4 border-b border-slate-200/50">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[20px] text-[#8B5CF6]">
                code
              </span>
              <h2 className="text-lg font-bold">Inspector</h2>
            </div>
            <p className="text-xs text-slate-500">Parsed ATS Output</p>
          </div>

          {/* Parsed Output & Console */}
          <div className="flex-1 overflow-auto custom-scrollbar p-6 space-y-6">
            {/* Console Logs */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-600 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">terminal</span>
                Console Output
              </h3>
              <div className="bg-slate-950/50 rounded-lg p-3 font-mono text-xs space-y-1 border border-slate-200">
                <div className="text-green-400">[✓] Document loaded</div>
                <div className="text-green-400">[✓] Text layer extracted</div>
                {latestResume.ocrText ? (
                   <div className="text-green-400">[✓] Content length: {latestResume.ocrText.length} chars</div>
                ) : (
                   <div className="text-yellow-400">[!] No content extracted</div>
                )}
                {latestResume.hasImageTrap ? (
                  <div className="text-red-400">[✗] Critical: Image trap detected</div>
                ) : (
                  <div className="text-green-400">[✓] No image traps detected</div>
                )}
              </div>
            </div>

            {/* Data Blocks */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-600 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">database</span>
                Extracted Data
              </h3>

              {/* Contact Block */}
              <div className="bg-slate-50/30 rounded-lg p-3 border border-green-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-green-400">METADATA</span>
                  <span className="material-symbols-outlined text-[16px] text-green-400">
                    check_circle
                  </span>
                </div>
                <div className="text-xs space-y-1 text-slate-600">
                  <div><span className="text-slate-500">filename:</span> "{latestResume.title}"</div>
                  <div><span className="text-slate-500">type:</span> "{latestResume.mimeType}"</div>
                  <div><span className="text-slate-500">size:</span> {latestResume.ocrText?.length || 0} bytes</div>
                </div>
              </div>

              {/* Parse Failure Block if applicable */}
              {latestResume.hasImageTrap && (
                <div className="bg-slate-50/30 rounded-lg p-3 border border-red-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-red-400">ERRORS</span>
                    <span className="material-symbols-outlined text-[16px] text-red-400">
                      error
                    </span>
                  </div>
                  <div className="text-xs space-y-1 text-slate-600">
                    <div><span className="text-slate-500">error:</span> "Image content detected"</div>
                    <div><span className="text-slate-500">type:</span> "Unreadable block"</div>
                    <div><span className="text-slate-500">impact:</span> "Critical"</div>
                  </div>
                </div>
              )}
            </div>

            {/* Raw JSON Fragment */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-600 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">data_object</span>
                Raw JSON
              </h3>
              <div className="bg-slate-950/50 rounded-lg p-3 font-mono text-xs border border-slate-200 overflow-x-auto custom-scrollbar">
                <pre className="text-slate-500">{JSON.stringify({
                  id: latestResume._id,
                  status: latestResume.status,
                  score: latestResume.score,
                  has_errors: latestResume.hasImageTrap
                }, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(2000%); }
        }
        
        .scan-line {
          animation: scan 3s linear infinite;
        }
        
        @keyframes pulse-error {
          0%, 100% { 
            border-color: rgb(239 68 68 / 0.5);
            box-shadow: 0 0 0 0 rgb(239 68 68 / 0.4);
          }
          50% { 
            border-color: rgb(239 68 68 / 1);
            box-shadow: 0 0 0 8px rgb(239 68 68 / 0);
          }
        }
        
        .pulse-error {
          animation: pulse-error 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}