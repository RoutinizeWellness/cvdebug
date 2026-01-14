import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  History,
  Sparkles,
  Lock,
  Download,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  GripVertical,
  ChevronDown,
  Edit,
  PlusCircle,
  CheckCircle,
  Diamond
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MLInsights } from "@/components/dashboard/MLInsights";

interface WritingForgeProps {
  resumeId?: Id<"resumes"> | null;
  onUpgrade?: () => void;
}

export function WritingForge({ resumeId, onUpgrade }: WritingForgeProps) {
  const [tone, setTone] = useState("technical");
  const [showUpgradeTooltip, setShowUpgradeTooltip] = useState(false);

  // Load resume data
  const resume = useQuery(api.resumes.getResume, resumeId ? { id: resumeId } : "skip");
  const currentUser = useQuery((api as any).users.currentUser);

  // Check if user has Interview Sprint plan
  const hasInterviewSprint = currentUser?.subscriptionTier === "interview_sprint" &&
    (!currentUser?.sprintExpiresAt || currentUser.sprintExpiresAt > Date.now());

  const handleRegenerate = () => {
    if (!hasInterviewSprint) {
      toast.error("Interview Sprint plan required", {
        description: "Upgrade to access AI regeneration"
      });
      onUpgrade?.();
      return;
    }
    toast.success("Regenerating with AI...", {
      description: "Analyzing your resume and applying improvements..."
    });
  };

  const handleDownloadPDF = () => {
    if (!hasInterviewSprint) {
      toast.error("Interview Sprint plan required", {
        description: "Upgrade to unlock PDF downloads"
      });
      onUpgrade?.();
      return;
    }
    toast.success("Preparing PDF download...");
  };

  const handleHistory = () => {
    if (!hasInterviewSprint) {
      toast.error("Interview Sprint plan required", {
        description: "Upgrade to access version history"
      });
      onUpgrade?.();
      return;
    }
    toast.info("Opening version history...");
  };

  const handleEditMission = () => {
    toast.info("Mission editor coming soon", {
      description: "You'll be able to change your target job and company here"
    });
  };

  const handleToneChange = (newTone: string) => {
    if (!hasInterviewSprint) {
      toast.error("Interview Sprint plan required", {
        description: "Upgrade to change tone strategy"
      });
      onUpgrade?.();
      return;
    }
    setTone(newTone);
    toast.success(`Tone changed to ${newTone}`, {
      description: "Your resume will be optimized for this tone"
    });
  };

  // Extract missing keywords from resume data - NO FALLBACK, only real data
  const keywordGaps = resume?.missingKeywords && Array.isArray(resume.missingKeywords)
    ? resume.missingKeywords.slice(0, 4).map((k: any) => ({
        name: typeof k === 'string' ? k : k.keyword,
        completed: false
      }))
    : [];

  // Calculate match score and gap
  const matchScore = resume?.score || 0;
  const gapScore = 100 - matchScore;

  // Extract job details
  const jobTitle = resume?.jobTitle || "No job selected";
  const company = resume?.company || "No company";
  const resumeTitle = resume?.title || "Draft Resume";

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      {/* Interview Sprint Required Alert */}
      {!hasInterviewSprint && (
        <Alert className="m-6 mb-4 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-primary/40 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 pointer-events-none" />

          <div className="relative">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                <Diamond className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[#0F172A] font-bold text-base mb-1">Interview Sprint Required</h3>
                <p className="text-[#475569] text-sm leading-relaxed">
                  Build and edit professional resumes with AI-powered writing assistance.
                </p>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4 ml-14">
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <span className="text-[#22C55E] font-bold">✓</span>
                <span>AI content generation</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <span className="text-[#22C55E] font-bold">✓</span>
                <span>Professional templates</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <span className="text-[#22C55E] font-bold">✓</span>
                <span>PDF export</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <span className="text-[#22C55E] font-bold">✓</span>
                <span>Unlimited edits</span>
              </div>
            </div>

            <Button
              onClick={onUpgrade}
              className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#8B5CF6]/90 hover:to-[#6366F1]/90 w-full py-2.5 text-white font-bold border-0 flex items-center justify-center gap-2 ml-14"
            >
              <Sparkles className="h-4 w-4" />
              <span>Upgrade to Interview Sprint</span>
            </Button>
          </div>
        </Alert>
      )}

      {/* Top Navigation */}
      <header className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#FFFFFF] px-6 py-3 shrink-0 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-6">
            <a className="text-[#64748B] hover:text-[#0F172A] text-sm font-medium transition-colors" href="#">
              Dashboard
            </a>
            <span className="text-[#0F172A] text-sm font-medium border-b-2 border-primary pb-0.5 flex items-center gap-2">
              Writing Forge
              {!hasInterviewSprint && (
                <Lock className="h-3 w-3 text-[#64748B]" />
              )}
            </span>
            <a className="text-[#64748B] hover:text-[#0F172A] text-sm font-medium transition-colors" href="#">
              Interview Sprint
            </a>
          </nav>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar: Configuration */}
        <aside className="w-80 flex flex-col border-r border-[#E2E8F0] bg-[#FFFFFF] overflow-y-auto shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
          <div className="p-6 flex flex-col gap-8">
            {/* Tone Configuration */}
            <div className="flex flex-col gap-3">
              <label className="text-[#64748B] text-xs font-bold uppercase tracking-wider">
                Tone Strategy
              </label>
              <div className="relative">
                <select
                  value={tone}
                  onChange={(e) => handleToneChange(e.target.value)}
                  className="w-full appearance-none rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] p-3 pr-10 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] cursor-pointer"
                >
                  <option value="technical">Technical Specialist</option>
                  <option value="executive">Executive Leader</option>
                  <option value="creative">Creative Storyteller</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#64748B]">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Active Mission Card */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-[#64748B] text-xs font-bold uppercase tracking-wider">
                  Active Mission
                </label>
                <button
                  onClick={handleEditMission}
                  className="text-primary text-xs font-medium hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </button>
              </div>
              <div className="flex flex-col gap-4 rounded-xl bg-[#FFFFFF] p-4 border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] relative overflow-hidden group">
                {/* Decorative gradient blob */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#3B82F6]/10 rounded-full blur-2xl group-hover:bg-[#3B82F6]/15 transition-all duration-500" />

                <div className="flex items-center gap-3 relative z-10">
                  <div className="size-10 rounded-lg bg-[#F8FAFC] p-2 flex items-center justify-center border border-[#E2E8F0]">
                    <svg className="w-6 h-6 text-[#0F172A] fill-current" fill="none" viewBox="0 0 76 65" xmlns="http://www.w3.org/2000/svg">
                      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[#0F172A] text-sm font-bold leading-tight">{jobTitle}</h3>
                    <p className="text-[#64748B] text-xs">{company}</p>
                  </div>
                </div>

                <div className="flex gap-2 relative z-10">
                  <div className="flex-1 bg-[#F8FAFC] rounded p-2 border border-[#E2E8F0]">
                    <span className="block text-[10px] text-[#64748B] uppercase">Match</span>
                    <span className="block text-[#3B82F6] font-mono text-sm font-bold">{matchScore}%</span>
                  </div>
                  <div className="flex-1 bg-[#F8FAFC] rounded p-2 border border-[#E2E8F0]">
                    <span className="block text-[10px] text-[#64748B] uppercase">Gap</span>
                    <span className="block text-[#EF4444] font-mono text-sm font-bold">{gapScore}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Keyword Gaps Widget */}
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex justify-between items-center">
                <label className="text-[#64748B] text-xs font-bold uppercase tracking-wider">
                  Keyword Gaps
                </label>
                <span className="text-[10px] bg-red-50 text-[#EF4444] px-1.5 py-0.5 rounded border border-red-200">
                  3 Critical
                </span>
              </div>
              <div className="flex flex-col gap-2 font-mono text-xs">
                {keywordGaps.map((gap: any, idx: number) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded border transition-colors ${
                      gap.completed
                        ? "bg-[#F8FAFC] border-[#E2E8F0] opacity-50"
                        : "bg-[#FFFFFF] border-[#E2E8F0] hover:border-primary/50 group cursor-pointer"
                    }`}
                  >
                    <span className={gap.completed ? "text-[#64748B] line-through" : "text-[#475569] group-hover:text-primary transition-colors"}>
                      {gap.name}
                    </span>
                    {gap.completed ? (
                      <CheckCircle className="h-3.5 w-3.5 text-[#22C55E]" />
                    ) : (
                      <PlusCircle className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 mt-auto border-t border-[#E2E8F0]">
            <Button className="w-full bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0]">
              Advanced Config
            </Button>
          </div>
        </aside>

        {/* Center: Editor Canvas */}
        <main className="flex-1 flex flex-col relative bg-[#F8FAFC]">
          {/* Breadcrumbs & Heading */}
          <div className="flex flex-col border-b border-[#E2E8F0] bg-[#FFFFFF] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
            <div className="px-8 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs mb-2">
                  <a className="text-[#64748B] hover:text-[#475569]" href="#">Home</a>
                  <span className="text-[#64748B]">/</span>
                  <span className="text-primary font-medium">Writing Forge</span>
                </div>
                <div className="flex items-center gap-3">
                  <h1 className="text-[#0F172A] text-2xl font-black leading-tight tracking-tight">
                    {resumeTitle}
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-[#22C55E] border border-green-200 uppercase tracking-wide">
                    {resume ? 'Loaded' : 'No Resume'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleHistory}
                  variant="ghost"
                  className="text-[#475569] hover:text-[#0F172A]"
                >
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
                <Button
                  onClick={handleRegenerate}
                  className="bg-primary/10 hover:bg-primary/20 text-primary hover:text-[#0F172A] border border-primary/30 hover:border-primary shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>

                {/* Locked Download Button */}
                <div
                  className="relative"
                  onMouseEnter={() => setShowUpgradeTooltip(true)}
                  onMouseLeave={() => setShowUpgradeTooltip(false)}
                >
                  <Button
                    onClick={handleDownloadPDF}
                    disabled
                    className="bg-slate-100 text-[#64748B] cursor-not-allowed border border-[#E2E8F0] opacity-60 relative"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Download PDF
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                  </Button>

                  {/* Enhanced Tooltip with Power Gradient CTA */}
                  {showUpgradeTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full right-0 mt-3 w-72 p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-lg z-50"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="text-primary shrink-0 pt-0.5">
                          <Diamond className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-[#0F172A] text-sm font-bold mb-1">Interview Sprint Required</p>
                          <p className="text-[#64748B] text-xs leading-relaxed">
                            Unlock professional PDF exports, ATS optimization, and unlimited regenerations.
                          </p>
                        </div>
                      </div>

                      {/* Benefits List */}
                      <div className="space-y-2 mb-3 pl-9">
                        <div className="flex items-center gap-2 text-xs text-[#475569]">
                          <span className="text-[#22C55E]">✓</span>
                          <span>Unlimited PDF downloads</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#475569]">
                          <span className="text-[#22C55E]">✓</span>
                          <span>ATS-optimized formatting</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#475569]">
                          <span className="text-[#22C55E]">✓</span>
                          <span>AI-powered improvements</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {/* Navigate to pricing */}}
                        className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#8B5CF6]/90 hover:to-[#6366F1]/90 w-full px-4 py-2.5 rounded-lg text-white text-sm font-bold border-0 flex items-center justify-center gap-2 group"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Upgrade to Interview Sprint</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Editor Toolbar */}
            <div className="px-8 py-2 flex items-center gap-1 border-t border-[#E2E8F0]">
              <Button variant="ghost" size="sm" className="p-1.5 text-[#64748B] hover:text-[#0F172A]">
                <Bold className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1.5 text-[#64748B] hover:text-[#0F172A]">
                <Italic className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1.5 text-[#64748B] hover:text-[#0F172A]">
                <Underline className="h-5 w-5" />
              </Button>
              <div className="w-px h-5 bg-[#E2E8F0] mx-2" />
              <Button variant="ghost" size="sm" className="p-1.5 text-[#64748B] hover:text-[#0F172A]">
                <List className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1.5 text-[#64748B] hover:text-[#0F172A]">
                <ListOrdered className="h-5 w-5" />
              </Button>
              <div className="w-px h-5 bg-[#E2E8F0] mx-2" />
              <Button variant="ghost" size="sm" className="p-1.5 text-[#64748B] hover:text-[#0F172A]">
                <Link2 className="h-5 w-5" />
              </Button>
              <div className="flex-1" />
              <span className="text-xs text-[#64748B] font-mono">Markdown Supported</span>
            </div>
          </div>

          {/* Editor Surface */}
          <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#F8FAFC] relative">
            {/* Abstract Background Pattern */}
            <div
              className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#64748B 1px, transparent 1px)",
                backgroundSize: "24px 24px"
              }}
            />

            {/* Paywall Overlay */}
            {!hasInterviewSprint && (
              <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center p-8 max-w-md">
                  <Lock className="h-16 w-16 text-[#8B5CF6] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#0F172A] mb-2">Interview Sprint Required</h3>
                  <p className="text-[#475569] text-sm mb-6">
                    Unlock the Writing Forge to create and edit professional resumes with AI assistance.
                  </p>
                  <Button
                    onClick={onUpgrade}
                    className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#8B5CF6]/90 hover:to-[#6366F1]/90 text-white font-bold"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Upgrade Now
                  </Button>
                </div>
              </div>
            )}

            <div className="w-full max-w-[800px] z-10 relative space-y-6">
              {/* ML-Powered Analysis - Premium Feature - MOVED TO TOP */}
              {hasInterviewSprint && resume?.ocrText && resume.ocrText.length >= 100 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
                >
                  <h3 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#8B5CF6]" />
                    ML-Powered Resume Analysis
                  </h3>
                  <MLInsights
                    resumeText={resume.ocrText}
                    jobDescription={resume.jobDescription || ""}
                  />
                </motion.div>
              )}

              {/* Resume Document - Real Content */}
              <div className="bg-[#FFFFFF] min-h-[1100px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-sm p-16 text-[#0F172A] border border-[#E2E8F0]">
                {/* Show real resume content if available */}
                {resume?.ocrText ? (
                  <div className="prose prose-slate max-w-none">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-[#475569] font-sans">
                      {resume.ocrText}
                    </pre>
                  </div>
                ) : (
                  <>
                    {/* Fallback to template if no resume loaded */}
                    <div className="border-b border-[#E2E8F0] pb-8 mb-8">
                      <h1 className="text-4xl font-bold text-[#0F172A] mb-2">{currentUser?.name || "Your Name"}</h1>
                      <p className="text-[#64748B] text-lg">Upload a resume to get started</p>
                      <div className="flex gap-4 mt-4 text-sm text-[#64748B]">
                        {currentUser?.email && <span>{currentUser.email}</span>}
                      </div>
                    </div>
                    <div className="text-center py-12">
                      <p className="text-[#64748B] text-base">
                        No resume loaded. Upload a resume from the dashboard to start editing.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
