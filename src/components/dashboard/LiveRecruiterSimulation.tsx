import { useState } from "react";
import { motion } from "framer-motion";

interface LiveRecruiterSimulationProps {
  resumeText: string;
  score: number;
  missingKeywords?: string[];
  matchedKeywords?: string[];
  formatIssues?: Array<{ issue: string; severity?: string }>;
  targetRole?: string;
  candidateName?: string;
  candidateEmail?: string;
  candidateLocation?: string;
}

export function LiveRecruiterSimulation({
  resumeText,
  score,
  missingKeywords = [],
  matchedKeywords = [],
  formatIssues = [],
  targetRole = "Data Science",
  candidateName = "Professional Candidate",
  candidateEmail = "candidate@example.com",
  candidateLocation = "San Francisco, CA"
}: LiveRecruiterSimulationProps) {
  const [viewMode, setViewMode] = useState<"parsed" | "raw" | "pdf">("parsed");
  const [isDarkMode] = useState(true);

  // Extract professional summary from resume text (first 200 chars or first paragraph)
  const extractSummary = (text: string) => {
    if (!text) return "Data Scientist with 5+ years of experience leveraging machine learning and statistical modeling to solve complex business problems.";

    const lines = text.split('\n').filter(l => l.trim());
    const summaryLine = lines.find(line =>
      line.length > 100 &&
      !line.toLowerCase().includes('education') &&
      !line.toLowerCase().includes('experience')
    );

    return summaryLine?.substring(0, 300) || lines[0]?.substring(0, 300) || "Experienced professional with proven track record.";
  };

  const professionalSummary = extractSummary(resumeText);

  // Calculate fit score percentage
  const fitScore = Math.min(100, Math.max(0, score));
  const fitLevel = fitScore >= 80 ? "Excellent" : fitScore >= 60 ? "Good" : "Fair";

  // Seniority level calculation
  const seniorityLevel = fitScore >= 75 ? "SENIOR" : fitScore >= 60 ? "MID" : "JUNIOR";
  const seniorityPosition = fitScore >= 75 ? "65%" : fitScore >= 60 ? "50%" : "35%";

  // Skills display
  const displaySkills = matchedKeywords.length > 0
    ? matchedKeywords.slice(0, 8)
    : ["sql", "python", "r", "excel", "big data", "hadoop", "spark", "forecasting"];

  // Technical gap
  const foundCount = matchedKeywords.length || 39;
  const requiredCount = foundCount + missingKeywords.length;

  // Format issues for display
  const hasFormatIssues = formatIssues.length > 0;
  const hasLinkedInIssue = formatIssues.some(f =>
    f.issue.toLowerCase().includes('linkedin') ||
    f.issue.toLowerCase().includes('profile')
  );

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#F8FAFC]">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-lg tracking-tight">
            <span className="material-symbols-outlined">analytics</span>
            <span>CVDebug ATS</span>
          </div>
          <span className="text-slate-600 text-sm">/</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
              {targetRole.toUpperCase()}
            </span>
            <span className="text-xs text-slate-500 font-mono">ID: th7ywqqk</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-sm">link</span> Share Link
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-sm">download</span> Download
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-sm">print</span> Print Report
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex items-center justify-center gap-2 py-4 bg-white border-b border-slate-200 overflow-x-auto px-4">
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors rounded-lg">
          <span className="material-symbols-outlined text-base">smart_toy</span> Robot View
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors rounded-lg">
          <span className="material-symbols-outlined text-base">vpn_key</span> Keywords
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors rounded-lg">
          <span className="material-symbols-outlined text-base">auto_fix_high</span> Fluff
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors rounded-lg">
          <span className="material-symbols-outlined text-base">dashboard</span> Format & Overview
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
          <span className="material-symbols-outlined text-base">support_agent</span> Recruiter
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 grid grid-cols-12 gap-6 max-w-[1920px] mx-auto w-full">
        {/* Left Column - Main Content */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          {/* Candidate Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-slate-900 font-bold text-lg shadow-sm">
                {candidateName.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg leading-tight">{candidateName}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">place</span> {candidateLocation}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">email</span> {candidateEmail}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">link</span> github.com/candidate
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-medium text-slate-700">JD</div>
                <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-slate-900 text-xs font-medium">HR</div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Recruiter Admin</p>
                <p className="text-xs font-medium text-emerald-600">View as: Machine</p>
              </div>
            </div>
          </motion.div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Format Issues */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm relative overflow-hidden group"
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${hasFormatIssues ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded ${hasFormatIssues ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  <span className="material-symbols-outlined">{hasFormatIssues ? 'warning' : 'verified'}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1 uppercase tracking-wider">
                    {hasFormatIssues ? 'Format Issues' : 'Format Health'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {hasFormatIssues && hasLinkedInIssue
                      ? 'Missing LinkedIn profile URL detected in header section.'
                      : 'All format checks passed successfully.'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Structure Integrity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 rounded text-emerald-600">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1 uppercase tracking-wider">Structure Integrity</h3>
                  <p className="text-sm text-slate-500">
                    PDF Structure is valid and machine-readable (ISO 19005-1).
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Parsed Candidate Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-[600px] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-4">
                <h3 className="text-sm font-bold text-slate-900">Parsed Candidate Data</h3>
                <div className="h-4 w-px bg-slate-200"></div>
                <div className="flex bg-slate-100 rounded p-0.5">
                  <button
                    onClick={() => setViewMode("parsed")}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      viewMode === "parsed"
                        ? 'shadow-sm bg-white text-blue-600'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Parsed View
                  </button>
                  <button
                    onClick={() => setViewMode("raw")}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      viewMode === "raw"
                        ? 'shadow-sm bg-white text-blue-600'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Raw Text
                  </button>
                  <button
                    onClick={() => setViewMode("pdf")}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      viewMode === "pdf"
                        ? 'shadow-sm bg-white text-blue-600'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Original PDF
                  </button>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-500">Scan ID: #9923-AX</div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed text-slate-700 bg-slate-50">
              {viewMode === "parsed" && (
                <>
                  {/* Professional Summary */}
                  <div className="mb-6">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider text-purple-700 bg-purple-100 rounded mb-2 border border-purple-200">
                      [PROFESSIONAL SUMMARY]
                    </span>
                    <p className="pl-4 border-l-2 border-purple-300 text-slate-700">
                      {professionalSummary}
                    </p>
                  </div>

                  {/* Skills Extracted */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider text-blue-700 bg-blue-100 rounded border border-blue-200">
                        [SKILLS EXTRACTED]
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                        High Match with JD
                      </span>
                    </div>
                    <div className="pl-4 border-l-2 border-blue-300 flex flex-wrap gap-2">
                      {displaySkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white rounded text-slate-700 border border-slate-200 flex items-center gap-1 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-xs text-emerald-600">check</span>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Work History */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-700 bg-amber-100 rounded border border-amber-200">
                        [WORK HISTORY]
                      </span>
                      <span className="text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">Most Recent</span>
                    </div>
                    <div className="pl-4 border-l-2 border-amber-300">
                      <h4 className="font-bold text-slate-900">Professional Experience</h4>
                      <p className="text-xs text-slate-600 mb-2">Various Companies • Multiple Years</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-700">
                        <li>Extensive experience in the field with proven track record</li>
                        <li>Strong technical skills and ability to deliver results</li>
                        <li>Collaborated with cross-functional teams on various projects</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {viewMode === "raw" && (
                <pre className="whitespace-pre-wrap text-xs text-slate-600">
                  {resumeText || "No raw text available. This is a preview of how the ATS system would display the extracted text from your resume."}
                </pre>
              )}

              {viewMode === "pdf" && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-slate-600">
                    <span className="material-symbols-outlined text-6xl mb-4">description</span>
                    <p className="text-sm">Original PDF preview would appear here</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          {/* Job Fit Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center"
          >
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4">Job Fit Score</h3>
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-slate-700"
                  cx="64"
                  cy="64"
                  fill="transparent"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                <circle
                  className="text-emerald-500"
                  cx="64"
                  cy="64"
                  fill="transparent"
                  r="56"
                  stroke="currentColor"
                  strokeDasharray="351.86"
                  strokeDashoffset={351.86 - (351.86 * fitScore) / 100}
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-slate-900">{fitScore}</span>
                <span className="text-[10px] font-medium text-emerald-600 uppercase mt-1">{fitLevel}</span>
              </div>
            </div>
            <p className="text-center text-xs text-slate-600 leading-relaxed px-2">
              Based on skills, experience duration, and semantic role matching algorithms.
            </p>
          </motion.div>

          {/* Seniority Level */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Seniority Level</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-medium border border-emerald-200">
                MATCH
              </span>
            </div>
            <div className="relative h-2 bg-slate-100 rounded-full mb-2 overflow-hidden border border-slate-200">
              <div
                className="absolute top-0 bottom-0 bg-blue-200 opacity-50"
                style={{ left: `${parseInt(seniorityPosition) - 15}%`, width: '30%' }}
              />
              <div
                className="absolute top-0 bottom-0 bg-blue-600 w-1 shadow-md z-10"
                style={{ left: seniorityPosition }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono uppercase">
              <span className={seniorityLevel === "JUNIOR" ? "text-blue-600 font-bold" : ""}>JR</span>
              <span className={seniorityLevel === "MID" ? "text-blue-600 font-bold" : ""}>MID</span>
              <span className={seniorityLevel === "SENIOR" ? "text-blue-600 font-bold" : ""}>SENIOR</span>
              <span>LEAD</span>
            </div>
          </motion.div>

          {/* Technical Gap Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
          >
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Technical Gap Analysis</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-700">Found (High Importance)</span>
              <span className="text-xs font-mono font-bold text-emerald-600">{foundCount}/{requiredCount}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {displaySkills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="text-[10px] px-2 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Soft Skills AI Inference */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-purple-600 text-sm">psychology</span>
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Soft Skills AI Inference</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700">Leadership</span>
                </div>
                <div className="flex gap-1">
                  <div className="h-1.5 w-full rounded-sm bg-purple-500"></div>
                  <div className="h-1.5 w-full rounded-sm bg-purple-500"></div>
                  <div className="h-1.5 w-full rounded-sm bg-purple-500"></div>
                  <div className="h-1.5 w-full rounded-sm bg-slate-200"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700">Communication</span>
                </div>
                <div className="flex gap-1">
                  <div className="h-1.5 w-full rounded-sm bg-purple-500"></div>
                  <div className="h-1.5 w-full rounded-sm bg-purple-500"></div>
                  <div className="h-1.5 w-full rounded-sm bg-purple-500"></div>
                  <div className="h-1.5 w-full rounded-sm bg-purple-500"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="mt-auto grid grid-cols-2 gap-3">
            <button className="col-span-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 rounded-lg transition-all text-sm font-semibold group shadow-sm">
              <span className="material-symbols-outlined text-base group-hover:text-red-600 transition-colors">close</span>
              Reject
            </button>
            <button className="col-span-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 rounded-lg transition-all text-sm font-semibold group shadow-sm">
              <span className="material-symbols-outlined text-base group-hover:text-amber-600 transition-colors">schedule</span>
              Waitlist
            </button>
            <button className="col-span-2 flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-slate-900 rounded-lg shadow-lg hover:shadow-xl transition-all text-base font-bold transform hover:-translate-y-0.5 active:translate-y-0">
              <span className="material-symbols-outlined">check_circle</span>
              Advance to Interview
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
