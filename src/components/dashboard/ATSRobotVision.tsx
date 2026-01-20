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
  const user = useQuery(apiAny.users.currentUser);

  if (resumes === undefined) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F8FAFC] text-[#0F172A]">
        <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  if (!latestResume) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#F8FAFC] text-[#0F172A] p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F8FAFC] flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-[#64748B]" />
        </div>
        <h2 className="text-xl font-bold mb-2">No Resume Found</h2>
        <p className="text-[#64748B] max-w-md">
          Upload a resume to see how ATS robots interpret your document.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-[#FFFFFF] border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6]">
              <span className="material-symbols-outlined text-[24px]">visibility</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#0F172A]">ATS Robot Vision</h1>
              <p className="text-xs text-[#64748B]">{latestResume.title || "Untitled Resume"}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Robot Vision Toggle */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="material-symbols-outlined text-[20px] text-[#3B82F6]">
              smart_toy
            </span>
            <span className="text-sm font-medium text-[#0F172A]">Robot Vision</span>
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
            className="border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A]"
          >
            <span className="material-symbols-outlined text-[18px] mr-2">download</span>
            Export Report
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90 text-white"
          >
            <span className="material-symbols-outlined text-[18px] mr-2">auto_fix_high</span>
            Fix All Issues
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Document Canvas */}
        <div className="flex-1 relative bg-[#F8FAFC] p-8 overflow-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto relative">
            {/* Resume Document with Scan Line */}
            <div className="relative bg-[#FFFFFF] rounded-lg shadow-2xl overflow-hidden min-h-[800px]">
              {/* Scan Line Animation */}
              {robotVisionEnabled && (
                <div className="scan-line absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-70 z-10" />
              )}

              {/* Resume Content */}
              <div className="relative p-12 bg-[#FFFFFF] text-[#0F172A]">
                {/* Header Section Bounding Box */}
                <div className="relative border-2 border-[#22C55E] rounded p-4 mb-6">
                  <div className="absolute -top-3 left-2 bg-[#22C55E] text-white text-xs font-bold px-2 py-1 rounded">
                    HEADER ✓
                  </div>
                  <h1 className="text-3xl font-bold mb-2 text-[#0F172A]">{user?.name || "Candidate Name"}</h1>
                  {user?.email && <p className="text-sm text-[#64748B]">{user.email}</p>}
                </div>

                {/* OCR Text Content */}
                <div className="relative border-2 border-[#3B82F6]/50 rounded p-4 mb-6">
                  <div className="absolute -top-3 left-2 bg-[#3B82F6] text-white text-xs font-bold px-2 py-1 rounded">
                    PARSED CONTENT
                  </div>
                  <div className="whitespace-pre-wrap font-mono text-xs text-[#475569] leading-relaxed">
                    {latestResume.ocrText || "No text content parsed yet..."}
                  </div>
                </div>

                {/* Image Trap Warning if detected */}
                {latestResume.hasImageTrap && (
                  <div className="relative border-2 border-[#EF4444] rounded p-4 pulse-error mt-6">
                    <div className="absolute -top-3 left-2 bg-[#EF4444] text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
                      IMAGE TRAP ⚠
                    </div>
                    <div className="bg-[#F8FAFC] p-4 rounded relative">
                      <div className="absolute inset-0 flex items-center justify-center bg-[#EF4444]/10 backdrop-blur-sm">
                        <div className="text-center">
                          <span className="material-symbols-outlined text-[48px] text-[#EF4444] mb-2">
                            error
                          </span>
                          <p className="text-[#EF4444] font-bold text-sm">UNREADABLE CONTENT</p>
                          <p className="text-xs text-[#EF4444] mt-1">Content embedded as image</p>
                        </div>
                      </div>
                      <p className="text-sm text-[#64748B] blur-sm">
                        [Complex layout or image-based text detected]
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Robot Vision Status Overlay */}
              {robotVisionEnabled && (
                <div className="absolute top-4 right-4 bg-[#FFFFFF] px-4 py-2 rounded-lg border border-[#3B82F6]/30 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
                    <span className="text-xs font-mono text-[#3B82F6]">SCANNING...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Toolbar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#FFFFFF] px-6 py-3 rounded-full border border-[#E2E8F0] flex items-center gap-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                onClick={() => {}}
              >
                <span className="material-symbols-outlined text-[20px]">refresh</span>
              </Button>
              <div className="h-6 w-px bg-[#E2E8F0]" />
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                  onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                >
                  <span className="material-symbols-outlined text-[20px]">zoom_out</span>
                </Button>
                <span className="text-sm font-mono text-[#64748B] min-w-[60px] text-center">
                  {zoomLevel}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                  onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                >
                  <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                </Button>
              </div>
              <div className="h-6 w-px bg-[#E2E8F0]" />
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90 text-white"
              >
                <span className="material-symbols-outlined text-[18px] mr-2">build</span>
                Fix Formatting
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Inspector Sidebar */}
        <div className="w-96 bg-[#FFFFFF] border-l border-[#E2E8F0] flex flex-col">
          {/* Inspector Header */}
          <div className="px-6 py-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[20px] text-[#8B5CF6]">
                code
              </span>
              <h2 className="text-lg font-bold text-[#0F172A]">Inspector</h2>
            </div>
            <p className="text-xs text-[#64748B]">Parsed ATS Output</p>
          </div>

          {/* Parsed Output & Console */}
          <div className="flex-1 overflow-auto custom-scrollbar p-6 space-y-6">
            {/* Console Logs */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">terminal</span>
                Console Output
              </h3>
              <div className="bg-[#0F172A] rounded-lg p-3 font-mono text-xs space-y-1 border border-[#E2E8F0]">
                <div className="text-[#22C55E]">[✓] Document loaded</div>
                <div className="text-[#22C55E]">[✓] Text layer extracted</div>
                {latestResume.ocrText ? (
                   <div className="text-[#22C55E]">[✓] Content length: {latestResume.ocrText.length} chars</div>
                ) : (
                   <div className="text-[#F59E0B]">[!] No content extracted</div>
                )}
                {latestResume.hasImageTrap ? (
                  <div className="text-[#EF4444]">[✗] Critical: Image trap detected</div>
                ) : (
                  <div className="text-[#22C55E]">[✓] No image traps detected</div>
                )}
              </div>
            </div>

            {/* Data Blocks */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">database</span>
                Extracted Data
              </h3>

              {/* Contact Block */}
              <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#22C55E]/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#22C55E]">METADATA</span>
                  <span className="material-symbols-outlined text-[16px] text-[#22C55E]">
                    check_circle
                  </span>
                </div>
                <div className="text-xs space-y-1 text-[#475569]">
                  <div><span className="text-[#64748B]">filename:</span> "{latestResume.title}"</div>
                  <div><span className="text-[#64748B]">type:</span> "{latestResume.mimeType}"</div>
                  <div><span className="text-[#64748B]">size:</span> {latestResume.ocrText?.length || 0} bytes</div>
                </div>
              </div>

              {/* Parse Failure Block if applicable */}
              {latestResume.hasImageTrap && (
                <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#EF4444]/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#EF4444]">ERRORS</span>
                    <span className="material-symbols-outlined text-[16px] text-[#EF4444]">
                      error
                    </span>
                  </div>
                  <div className="text-xs space-y-1 text-[#475569]">
                    <div><span className="text-[#64748B]">error:</span> "Image content detected"</div>
                    <div><span className="text-[#64748B]">type:</span> "Unreadable block"</div>
                    <div><span className="text-[#64748B]">impact:</span> "Critical"</div>
                  </div>
                </div>
              )}
            </div>

            {/* Raw JSON Fragment */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">data_object</span>
                Raw JSON
              </h3>
              <div className="bg-[#0F172A] rounded-lg p-3 font-mono text-xs border border-[#E2E8F0] overflow-x-auto custom-scrollbar">
                <pre className="text-[#22C55E]">{JSON.stringify({
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