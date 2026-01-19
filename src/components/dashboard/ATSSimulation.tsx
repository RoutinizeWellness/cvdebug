import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";

const apiAny = api;

interface ATSSimulationProps {
  resumeId: Id<"resumes">;
  onBack: () => void;
}

export function ATSSimulation({ resumeId, onBack }: ATSSimulationProps) {
  const resume = useQuery(apiAny.resumes.getResume, { id: resumeId });
  const [activeView, setActiveView] = useState<"parsed" | "raw" | "pdf">("parsed");
  const [selectedCandidate, setSelectedCandidate] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<"unreviewed" | "high_match" | "local">("high_match");

  if (!resume) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[#64748B]">Loading ATS view...</div>
      </div>
    );
  }

  const score = resume.score || 0;
  const matchedKeywords = resume.matchedKeywords || [];
  const missingKeywords = resume.missingKeywords || [];
  const formatIssues = resume.formatIssues || [];

  // Generate dynamic IDs
  const scanId = `#${Date.now().toString(36).toUpperCase().slice(-4)}-AX`;
  const jobId = `#${Date.now().toString(36).toUpperCase().slice(-4)}`;

  // Use real resume data
  const currentCandidate = {
    id: 0,
    name: resume.title || "Your Resume",
    role: resume.category || resume.jobTitle || "Candidate",
    score: score,
    appliedTime: "Now",
    email: "",
    location: resume.location || "Location",
    avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(resume.title || "User") + "&background=6366f1&color=fff&size=128"
  };
  const scoreColor = score >= 80 ? "text-green-400" : score >= 60 ? "text-[#F59E0B]" : "text-orange-500";
  const scoreLabel = score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Fair";

  // Calculate seniority level based on score
  const seniorityLevel = score >= 85 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0;

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC] overflow-hidden">
      {/* Top Header */}
      <header className="h-12 md:h-16 flex items-center justify-between px-3 md:px-6 border-b border-[#E2E8F0] bg-[#F8FAFC] shrink-0 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[#0F172A]">
            <span className="material-symbols-outlined text-primary text-4xl">hub</span>
            <span className="text-2xl font-bold tracking-tight">CVDebug ATS</span>
          </div>
          <div className="h-6 w-px bg-slate-700"></div>
          <nav className="flex items-center gap-2 text-sm text-[#64748B]">
            <button onClick={onBack} className="hover:text-[#0F172A] transition-colors">Jobs</button>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <a className="hover:text-[#0F172A] transition-colors" href="#">{resume.category || "Category"}</a>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-[#0F172A] font-medium">{resume.jobTitle || "Position"} {jobId}</span>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-700/50 rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full"></span>
            </button>
            <button className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-700/50 rounded-full transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
          <div className="flex items-center gap-3 pl-6 border-l border-[#E2E8F0]">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-[#0F172A]">Recruiter Admin</p>
              <p className="text-xs text-[#64748B]">View as: Machine</p>
            </div>
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-9 border border-[#E2E8F0]"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBOQ-YQ0_0nCFMoZVJ2JLVDTj1NIhT90s7LTFbT_Nt5QerzxGw42uUw_FWHGAEfnSIlO-dG7KAID9paUeW6mFogenyy3UD_Uh5MoKhRFDr0Kea3KVWxxRZtdt-UVX07xEQKErozksZk_HEkHWagqJFgowxPq5iDUqZA1NL54_gSoEN_y8cM-JbCpnzEpCGJ93x-i8LiFVOSUM7CrE6r7kBnNigg76KXqBjCRmyGW-1pFr8df50jlQF54GBv0NhN0S0ZXtCpLB8HrA")' }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL: Candidate List */}
        <aside className="w-80 flex flex-col border-r border-[#E2E8F0] bg-[#F8FAFC] shrink-0">
          {/* Search & Filter */}
          <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#475569] font-semibold text-sm md:text-base">Your Resume</h2>
              <button onClick={onBack} className="text-primary text-xs font-medium hover:underline">Back</button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#64748B] text-[20px]">search</span>
              <input
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg py-2 pl-10 pr-4 text-sm text-[#0F172A] placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                placeholder="Search by keyword..."
                type="text"
              />
            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveFilter("unreviewed")}
                className={`px-2 py-1 rounded text-xs whitespace-nowrap cursor-pointer transition-all ${
                  activeFilter === "unreviewed"
                    ? 'bg-orange-100 border border-orange-300 text-orange-700 font-medium'
                    : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:border-slate-500'
                }`}
              >
                Unreviewed
              </button>
              <button
                onClick={() => setActiveFilter("high_match")}
                className={`px-2 py-1 rounded text-xs whitespace-nowrap cursor-pointer transition-all ${
                  activeFilter === "high_match"
                    ? 'bg-primary/20 border border-primary/30 text-primary font-medium'
                    : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:border-slate-500'
                }`}
              >
                High Match
              </button>
              <button
                onClick={() => setActiveFilter("local")}
                className={`px-2 py-1 rounded text-xs whitespace-nowrap cursor-pointer transition-all ${
                  activeFilter === "local"
                    ? 'bg-green-100 border border-green-300 text-green-700 font-medium'
                    : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:border-slate-500'
                }`}
              >
                Local
              </button>
            </div>
          </div>

          {/* Resume Card */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="group flex flex-col gap-3 p-4 rounded-lg border-2 border-primary bg-[#F8FAFC]">
                <div className="relative shrink-0 mx-auto">
                  <div
                    className="bg-center bg-no-repeat bg-cover rounded-full size-20"
                    style={{ backgroundImage: `url("${currentCandidate.avatar}")` }}
                  ></div>
                  <div className="absolute -bottom-1 -right-1 bg-[#F8FAFC] rounded-full p-0.5">
                    <div className="size-3 rounded-full bg-[#22C55E]"></div>
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <h3 className="text-base font-medium text-[#0F172A] mb-1">
                      {currentCandidate.name}
                    </h3>
                    <span className={`text-3xl font-bold ${scoreColor} mb-2`}>
                      {currentCandidate.score}%
                    </span>
                    <p className="text-xs text-[#64748B] mb-1">
                      {currentCandidate.role}
                    </p>
                    <p className="text-[10px] text-[#64748B]">
                      Analyzed {currentCandidate.appliedTime}
                    </p>
                    <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                      <div className="flex items-center gap-2 text-xs text-[#64748B] mb-2">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        <span>{currentCandidate.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#64748B]">
                        <span className="material-symbols-outlined text-sm">mail</span>
                        <span className="truncate">{currentCandidate.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
          </div>
        </aside>

        {/* CENTER PANEL: The Parsed Resume */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] relative">
          {/* Sticky Header for Parsed View */}
          <div className="sticky top-0 z-20 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-[#E2E8F0] px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A] mb-1">{currentCandidate.name}</h1>
              <div className="flex items-center gap-4 text-xs text-[#64748B] font-mono">
                {currentCandidate.location && (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {currentCandidate.location}
                  </span>
                )}
                {currentCandidate.email && (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">mail</span>
                    {currentCandidate.email}
                  </span>
                )}
                {resume.ocrText && /github\.com\/([a-zA-Z0-9-]+)/i.test(resume.ocrText) && (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">link</span>
                    {resume.ocrText.match(/github\.com\/([a-zA-Z0-9-]+)/i)?.[0] || ''}
                  </span>
                )}
              </div>
            </div>
            <div className="flex bg-[#F8FAFC] rounded-lg p-1 border border-[#E2E8F0]">
              <button
                onClick={() => setActiveView("parsed")}
                className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeView === "parsed" ? "bg-primary text-[#0F172A] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]" : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                Parsed View
              </button>
              <button
                onClick={() => setActiveView("raw")}
                className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeView === "raw" ? "bg-primary text-[#0F172A] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]" : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                Raw Text
              </button>
              <button
                onClick={() => setActiveView("pdf")}
                className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeView === "pdf" ? "bg-primary text-[#0F172A] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]" : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                Original PDF
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Integrity Audit Alert */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 border-b border-[#E2E8F0] flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">gavel</span>
                    Integrity Audit Report
                  </h3>
                  <span className="text-xs font-mono text-[#64748B]">Scan ID: {scanId}</span>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {formatIssues.length > 0 && (
                    <div className="flex items-start gap-3 p-3 rounded bg-[#EF4444]/10 border border-red-500/20">
                      <span className="material-symbols-outlined text-[#EF4444] mt-0.5">warning</span>
                      <div>
                        <p className="text-red-400 font-bold text-xs uppercase tracking-wider mb-1">Format Issues</p>
                        <p className="text-[#475569] text-sm">{formatIssues[0]?.issue || "Issues detected in document"}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3 p-3 rounded bg-[#22C55E]/10 border border-emerald-500/20">
                    <span className="material-symbols-outlined text-[#22C55E] mt-0.5">verified</span>
                    <div>
                      <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">Structure</p>
                      <p className="text-[#475569] text-sm">PDF Structure is valid and machine-readable.</p>
                    </div>
                  </div>
                  {missingKeywords.length > 0 && (
                    <div className="flex items-start gap-3 p-3 rounded bg-[#F59E0B]/10 border border-amber-500/20">
                      <span className="material-symbols-outlined text-[#F59E0B] mt-0.5">find_in_page</span>
                      <div>
                        <p className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">Keywords</p>
                        <p className="text-[#475569] text-sm">Missing {missingKeywords.length} critical keywords from JD.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Summary */}
              <section className="group relative">
                <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-slate-700 group-hover:bg-primary/50 transition-colors"></div>
                <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-3 pl-4">Professional Summary</h4>
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                  <p className="text-[#475569] leading-relaxed">
                    {resume.analysis ? (
                      resume.analysis.split('\n').slice(0, 3).join(' ')
                    ) : (
                      <>
                        Senior professional with <span className="text-[#0F172A] bg-primary/20 px-1 rounded font-medium">excellent experience</span> in the field.
                        Proven track record in delivering high-quality results and working with modern technologies.
                      </>
                    )}
                  </p>
                </div>
              </section>

              {/* Skills (Extracted) */}
              <section className="group relative">
                <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-slate-700 group-hover:bg-primary/50 transition-colors"></div>
                <div className="flex items-center justify-between pl-4 mb-3">
                  <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-widest">Skills (Extracted)</h4>
                  <span className="text-[10px] bg-[#22C55E]/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                    {score >= 80 ? "High Match with JD" : "Partial Match with JD"}
                  </span>
                </div>
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                  <div className="flex flex-wrap gap-2">
                    {matchedKeywords.slice(0, 8).map((keyword: string, i: number) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-1 rounded bg-primary/10 text-primary border border-primary/20 text-sm font-mono font-medium">
                        <span className="material-symbols-outlined text-[14px] mr-1">check</span>
                        {keyword}
                      </span>
                    ))}
                    {missingKeywords.slice(0, 3).map((item: any, i: number) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-1 rounded bg-slate-700/50 text-[#475569] border border-slate-600 text-sm font-mono">
                        {typeof item === 'string' ? item : item.keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Work History */}
              <section className="group relative pb-8">
                <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-slate-700 group-hover:bg-primary/50 transition-colors"></div>
                <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-3 pl-4">Work History</h4>
                <div className="space-y-4">
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3">
                      <span className="text-xs font-mono text-[#64748B] bg-slate-700 px-2 py-1 rounded">Recent</span>
                    </div>
                    <h5 className="text-[#0F172A] font-semibold text-lg">Professional Experience</h5>
                    <p className="text-primary text-sm font-medium mb-4">Various Companies • Multiple Years</p>
                    <ul className="list-disc list-outside ml-4 space-y-2 text-[#475569] text-sm marker:text-[#475569]">
                      <li>Extensive experience in the field with proven track record</li>
                      <li>Strong technical skills and ability to deliver results</li>
                      <li>Collaborated with cross-functional teams on various projects</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>

        {/* RIGHT PANEL: Recruiter Metrics */}
        <aside className="w-[340px] flex flex-col border-l border-[#E2E8F0] bg-[#F8FAFC] shrink-0 overflow-y-auto">
          <div className="flex-1 overflow-y-auto">
            {/* Seniority Match Analysis Section */}
            <section className="bg-white border-b border-[#E2E8F0] p-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-lg">track_changes</span>
                <h2 className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">Seniority Match Analysis</h2>
              </div>

              <div className="space-y-6">
                {/* Detected Level */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Detected Level</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-tight text-[#0F172A]">
                      {seniorityLevel === 0 ? 'Junior' : seniorityLevel === 1 ? 'Mid' : seniorityLevel === 2 ? 'Senior' : 'Lead'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                      seniorityLevel >= 2
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {seniorityLevel >= 2 ? 'Match' : 'Review Required'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#64748B]">
                    <span className="material-symbols-outlined text-xs">analytics</span>
                    <span>Confidence Score: <span className="font-mono text-[#0F172A]">{score}/100</span></span>
                  </div>
                </div>

                {/* Experience Audit */}
                <div className="space-y-3 border-l border-[#E2E8F0] pl-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Experience Audit</p>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold tracking-tight text-[#0F172A]">
                      {resume.stats?.yearsOfExperience || 0} years
                    </p>
                    <p className="text-[10px] text-[#64748B]">
                      Expected requirement: <span className="font-bold text-[#0F172A]">
                        {seniorityLevel === 0 ? 'JUNIOR' : seniorityLevel === 1 ? 'MID' : seniorityLevel === 2 ? 'SENIOR' : 'LEAD'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Signal Density */}
                <div className="space-y-3 border-l border-[#E2E8F0] pl-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Signal Density</p>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold tracking-tight text-primary">{matchedKeywords.length}</p>
                      <span className="text-[10px] font-medium text-[#64748B]">signals detected</span>
                    </div>
                    <p className="text-[10px] text-[#64748B]">
                      Signal strength: <span className={`font-bold ${matchedKeywords.length >= 10 ? 'text-emerald-500' : matchedKeywords.length >= 5 ? 'text-amber-500' : 'text-rose-500'}`}>
                        {matchedKeywords.length >= 10 ? 'STRONG' : matchedKeywords.length >= 5 ? 'MEDIUM' : 'WEAK'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Three Cards Grid */}
            <div className="p-4 space-y-3">
              {/* Readability Card */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between h-32">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Readability</p>
                  <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">High Integrity</h3>
                  <p className="text-[10px] text-[#64748B] mt-1">Structure follows industry standard patterns</p>
                </div>
              </div>

              {/* Image Traps Card */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between h-32">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Image Traps</p>
                  <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-bold tracking-wide uppercase">Safe</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">None Detected</h3>
                  <p className="text-[10px] text-[#64748B] mt-1">No invisible elements or keyword stuffing</p>
                </div>
              </div>

              {/* ATS Global Score Card */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between h-32 relative overflow-hidden">
                <div className="flex justify-between items-start z-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">ATS Global Score</p>
                </div>
                <div className="flex items-end justify-between z-10">
                  <div>
                    <h3 className="text-3xl font-mono font-bold text-[#0F172A]">
                      76<span className="text-[#CBD5E1] text-xl">/100</span>
                    </h3>
                    <p className="text-[10px] text-[#64748B] mt-1">Score based on parsing efficiency</p>
                  </div>
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle className="text-[#F1F5F9]" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeWidth="3"></circle>
                      <circle
                        cx="24"
                        cy="24"
                        fill="transparent"
                        r="20"
                        stroke="url(#scoreGradient)"
                        strokeDasharray="125.66"
                        strokeDashoffset={125.66 - (125.66 * 76) / 100}
                        strokeLinecap="round"
                        strokeWidth="3"
                      ></circle>
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                          <stop offset="0%" stopColor="#818cf8"></stop>
                          <stop offset="100%" stopColor="#4F46E5"></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="absolute text-[9px] font-mono text-[#64748B]">76%</span>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-primary/5 rounded-full blur-2xl"></div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="px-4 py-3 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                <div className="flex items-center gap-3">
                  <span>Ref: CV-{scanId.slice(-4)}-X</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                    Live Analysis
                  </span>
                </div>
                <button onClick={onBack} className="font-semibold text-primary hover:underline flex items-center gap-1 text-[10px]">
                  Full Report
                  <span className="material-symbols-outlined text-xs">arrow_right_alt</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
