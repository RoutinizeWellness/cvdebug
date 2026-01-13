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

  if (!resume) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-500">Loading ATS view...</div>
      </div>
    );
  }

  const score = resume.score || 0;
  const matchedKeywords = resume.matchedKeywords || [];
  const missingKeywords = resume.missingKeywords || [];
  const formatIssues = resume.formatIssues || [];

  // Use real resume data
  const currentCandidate = {
    id: 0,
    name: resume.title || "Your Resume",
    role: resume.category || resume.jobTitle || "Candidate",
    score: score,
    appliedTime: "Now",
    email: "your.email@example.com",
    location: resume.location || "Location",
    avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(resume.title || "User") + "&background=6366f1&color=fff&size=128"
  };
  const scoreColor = score >= 80 ? "text-green-400" : score >= 60 ? "text-yellow-500" : "text-orange-500";
  const scoreLabel = score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Fair";

  // Calculate seniority level based on score
  const seniorityLevel = score >= 85 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0;

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC] overflow-hidden">
      {/* Top Header */}
      <header className="h-12 md:h-16 flex items-center justify-between px-3 md:px-6 border-b border-slate-200 bg-slate-50 shrink-0 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-900">
            <span className="material-symbols-outlined text-primary text-3xl">hub</span>
            <span className="text-lg font-bold tracking-tight">CVDebug ATS</span>
          </div>
          <div className="h-6 w-px bg-slate-700"></div>
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <button onClick={onBack} className="hover:text-slate-900 transition-colors">Jobs</button>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <a className="hover:text-slate-900 transition-colors" href="#">Engineering</a>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 font-medium">Senior Frontend Dev #4092</span>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-700/50 rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-700/50 rounded-full transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
          <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">Recruiter Admin</p>
              <p className="text-xs text-slate-500">View as: Machine</p>
            </div>
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-9 border border-slate-200"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBOQ-YQ0_0nCFMoZVJ2JLVDTj1NIhT90s7LTFbT_Nt5QerzxGw42uUw_FWHGAEfnSIlO-dG7KAID9paUeW6mFogenyy3UD_Uh5MoKhRFDr0Kea3KVWxxRZtdt-UVX07xEQKErozksZk_HEkHWagqJFgowxPq5iDUqZA1NL54_gSoEN_y8cM-JbCpnzEpCGJ93x-i8LiFVOSUM7CrE6r7kBnNigg76KXqBjCRmyGW-1pFr8df50jlQF54GBv0NhN0S0ZXtCpLB8HrA")' }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL: Candidate List */}
        <aside className="w-80 flex flex-col border-r border-slate-200 bg-[#F8FAFC] shrink-0">
          {/* Search & Filter */}
          <div className="p-4 border-b border-slate-200 bg-[#F8FAFC]/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-700 font-semibold text-sm md:text-base">Your Resume</h2>
              <button onClick={onBack} className="text-primary text-xs font-medium hover:underline">Back</button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-[20px]">search</span>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                placeholder="Search by keyword..."
                type="text"
              />
            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              <span className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 whitespace-nowrap cursor-pointer hover:border-slate-500">
                Unreviewed
              </span>
              <span className="px-2 py-1 bg-primary/20 border border-primary/30 rounded text-xs text-primary whitespace-nowrap cursor-pointer">
                High Match
              </span>
              <span className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 whitespace-nowrap cursor-pointer hover:border-slate-500">
                Local
              </span>
            </div>
          </div>

          {/* Resume Card */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="group flex flex-col gap-3 p-4 rounded-lg border-2 border-primary bg-slate-50">
                <div className="relative shrink-0 mx-auto">
                  <div
                    className="bg-center bg-no-repeat bg-cover rounded-full size-20"
                    style={{ backgroundImage: `url("${currentCandidate.avatar}")` }}
                  ></div>
                  <div className="absolute -bottom-1 -right-1 bg-[#F8FAFC] rounded-full p-0.5">
                    <div className="size-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <h3 className="text-base font-medium text-slate-900 mb-1">
                      {currentCandidate.name}
                    </h3>
                    <span className={`text-3xl font-bold ${scoreColor} mb-2`}>
                      {currentCandidate.score}%
                    </span>
                    <p className="text-xs text-slate-500 mb-1">
                      {currentCandidate.role}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Analyzed {currentCandidate.appliedTime}
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        <span>{currentCandidate.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
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
          <div className="sticky top-0 z-20 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">{currentCandidate.name}</h1>
              <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  San Francisco, CA
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">mail</span>
                  candidate@example.com
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">link</span>
                  github.com/candidate
                </span>
              </div>
            </div>
            <div className="flex bg-slate-50 rounded-lg p-1 border border-slate-200">
              <button
                onClick={() => setActiveView("parsed")}
                className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeView === "parsed" ? "bg-primary text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Parsed View
              </button>
              <button
                onClick={() => setActiveView("raw")}
                className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeView === "raw" ? "bg-primary text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Raw Text
              </button>
              <button
                onClick={() => setActiveView("pdf")}
                className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeView === "pdf" ? "bg-primary text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Original PDF
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Integrity Audit Alert */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">gavel</span>
                    Integrity Audit Report
                  </h3>
                  <span className="text-xs font-mono text-slate-500">Scan ID: #9923-AX</span>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {formatIssues.length > 0 && (
                    <div className="flex items-start gap-3 p-3 rounded bg-red-500/10 border border-red-500/20">
                      <span className="material-symbols-outlined text-red-500 mt-0.5">warning</span>
                      <div>
                        <p className="text-red-400 font-bold text-xs uppercase tracking-wider mb-1">Format Issues</p>
                        <p className="text-slate-600 text-sm">{formatIssues[0]?.issue || "Issues detected in document"}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3 p-3 rounded bg-emerald-500/10 border border-emerald-500/20">
                    <span className="material-symbols-outlined text-emerald-500 mt-0.5">verified</span>
                    <div>
                      <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">Structure</p>
                      <p className="text-slate-600 text-sm">PDF Structure is valid and machine-readable.</p>
                    </div>
                  </div>
                  {missingKeywords.length > 0 && (
                    <div className="flex items-start gap-3 p-3 rounded bg-amber-500/10 border border-amber-500/20">
                      <span className="material-symbols-outlined text-amber-500 mt-0.5">find_in_page</span>
                      <div>
                        <p className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">Keywords</p>
                        <p className="text-slate-600 text-sm">Missing {missingKeywords.length} critical keywords from JD.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Summary */}
              <section className="group relative">
                <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-slate-700 group-hover:bg-primary/50 transition-colors"></div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 pl-4">Professional Summary</h4>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 shadow-sm">
                  <p className="text-slate-600 leading-relaxed">
                    {resume.analysis ? (
                      resume.analysis.split('\n').slice(0, 3).join(' ')
                    ) : (
                      <>
                        Senior professional with <span className="text-slate-900 bg-primary/20 px-1 rounded font-medium">excellent experience</span> in the field.
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
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Skills (Extracted)</h4>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                    {score >= 80 ? "High Match with JD" : "Partial Match with JD"}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 shadow-sm">
                  <div className="flex flex-wrap gap-2">
                    {matchedKeywords.slice(0, 8).map((keyword: string, i: number) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-1 rounded bg-primary/10 text-primary border border-primary/20 text-sm font-mono font-medium">
                        <span className="material-symbols-outlined text-[14px] mr-1">check</span>
                        {keyword}
                      </span>
                    ))}
                    {missingKeywords.slice(0, 3).map((item: any, i: number) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-1 rounded bg-slate-700/50 text-slate-600 border border-slate-600 text-sm font-mono">
                        {typeof item === 'string' ? item : item.keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Work History */}
              <section className="group relative pb-8">
                <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-slate-700 group-hover:bg-primary/50 transition-colors"></div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 pl-4">Work History</h4>
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3">
                      <span className="text-xs font-mono text-slate-500 bg-slate-700 px-2 py-1 rounded">Recent</span>
                    </div>
                    <h5 className="text-slate-900 font-semibold text-lg">Professional Experience</h5>
                    <p className="text-primary text-sm font-medium mb-4">Various Companies • Multiple Years</p>
                    <ul className="list-disc list-outside ml-4 space-y-2 text-slate-600 text-sm marker:text-slate-600">
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
        <aside className="w-[340px] flex flex-col border-l border-slate-200 bg-slate-50 shrink-0 overflow-y-auto">
          {/* Gauge Section */}
          <div className="p-6 border-b border-slate-200 text-center">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Job Fit Score</h2>
            <div className="relative w-48 h-48 mx-auto mb-4 flex items-center justify-center">
              {/* SVG Gauge Background */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-slate-700"
                  cx="96"
                  cy="96"
                  fill="transparent"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                ></circle>
                {/* Gauge Progress */}
                <circle
                  className="text-primary transition-all duration-1000 ease-out"
                  cx="96"
                  cy="96"
                  fill="transparent"
                  r="88"
                  stroke="currentColor"
                  strokeDasharray="552"
                  strokeDashoffset={552 - (552 * score) / 100}
                  strokeWidth="12"
                ></circle>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-bold text-slate-900 tracking-tighter">{score}</span>
                <span className={`text-sm font-medium mt-1 ${scoreColor}`}>{scoreLabel}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 px-4">
              Based on skills, experience duration, and semantic role matching.
            </p>
          </div>

          {/* Analysis Cards */}
          <div className="p-4 space-y-4 flex-1">
            {/* Seniority Match */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-slate-900">Seniority Level</h3>
                <span className="text-xs font-mono text-green-400">
                  {seniorityLevel >= 2 ? "Match" : "Below"}
                </span>
              </div>
              {/* Stepper */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2 font-mono uppercase">
                <span className={seniorityLevel === 0 ? "text-slate-900 font-bold" : ""}>Jr</span>
                <span className={seniorityLevel === 1 ? "text-slate-900 font-bold" : ""}>Mid</span>
                <span className={seniorityLevel === 2 ? "text-slate-900 font-bold" : ""}>Senior</span>
                <span className={seniorityLevel === 3 ? "text-slate-900 font-bold" : ""}>Lead</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden flex">
                <div className={`w-1/4 ${seniorityLevel >= 0 ? "bg-slate-600" : "bg-slate-700"} border-r border-[#0F172A]`}></div>
                <div className={`w-1/4 ${seniorityLevel >= 1 ? "bg-slate-600" : "bg-slate-700"} border-r border-[#0F172A]`}></div>
                <div className={`w-1/4 ${seniorityLevel >= 2 ? "bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-slate-700"} border-r border-[#0F172A]`}></div>
                <div className={`w-1/4 ${seniorityLevel >= 3 ? "bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-slate-700"}`}></div>
              </div>
            </div>

            {/* Gap Analysis */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-900 mb-3">Technical Gap Analysis</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1 flex justify-between">
                    <span>Found (High Importance)</span>
                    <span className="text-green-500">{matchedKeywords.length}/{matchedKeywords.length + missingKeywords.length}</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedKeywords.slice(0, 4).map((keyword: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-green-500/10 text-green-400 border border-green-500/20">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                {missingKeywords.length > 0 && (
                  <>
                    <div className="h-px bg-slate-700 my-2"></div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1 flex justify-between">
                        <span>Missing (Nice to have)</span>
                        <span className="text-amber-500">{missingKeywords.length}</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {missingKeywords.slice(0, 2).map((item: any, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">close</span>
                            {typeof item === 'string' ? item : item.keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Soft Skills AI Guess */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-400 text-sm">psychology</span>
                Soft Skills AI Inference
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Leadership</span>
                  <div className="flex gap-0.5">
                    <div className={`w-8 h-1.5 rounded-full ${score >= 70 ? "bg-teal-500" : "bg-teal-500/30"}`}></div>
                    <div className={`w-8 h-1.5 rounded-full ${score >= 80 ? "bg-teal-500" : "bg-teal-500/30"}`}></div>
                    <div className={`w-8 h-1.5 rounded-full ${score >= 90 ? "bg-teal-500" : "bg-teal-500/30"}`}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Communication</span>
                  <div className="flex gap-0.5">
                    <div className={`w-8 h-1.5 rounded-full ${score >= 60 ? "bg-teal-500" : "bg-teal-500/30"}`}></div>
                    <div className={`w-8 h-1.5 rounded-full ${score >= 75 ? "bg-teal-500" : "bg-teal-500/30"}`}></div>
                    <div className="w-8 h-1.5 rounded-full bg-teal-500/30"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Actions Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 sticky bottom-0 z-10">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-600 text-slate-600 hover:bg-slate-700 hover:text-slate-900 transition-all text-sm font-medium">
                <span className="material-symbols-outlined text-lg">close</span>
                Reject
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-600 text-slate-600 hover:bg-slate-700 hover:text-slate-900 transition-all text-sm font-medium">
                <span className="material-symbols-outlined text-lg">schedule</span>
                Waitlist
              </button>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary hover:bg-blue-600 text-slate-900 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all text-sm font-bold">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              Advance to Interview
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
